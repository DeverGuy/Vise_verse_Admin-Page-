"use client";

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  UserPlus,
  Edit3,
  Trash2,
  Eye,
  Shield,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Briefcase
} from 'lucide-react';
import { ClubMemberDB } from '@/lib/supabase';
import { clubMemberSchema, ClubMemberFormData } from '@/lib/validations/adminSchemas';
import { DataTable, Column } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { SearchFilterBar } from '@/components/admin/SearchFilterBar';
import { Pagination } from '@/components/admin/Pagination';
import { Modal } from '@/components/admin/Modal';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { LoadingState, ErrorState } from '@/components/admin/States';
import { TextInput, SelectInput, TextAreaInput } from '@/components/admin/FormControls';

const defaultClubMembers: ClubMemberDB[] = [];

export default function ClubMembersPage() {
  const [members, setMembers] = useState<ClubMemberDB[]>(defaultClubMembers);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<ClubMemberDB | null>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<ClubMemberDB | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<ClubMemberDB | null>(null);

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [memberToToggleStatus, setMemberToToggleStatus] = useState<ClubMemberDB | null>(null);

  const [submitting, setSubmitting] = useState(false);

  // React Hook Form with Zod
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ClubMemberFormData>({
    resolver: zodResolver(clubMemberSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      role: 'Member',
      department: 'Technical & Logistics',
      status: 'Active',
      bio: ''
    }
  });

  const fetchMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/club-members');
      const json = await res.json();
      if (json.success) {
        setMembers(json.data);
      } else {
        setError(json.error || 'Failed to load club members');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error connecting to club members API';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingMember(null);
    reset({
      fullName: '',
      email: '',
      phone: '',
      role: 'Member',
      department: 'Technical & Logistics',
      status: 'Active',
      bio: ''
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (member: ClubMemberDB) => {
    setEditingMember(member);
    reset({
      fullName: member.fullName,
      email: member.email,
      phone: member.phone || '',
      role: member.role,
      department: member.department,
      status: member.status,
      bio: member.bio || ''
    });
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (data: ClubMemberFormData) => {
    setSubmitting(true);
    try {
      const url = editingMember ? `/api/club-members/${editingMember.id}` : '/api/club-members';
      const method = editingMember ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (json.success) {
        await fetchMembers();
        setIsFormModalOpen(false);
      } else {
        alert(json.error || 'Failed to save club member');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error submitting club member form';
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!memberToDelete) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/club-members/${memberToDelete.id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        await fetchMembers();
        setIsDeleteModalOpen(false);
      } else {
        alert(json.error || 'Failed to delete member');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error deleting member';
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!memberToToggleStatus) return;
    setSubmitting(true);
    const newStatus = memberToToggleStatus.status === 'Active' ? 'Inactive' : 'Active';
    try {
      const res = await fetch(`/api/club-members/${memberToToggleStatus.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const json = await res.json();
      if (json.success) {
        await fetchMembers();
        setIsStatusModalOpen(false);
      } else {
        alert(json.error || 'Failed to update member status');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error updating status';
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Filtered & Paginated records
  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || m.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalPages = Math.ceil(filteredMembers.length / pageSize);
  const paginatedMembers = filteredMembers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const columns: Column<ClubMemberDB>[] = [
    {
      key: 'fullName',
      header: 'Member Name',
      render: (m) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-surface-color-light border border-border-color flex items-center justify-center font-bold text-accent-primary font-tech">
            {m.fullName.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-text-primary">{m.fullName}</div>
            <div className="text-xs text-text-secondary">{m.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      header: 'Role',
      render: (m) => <StatusBadge status={m.role} size="sm" />
    },
    {
      key: 'department',
      header: 'Department',
      render: (m) => <span className="font-tech text-xs uppercase tracking-[0.5px] text-accent-tertiary">{m.department}</span>
    },
    {
      key: 'phone',
      header: 'Contact',
      render: (m) => <span className="text-xs text-text-secondary">{m.phone || 'N/A'}</span>
    },
    {
      key: 'status',
      header: 'Status',
      render: (m) => <StatusBadge status={m.status} size="sm" />
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (m) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => {
              setSelectedMember(m);
              setIsDetailModalOpen(true);
            }}
            className="p-1.5 border border-border-color text-text-secondary hover:text-accent-tertiary hover:border-accent-tertiary transition-colors"
            title="View Details"
          >
            <Eye size={15} />
          </button>
          <button
            onClick={() => handleOpenEditModal(m)}
            className="p-1.5 border border-border-color text-text-secondary hover:text-accent-primary hover:border-accent-primary transition-colors"
            title="Edit Member"
          >
            <Edit3 size={15} />
          </button>
          <button
            onClick={() => {
              setMemberToToggleStatus(m);
              setIsStatusModalOpen(true);
            }}
            className={`p-1.5 border transition-colors ${
              m.status === 'Active'
                ? 'border-status-warning/40 text-accent-primary hover:bg-accent-primary/10'
                : 'border-status-success/40 text-status-success hover:bg-status-success/10'
            }`}
            title={m.status === 'Active' ? 'Deactivate Member' : 'Activate Member'}
          >
            {m.status === 'Active' ? <UserX size={15} /> : <UserCheck size={15} />}
          </button>
          <button
            onClick={() => {
              setMemberToDelete(m);
              setIsDeleteModalOpen(true);
            }}
            className="p-1.5 border border-status-error/40 text-status-error hover:bg-status-error/10 transition-colors"
            title="Remove Member"
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
            Club Members Management
          </h1>
          <p className="text-text-secondary leading-[1.6] m-0">
            Manage Vice Verse organizers, technical leads, core team members, and role assignments.
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-6 py-3 font-bold font-tech uppercase tracking-[1px] cursor-pointer transition-all duration-200 border-none bg-accent-primary text-black hover:bg-accent-primary-hover hover:shadow-[0_0_15px_rgba(251,200,21,0.4)] animate-glow shrink-0"
        >
          <UserPlus size={18} /> Add Club Member
        </button>
      </header>

      {/* Filter Bar */}
      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={(val) => {
          setSearchTerm(val);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search member name, email, department..."
        filters={[
          {
            key: 'role',
            label: 'Role',
            value: roleFilter,
            onChange: (val) => {
              setRoleFilter(val);
              setCurrentPage(1);
            },
            options: [
              { value: 'ALL', label: 'All Roles' },
              { value: 'Leader', label: 'Leaders' },
              { value: 'Core Member', label: 'Core Members' },
              { value: 'Organizer', label: 'Organizers' },
              { value: 'Member', label: 'Members' }
            ]
          },
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
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' },
              { value: 'Suspended', label: 'Suspended' }
            ]
          }
        ]}
        onResetFilters={() => {
          setSearchTerm('');
          setRoleFilter('ALL');
          setStatusFilter('ALL');
          setCurrentPage(1);
        }}
      />

      {/* Main Table or States */}
      {loading ? (
        <LoadingState message="Loading Vice Verse club roster..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchMembers} />
      ) : (
        <div>
          <DataTable
            columns={columns}
            data={paginatedMembers}
            keyExtractor={(m) => m.id}
            isEmpty={filteredMembers.length === 0}
            emptyTitle="No Club Members Found"
            emptyDescription="No club members match your search criteria. Add a new member to expand the team."
            emptyActionLabel="Add Club Member"
            onEmptyAction={handleOpenCreateModal}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={filteredMembers.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={(sz) => {
              setPageSize(sz);
              setCurrentPage(1);
            }}
          />
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingMember ? 'Edit Club Member' : 'Add Club Member'}
        subtitle="Configure profile parameters, role allocations, and department."
        headerColor="primary"
      >
        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
          <TextInput
            label="Full Name"
            required
            placeholder="e.g. Alex Mercer"
            {...register('fullName')}
            error={errors.fullName?.message}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextInput
              label="Email Address"
              type="email"
              required
              placeholder="alex.mercer@vvce.ac.in"
              {...register('email')}
              error={errors.email?.message}
            />
            <TextInput
              label="Phone Number"
              placeholder="+91 98765 43210"
              {...register('phone')}
              error={errors.phone?.message}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectInput
              label="Role Allocation"
              required
              {...register('role')}
              options={[
                { value: 'Leader', label: 'Leader' },
                { value: 'Core Member', label: 'Core Member' },
                { value: 'Organizer', label: 'Organizer' },
                { value: 'Member', label: 'Member' }
              ]}
              error={errors.role?.message}
            />
            <SelectInput
              label="Status"
              required
              {...register('status')}
              options={[
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' },
                { value: 'Suspended', label: 'Suspended' }
              ]}
              error={errors.status?.message}
            />
          </div>

          <TextInput
            label="Department / Team"
            required
            placeholder="e.g. Technical & Logistics"
            {...register('department')}
            error={errors.department?.message}
          />

          <TextAreaInput
            label="Biography / Responsibilities"
            placeholder="Notes regarding member tasks..."
            {...register('bio')}
            error={errors.bio?.message}
          />

          <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-border-color">
            <button
              type="button"
              onClick={() => setIsFormModalOpen(false)}
              className="px-5 py-2.5 font-bold font-tech uppercase tracking-[1px] border border-border-color bg-transparent text-text-secondary hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 font-bold font-tech uppercase tracking-[1px] bg-accent-primary text-black hover:bg-accent-primary-hover hover:shadow-[0_0_15px_rgba(251,200,21,0.4)] border-none cursor-pointer"
            >
              {submitting ? 'Saving...' : editingMember ? 'Update Member' : 'Save Member'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Member Specification"
        headerColor="tertiary"
      >
        {selectedMember && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4 p-4 bg-surface-color-light border border-border-color rounded-lg">
              <div className="w-14 h-14 rounded-lg bg-surface-color border border-accent-tertiary flex items-center justify-center font-bold text-accent-tertiary text-2xl font-tech">
                {selectedMember.fullName.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-heading tracking-[1px] text-text-primary uppercase m-0">
                  {selectedMember.fullName}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <StatusBadge status={selectedMember.role} size="sm" />
                  <StatusBadge status={selectedMember.status} size="sm" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-body">
              <div className="p-3 bg-surface-color-light rounded border border-border-color flex items-center gap-3">
                <Mail size={18} className="text-accent-primary" />
                <div>
                  <div className="font-tech text-xs uppercase text-text-secondary">Email</div>
                  <div className="text-text-primary font-medium">{selectedMember.email}</div>
                </div>
              </div>
              <div className="p-3 bg-surface-color-light rounded border border-border-color flex items-center gap-3">
                <Phone size={18} className="text-accent-tertiary" />
                <div>
                  <div className="font-tech text-xs uppercase text-text-secondary">Phone</div>
                  <div className="text-text-primary font-medium">{selectedMember.phone || 'Not provided'}</div>
                </div>
              </div>
              <div className="p-3 bg-surface-color-light rounded border border-border-color flex items-center gap-3">
                <Briefcase size={18} className="text-accent-secondary" />
                <div>
                  <div className="font-tech text-xs uppercase text-text-secondary">Department</div>
                  <div className="text-text-primary font-medium">{selectedMember.department}</div>
                </div>
              </div>
              <div className="p-3 bg-surface-color-light rounded border border-border-color flex items-center gap-3">
                <Shield size={18} className="text-status-success" />
                <div>
                  <div className="font-tech text-xs uppercase text-text-secondary">Member ID</div>
                  <div className="text-text-primary font-mono text-xs">{selectedMember.id}</div>
                </div>
              </div>
            </div>

            {selectedMember.bio && (
              <div className="p-4 bg-surface-color-light rounded border border-border-color">
                <div className="font-tech text-xs uppercase text-accent-primary font-bold mb-1">Bio / Role Scope</div>
                <p className="text-text-secondary text-sm m-0 leading-relaxed">{selectedMember.bio}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Status Toggle Confirmation */}
      <ConfirmDialog
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        onConfirm={handleToggleStatus}
        title={memberToToggleStatus?.status === 'Active' ? 'Deactivate Member' : 'Activate Member'}
        message={`Are you sure you want to ${
          memberToToggleStatus?.status === 'Active' ? 'deactivate' : 'activate'
        } ${memberToToggleStatus?.fullName}? Inactive members will retain their historical records.`}
        variant={memberToToggleStatus?.status === 'Active' ? 'warning' : 'info'}
        isLoading={submitting}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Remove Member from Roster"
        message={`Are you sure you want to remove ${memberToDelete?.fullName} from the Vice Verse club roster? This action cannot be undone.`}
        variant="danger"
        isLoading={submitting}
      />
    </div>
  );
}
