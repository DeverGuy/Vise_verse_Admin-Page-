"use client";

import React, { useContext, useState } from 'react';
import {
  UserPlus,
  Edit3,
  Trash2,
  AlertTriangle,
  Users,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { DataContext, Team } from '@/components/DataContext';
import { DataTable, Column } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { SearchFilterBar } from '@/components/admin/SearchFilterBar';
import { Pagination } from '@/components/admin/Pagination';
import { Modal } from '@/components/admin/Modal';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { TextInput, TextAreaInput } from '@/components/admin/FormControls';

export default function ParticipantsPortal() {
  const { teams, judges, assignJudgeToTeam, addTeam, editTeam, deleteTeam, disqualifyTeam } = useContext(DataContext);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals state
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [teamForm, setTeamForm] = useState({ name: '', theme: '', member1: '', member2: '', member3: '' });

  const [isDisqualifyModalOpen, setIsDisqualifyModalOpen] = useState(false);
  const [teamToDisqualify, setTeamToDisqualify] = useState<Team | null>(null);
  const [disqualifyReason, setDisqualifyReason] = useState('');

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);

  const openTeamModal = (team: Team | null = null) => {
    if (team) {
      setEditingTeam(team);
      setTeamForm({
        name: team.name,
        theme: team.theme,
        member1: team.members[0] || '',
        member2: team.members[1] || '',
        member3: team.members[2] || ''
      });
    } else {
      setEditingTeam(null);
      setTeamForm({ name: '', theme: '', member1: '', member2: '', member3: '' });
    }
    setIsTeamModalOpen(true);
  };

  const handleTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const membersArray = [teamForm.member1, teamForm.member2, teamForm.member3].filter(Boolean);
    const newTeamData = {
      name: teamForm.name,
      theme: teamForm.theme,
      members: membersArray
    };

    if (editingTeam) {
      editTeam(editingTeam.id, newTeamData);
    } else {
      addTeam(newTeamData);
    }
    setIsTeamModalOpen(false);
  };

  const openDisqualifyModal = (team: Team) => {
    setTeamToDisqualify(team);
    setDisqualifyReason('');
    setIsDisqualifyModalOpen(true);
  };

  const handleConfirmDisqualify = () => {
    if (teamToDisqualify) {
      disqualifyTeam(teamToDisqualify.id, disqualifyReason || 'Rule violation');
    }
    setIsDisqualifyModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (teamToDelete) {
      deleteTeam(teamToDelete.id);
    }
    setIsDeleteModalOpen(false);
  };

  // Filtered & Paginated list
  const filteredTeams = teams.filter(t => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.theme.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.members.some(m => m.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'Disqualified' && t.disqualified) ||
      (statusFilter === 'Assigned' && !t.disqualified && t.judgeId) ||
      (statusFilter === 'Pending' && !t.disqualified && !t.judgeId);
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredTeams.length / pageSize);
  const paginatedTeams = filteredTeams.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const columns: Column<Team>[] = [
    {
      key: 'name',
      header: 'Team Name & Details',
      render: (t) => (
        <div>
          <div className={`font-semibold ${t.disqualified ? 'text-status-error line-through' : 'text-text-primary'}`}>
            {t.name}
          </div>
          {t.disqualified && (
            <div className="text-xs text-status-error font-tech mt-0.5">
              Reason: {t.disqualifyReason}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'theme',
      header: 'Hackathon Theme',
      render: (t) => <span className="font-tech text-xs uppercase text-accent-tertiary">{t.theme}</span>
    },
    {
      key: 'members',
      header: 'Members',
      render: (t) => (
        <div className="text-xs text-text-secondary flex flex-wrap gap-1">
          {t.members.map((m, i) => (
            <span key={i} className="px-2 py-0.5 bg-surface-color-light rounded border border-border-color">
              {m}
            </span>
          ))}
        </div>
      )
    },
    {
      key: 'judgeId',
      header: 'Assigned Judge',
      render: (t) => (
        <select
          value={t.judgeId || ''}
          onChange={(e) => assignJudgeToTeam(t.id, e.target.value)}
          disabled={t.disqualified}
          className="bg-bg-color border border-border-color py-1.5 px-2.5 rounded text-text-primary text-xs font-body outline-none focus:border-accent-primary"
        >
          <option value="">-- Unassigned --</option>
          {judges.map(j => (
            <option key={j.id} value={j.id}>{j.name} ({j.specialization})</option>
          ))}
        </select>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (t) => (
        <StatusBadge
          status={t.disqualified ? 'Disqualified' : t.judgeId ? 'Assigned' : 'Pending'}
          size="sm"
        />
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (t) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => openTeamModal(t)}
            className="p-1.5 border border-border-color text-text-secondary hover:text-accent-primary hover:border-accent-primary transition-colors"
            title="Edit Team"
          >
            <Edit3 size={15} />
          </button>
          {!t.disqualified && (
            <button
              onClick={() => openDisqualifyModal(t)}
              className="p-1.5 border border-status-warning/40 text-accent-primary hover:bg-accent-primary/10 transition-colors"
              title="Disqualify Team"
            >
              <AlertTriangle size={15} />
            </button>
          )}
          <button
            onClick={() => {
              setTeamToDelete(t);
              setIsDeleteModalOpen(true);
            }}
            className="p-1.5 border border-status-error/40 text-status-error hover:bg-status-error/10 transition-colors"
            title="Delete Team"
          >
            <Trash2 size={15} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="animate-fade-in flex flex-col gap-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-text-primary text-[2.5rem] md:text-[3rem] font-heading tracking-[2px] leading-[1.1] uppercase m-0 mb-2">
            Participants & Teams Portal
          </h1>
          <p className="text-text-secondary leading-[1.6] m-0">
            Monitor registered teams, member allocations, theme selections, and judging assignments.
          </p>
        </div>
        <button
          onClick={() => openTeamModal()}
          className="inline-flex items-center gap-2 px-6 py-3 font-bold font-tech uppercase tracking-[1px] cursor-pointer transition-all duration-200 border-none bg-accent-primary text-black hover:bg-accent-primary-hover hover:shadow-[0_0_15px_rgba(251,200,21,0.4)] animate-glow shrink-0"
        >
          <UserPlus size={18} /> Register Team
        </button>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-surface-color rounded-lg border border-border-color p-5 flex items-center justify-between">
          <div>
            <span className="font-tech text-xs uppercase text-text-secondary font-bold">Total Teams</span>
            <h3 className="text-3xl font-heading tracking-[2px] text-text-primary mt-1 m-0">{teams.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-lg bg-[rgba(251,200,21,0.12)] text-accent-primary flex items-center justify-center border border-accent-primary/30">
            <Users size={22} />
          </div>
        </div>

        <div className="bg-surface-color rounded-lg border border-border-color p-5 flex items-center justify-between">
          <div>
            <span className="font-tech text-xs uppercase text-text-secondary font-bold">Assigned Teams</span>
            <h3 className="text-3xl font-heading tracking-[2px] text-status-success mt-1 m-0">
              {teams.filter(t => t.judgeId && !t.disqualified).length}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-lg bg-[rgba(16,185,129,0.12)] text-status-success flex items-center justify-center border border-status-success/30">
            <ShieldCheck size={22} />
          </div>
        </div>

        <div className="bg-surface-color rounded-lg border border-border-color p-5 flex items-center justify-between">
          <div>
            <span className="font-tech text-xs uppercase text-text-secondary font-bold">Pending Assignment</span>
            <h3 className="text-3xl font-heading tracking-[2px] text-accent-primary mt-1 m-0">
              {teams.filter(t => !t.judgeId && !t.disqualified).length}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-lg bg-[rgba(255,0,127,0.12)] text-accent-secondary flex items-center justify-center border border-accent-secondary/30">
            <Clock size={22} />
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={(val) => {
          setSearchTerm(val);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search team name, theme, or member..."
        filters={[
          {
            key: 'status',
            label: 'Status',
            value: statusFilter,
            onChange: (val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            },
            options: [
              { value: 'ALL', label: 'All Statuses' },
              { value: 'Assigned', label: 'Assigned' },
              { value: 'Pending', label: 'Pending' },
              { value: 'Disqualified', label: 'Disqualified' }
            ]
          }
        ]}
        onResetFilters={() => {
          setSearchTerm('');
          setStatusFilter('ALL');
          setCurrentPage(1);
        }}
      />

      {/* Main Table */}
      <div>
        <DataTable
          columns={columns}
          data={paginatedTeams}
          keyExtractor={(t) => t.id}
          isEmpty={filteredTeams.length === 0}
          emptyTitle="No Registered Teams Found"
          emptyDescription="There are currently no teams matching your criteria. Click below to register a team."
          emptyActionLabel="Register Team"
          onEmptyAction={() => openTeamModal()}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={filteredTeams.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={(sz) => {
            setPageSize(sz);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Add / Edit Team Modal */}
      <Modal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        title={editingTeam ? 'Edit Registered Team' : 'Register New Team'}
        subtitle="Configure team parameters, track theme, and member roster."
        headerColor="primary"
      >
        <form onSubmit={handleTeamSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextInput
              label="Team Name"
              required
              placeholder="e.g. CyberPulse"
              value={teamForm.name}
              onChange={e => setTeamForm({ ...teamForm, name: e.target.value })}
            />
            <TextInput
              label="Hackathon Theme"
              required
              placeholder="e.g. AI & Cloud"
              value={teamForm.theme}
              onChange={e => setTeamForm({ ...teamForm, theme: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-3 mt-2">
            <span className="font-tech text-xs uppercase text-text-secondary font-bold">Team Roster (Up to 3 Members)</span>
            <TextInput
              label="Leader / Member 1 Name"
              required
              placeholder="Full Name"
              value={teamForm.member1}
              onChange={e => setTeamForm({ ...teamForm, member1: e.target.value })}
            />
            <TextInput
              label="Member 2 Name"
              placeholder="Full Name"
              value={teamForm.member2}
              onChange={e => setTeamForm({ ...teamForm, member2: e.target.value })}
            />
            <TextInput
              label="Member 3 Name"
              placeholder="Full Name"
              value={teamForm.member3}
              onChange={e => setTeamForm({ ...teamForm, member3: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-border-color">
            <button
              type="button"
              onClick={() => setIsTeamModalOpen(false)}
              className="px-5 py-2.5 font-bold font-tech uppercase tracking-[1px] border border-border-color bg-transparent text-text-secondary hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 font-bold font-tech uppercase tracking-[1px] bg-accent-primary text-black hover:bg-accent-primary-hover hover:shadow-[0_0_15px_rgba(251,200,21,0.4)] border-none cursor-pointer"
            >
              {editingTeam ? 'Update Team' : 'Register Team'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Disqualify Modal */}
      <Modal
        isOpen={isDisqualifyModalOpen}
        onClose={() => setIsDisqualifyModalOpen(false)}
        title="Disqualify Team"
        subtitle={`Flag team "${teamToDisqualify?.name}" for rules or ethics violations.`}
        headerColor="error"
      >
        <div className="flex flex-col gap-4">
          <TextAreaInput
            label="Reason for Disqualification"
            required
            rows={4}
            placeholder="Explain the specific rule violation or reason..."
            value={disqualifyReason}
            onChange={e => setDisqualifyReason(e.target.value)}
          />

          <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-border-color">
            <button
              type="button"
              onClick={() => setIsDisqualifyModalOpen(false)}
              className="px-5 py-2.5 font-bold font-tech uppercase tracking-[1px] border border-border-color bg-transparent text-text-secondary hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmDisqualify}
              className="px-6 py-2.5 font-bold font-tech uppercase tracking-[1px] bg-status-error text-white hover:bg-status-error/90 hover:shadow-[0_0_15px_rgba(255,0,127,0.4)] border-none cursor-pointer"
            >
              Confirm Disqualification
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Remove Team Registration"
        message={`Are you sure you want to delete team "${teamToDelete?.name}"? This action cannot be undone.`}
        variant="danger"
      />
    </div>
  );
}
