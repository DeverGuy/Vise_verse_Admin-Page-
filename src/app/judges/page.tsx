"use client";

import React, { useContext, useState } from 'react';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import { DataContext, Judge } from '@/components/DataContext';
import { DataTable, Column } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { SearchFilterBar } from '@/components/admin/SearchFilterBar';
import { Pagination } from '@/components/admin/Pagination';
import { Modal } from '@/components/admin/Modal';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { TextInput } from '@/components/admin/FormControls';

export default function JudgesPortal() {
  const { judges, addJudge, editJudge, deleteJudge, teams } = useContext(DataContext);
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingJudge, setEditingJudge] = useState<Judge | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', specialization: '' });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [judgeToDelete, setJudgeToDelete] = useState<Judge | null>(null);

  const handleOpenFormModal = (judge: Judge | null = null) => {
    if (judge) {
      setEditingJudge(judge);
      setFormData({ name: judge.name, email: judge.email, specialization: judge.specialization });
    } else {
      setEditingJudge(null);
      setFormData({ name: '', email: '', specialization: '' });
    }
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingJudge) {
      editJudge(editingJudge.id, formData);
    } else {
      addJudge({
        ...formData,
        initials: formData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
        theme: `var(--accent-${['primary', 'secondary', 'tertiary'][Math.floor(Math.random() * 3)]})`
      });
    }
    setIsFormModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (judgeToDelete) {
      deleteJudge(judgeToDelete.id);
    }
    setIsDeleteModalOpen(false);
  };

  // Filtered & Paginated List
  const filteredJudges = judges.filter(j =>
    j.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredJudges.length / pageSize);
  const paginatedJudges = filteredJudges.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const columns: Column<Judge>[] = [
    {
      key: 'name',
      header: 'Judge Profile',
      render: (j) => (
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded bg-surface-color-light border border-border-color flex items-center justify-center font-bold text-accent-primary font-tech"
            style={{ background: `linear-gradient(135deg, ${j.theme}, var(--bg-color))` }}
          >
            {j.initials}
          </div>
          <div>
            <div className="font-semibold text-text-primary">{j.name}</div>
            <div className="text-xs text-text-secondary">{j.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'specialization',
      header: 'Specialization / Domain',
      render: (j) => <span className="font-tech text-xs uppercase text-accent-tertiary">{j.specialization}</span>
    },
    {
      key: 'assignedCount',
      header: 'Assigned Teams',
      render: (j) => {
        const count = teams.filter(t => t.judgeId === j.id).length;
        return (
          <span className="font-tech text-xs text-text-primary font-bold">
            {count} Teams Assigned
          </span>
        );
      }
    },
    {
      key: 'status',
      header: 'Status',
      render: () => <StatusBadge status="Active" size="sm" />
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (j) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => handleOpenFormModal(j)}
            className="p-1.5 border border-border-color text-text-secondary hover:text-accent-primary hover:border-accent-primary transition-colors"
            title="Edit Judge"
          >
            <Edit3 size={15} />
          </button>
          <button
            onClick={() => {
              setJudgeToDelete(j);
              setIsDeleteModalOpen(true);
            }}
            className="p-1.5 border border-status-error/40 text-status-error hover:bg-status-error/10 transition-colors"
            title="Remove Judge"
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
            Judges & Panels Control
          </h1>
          <p className="text-text-secondary leading-[1.6] m-0">
            Manage expert judges, evaluation panels, domain specializations, and team pairings.
          </p>
        </div>
        <button
          onClick={() => handleOpenFormModal()}
          className="inline-flex items-center gap-2 px-6 py-3 font-bold font-tech uppercase tracking-[1px] cursor-pointer transition-all duration-200 border-none bg-accent-primary text-black hover:bg-accent-primary-hover hover:shadow-[0_0_15px_rgba(251,200,21,0.4)] animate-glow shrink-0"
        >
          <Plus size={18} /> Add Judge
        </button>
      </header>

      {/* Filter Bar */}
      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={(val) => {
          setSearchTerm(val);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search judge name, email, or domain specialization..."
        onResetFilters={() => {
          setSearchTerm('');
          setCurrentPage(1);
        }}
      />

      {/* Main Table */}
      <div>
        <DataTable
          columns={columns}
          data={paginatedJudges}
          keyExtractor={(j) => j.id}
          isEmpty={filteredJudges.length === 0}
          emptyTitle="No Judges Registered"
          emptyDescription="No evaluation judges match your search query. Click below to add a judge."
          emptyActionLabel="Add Judge"
          onEmptyAction={() => handleOpenFormModal()}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={filteredJudges.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={(sz) => {
            setPageSize(sz);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Add / Edit Judge Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingJudge ? 'Edit Judge Profile' : 'Add New Judge'}
        subtitle="Configure judge details and domain specialization."
        headerColor="primary"
      >
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          <TextInput
            label="Full Name"
            required
            placeholder="e.g. Dr. Vikram Sarabhai"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
          <TextInput
            label="Email Address"
            type="email"
            required
            placeholder="vikram@vvce.ac.in"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
          />
          <TextInput
            label="Specialization / Domain"
            required
            placeholder="e.g. Artificial Intelligence & Cloud Architecture"
            value={formData.specialization}
            onChange={e => setFormData({ ...formData, specialization: e.target.value })}
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
              className="px-6 py-2.5 font-bold font-tech uppercase tracking-[1px] bg-accent-primary text-black hover:bg-accent-primary-hover hover:shadow-[0_0_15px_rgba(251,200,21,0.4)] border-none cursor-pointer"
            >
              {editingJudge ? 'Update Judge' : 'Save Judge'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Remove Judge"
        message={`Are you sure you want to remove judge "${judgeToDelete?.name}"? Assigned teams will be unassigned.`}
        variant="danger"
      />
    </div>
  );
}
