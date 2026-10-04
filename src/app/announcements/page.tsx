"use client";

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Plus,
  Edit3,
  Trash2,
  Eye,
  Send,
  Archive,
  Pin,
  Calendar,
  User
} from 'lucide-react';
import { AnnouncementDB } from '@/lib/supabase';
import { announcementSchema, AnnouncementFormData } from '@/lib/validations/adminSchemas';
import { DataTable, Column } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { SearchFilterBar } from '@/components/admin/SearchFilterBar';
import { Pagination } from '@/components/admin/Pagination';
import { Modal } from '@/components/admin/Modal';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { LoadingState, ErrorState } from '@/components/admin/States';
import { TextInput, SelectInput, TextAreaInput, ToggleSwitch } from '@/components/admin/FormControls';

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return 'Not published';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch {
    return dateStr;
  }
}

function formatDateTime(dateStr: string | null | undefined): string {
  if (!dateStr) return 'Draft Mode';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  } catch {
    return dateStr;
  }
}

const defaultAnnouncements: AnnouncementDB[] = [];

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<AnnouncementDB[]>(defaultAnnouncements);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<AnnouncementDB | null>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<AnnouncementDB | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState<AnnouncementDB | null>(null);

  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [announcementToPublish, setAnnouncementToPublish] = useState<AnnouncementDB | null>(null);

  const [submitting, setSubmitting] = useState(false);

  // React Hook Form with Zod
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: '',
      content: '',
      category: 'General',
      targetAudience: 'All',
      isPinned: false,
      status: 'Draft'
    }
  });

  const isPinned = watch('isPinned');

  const fetchAnnouncements = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/announcements');
      const json = await res.json();
      if (json.success) {
        setAnnouncements(json.data);
      } else {
        setError(json.error || 'Failed to fetch announcements');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error connecting to announcements API';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingAnnouncement(null);
    reset({
      title: '',
      content: '',
      category: 'General',
      targetAudience: 'All',
      isPinned: false,
      status: 'Draft'
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (ann: AnnouncementDB) => {
    setEditingAnnouncement(ann);
    reset({
      title: ann.title,
      content: ann.content,
      category: ann.category,
      targetAudience: ann.targetAudience,
      isPinned: ann.isPinned,
      status: ann.status
    });
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (data: AnnouncementFormData) => {
    setSubmitting(true);
    try {
      const url = editingAnnouncement ? `/api/announcements/${editingAnnouncement.id}` : '/api/announcements';
      const method = editingAnnouncement ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, author: 'Vice Verse Admin' })
      });
      const json = await res.json();
      if (json.success) {
        await fetchAnnouncements();
        setIsFormModalOpen(false);
      } else {
        alert(json.error || 'Failed to save announcement');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error submitting announcement form';
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmPublishToggle = async () => {
    if (!announcementToPublish) return;
    setSubmitting(true);
    const newStatus = announcementToPublish.status === 'Published' ? 'Draft' : 'Published';
    try {
      const res = await fetch(`/api/announcements/${announcementToPublish.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const json = await res.json();
      if (json.success) {
        await fetchAnnouncements();
        setIsPublishModalOpen(false);
      } else {
        alert(json.error || 'Failed to change publish state');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error executing publish toggle';
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!announcementToDelete) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/announcements/${announcementToDelete.id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        await fetchAnnouncements();
        setIsDeleteModalOpen(false);
      } else {
        alert(json.error || 'Failed to delete announcement');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error deleting announcement';
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Filtered & Paginated records
  const filteredAnnouncements = announcements.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || a.category === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalPages = Math.ceil(filteredAnnouncements.length / pageSize);
  const paginatedAnnouncements = filteredAnnouncements.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const columns: Column<AnnouncementDB>[] = [
    {
      key: 'title',
      header: 'Announcement',
      render: (a) => (
        <div className="flex items-start gap-3">
          {a.isPinned && (
            <Pin size={16} className="text-accent-primary shrink-0 mt-1 drop-shadow-[0_0_8px_rgba(251,200,21,0.5)]" />
          )}
          <div>
            <div className="font-semibold text-text-primary flex items-center gap-2">
              {a.title}
            </div>
            <div className="text-xs text-text-secondary line-clamp-1 mt-0.5">{a.content}</div>
          </div>
        </div>
      )
    },
    {
      key: 'category',
      header: 'Category',
      render: (a) => <StatusBadge status={a.category} size="sm" />
    },
    {
      key: 'targetAudience',
      header: 'Target Audience',
      render: (a) => <span className="font-tech text-xs uppercase text-accent-tertiary">{a.targetAudience}</span>
    },
    {
      key: 'status',
      header: 'Status',
      render: (a) => <StatusBadge status={a.status} size="sm" />
    },
    {
      key: 'publishedAt',
      header: 'Published Date',
      render: (a) => (
        <span className="text-xs text-text-secondary" suppressHydrationWarning>
          {formatDate(a.publishedAt)}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (a) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => {
              setSelectedAnnouncement(a);
              setIsDetailModalOpen(true);
            }}
            className="p-1.5 border border-border-color text-text-secondary hover:text-accent-tertiary hover:border-accent-tertiary transition-colors"
            title="View Full Announcement"
          >
            <Eye size={15} />
          </button>
          <button
            onClick={() => handleOpenEditModal(a)}
            className="p-1.5 border border-border-color text-text-secondary hover:text-accent-primary hover:border-accent-primary transition-colors"
            title="Edit Announcement"
          >
            <Edit3 size={15} />
          </button>
          <button
            onClick={() => {
              setAnnouncementToPublish(a);
              setIsPublishModalOpen(true);
            }}
            className={`p-1.5 border transition-colors ${
              a.status === 'Published'
                ? 'border-status-warning/40 text-accent-primary hover:bg-accent-primary/10'
                : 'border-status-success/40 text-status-success hover:bg-status-success/10'
            }`}
            title={a.status === 'Published' ? 'Unpublish Announcement' : 'Publish Announcement'}
          >
            {a.status === 'Published' ? <Archive size={15} /> : <Send size={15} />}
          </button>
          <button
            onClick={() => {
              setAnnouncementToDelete(a);
              setIsDeleteModalOpen(true);
            }}
            className="p-1.5 border border-status-error/40 text-status-error hover:bg-status-error/10 transition-colors"
            title="Delete Announcement"
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
            Announcements Control
          </h1>
          <p className="text-text-secondary leading-[1.6] m-0">
            Publish event broadcast bulletins, schedule updates, competition notices, and urgent alerts.
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-6 py-3 font-bold font-tech uppercase tracking-[1px] cursor-pointer transition-all duration-200 border-none bg-accent-primary text-black hover:bg-accent-primary-hover hover:shadow-[0_0_15px_rgba(251,200,21,0.4)] animate-glow shrink-0"
        >
          <Plus size={18} /> Create Announcement
        </button>
      </header>

      {/* Filter Bar */}
      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={(val) => {
          setSearchTerm(val);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search announcement title or broadcast content..."
        filters={[
          {
            key: 'category',
            label: 'Category',
            value: categoryFilter,
            onChange: (val) => {
              setCategoryFilter(val);
              setCurrentPage(1);
            },
            options: [
              { value: 'ALL', label: 'All Categories' },
              { value: 'General', label: 'General' },
              { value: 'Urgent', label: 'Urgent' },
              { value: 'Schedule', label: 'Schedule' },
              { value: 'Competition', label: 'Competition' },
              { value: 'Payment', label: 'Payment' }
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
              { value: 'Draft', label: 'Draft' },
              { value: 'Published', label: 'Published' },
              { value: 'Archived', label: 'Archived' }
            ]
          }
        ]}
        onResetFilters={() => {
          setSearchTerm('');
          setCategoryFilter('ALL');
          setStatusFilter('ALL');
          setCurrentPage(1);
        }}
      />

      {/* Data Table */}
      {loading ? (
        <LoadingState message="Connecting to Vice Verse announcement stream..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchAnnouncements} />
      ) : (
        <div>
          <DataTable
            columns={columns}
            data={paginatedAnnouncements}
            keyExtractor={(a) => a.id}
            isEmpty={filteredAnnouncements.length === 0}
            emptyTitle="No Announcements Found"
            emptyDescription="No broadcast announcements match your filters. Click below to draft a new announcement."
            emptyActionLabel="Create Announcement"
            onEmptyAction={handleOpenCreateModal}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={filteredAnnouncements.length}
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
        title={editingAnnouncement ? 'Edit Announcement' : 'Create Announcement'}
        subtitle="Compose broadcast alerts for participants, judges, or general audience."
        headerColor="primary"
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
          <TextInput
            label="Announcement Title"
            required
            placeholder="e.g. Round 1 Evaluation Guidelines Released"
            {...register('title')}
            error={errors.title?.message}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SelectInput
              label="Category"
              required
              {...register('category')}
              options={[
                { value: 'General', label: 'General' },
                { value: 'Urgent', label: 'Urgent' },
                { value: 'Schedule', label: 'Schedule' },
                { value: 'Competition', label: 'Competition' },
                { value: 'Payment', label: 'Payment' }
              ]}
              error={errors.category?.message}
            />
            <SelectInput
              label="Target Audience"
              required
              {...register('targetAudience')}
              options={[
                { value: 'All', label: 'All Users' },
                { value: 'Participants', label: 'Participants Only' },
                { value: 'Judges', label: 'Judges Only' },
                { value: 'Club Members', label: 'Club Members Only' }
              ]}
              error={errors.targetAudience?.message}
            />
            <SelectInput
              label="Initial Status"
              required
              {...register('status')}
              options={[
                { value: 'Draft', label: 'Draft' },
                { value: 'Published', label: 'Published' },
                { value: 'Archived', label: 'Archived' }
              ]}
              error={errors.status?.message}
            />
          </div>

          <TextAreaInput
            label="Broadcast Content"
            required
            rows={5}
            placeholder="Write the full announcement text here..."
            {...register('content')}
            error={errors.content?.message}
          />

          <ToggleSwitch
            label="Pin Announcement"
            description="Keep this announcement pinned at the top of participant feeds"
            checked={isPinned}
            onChange={(val) => setValue('isPinned', val)}
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
              {submitting ? 'Saving...' : editingAnnouncement ? 'Update Announcement' : 'Save Announcement'}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Broadcast Specification"
        headerColor="tertiary"
        maxWidth="lg"
      >
        {selectedAnnouncement && (
          <div className="flex flex-col gap-6">
            <div className="p-4 bg-surface-color-light border border-border-color rounded-lg">
              <div className="flex items-center justify-between gap-4 flex-wrap mb-2">
                <div className="flex items-center gap-2">
                  <StatusBadge status={selectedAnnouncement.category} size="sm" />
                  <StatusBadge status={selectedAnnouncement.status} size="sm" />
                  {selectedAnnouncement.isPinned && (
                    <span className="px-2 py-0.5 text-xs font-tech font-bold uppercase bg-[rgba(251,200,21,0.15)] text-accent-primary border border-accent-primary/40 rounded flex items-center gap-1">
                      <Pin size={12} /> Pinned
                    </span>
                  )}
                </div>
                <span className="text-xs font-tech text-text-secondary">
                  Audience: <strong className="text-accent-tertiary">{selectedAnnouncement.targetAudience}</strong>
                </span>
              </div>
              <h2 className="text-2xl font-heading tracking-[1px] text-text-primary uppercase m-0 mt-2">
                {selectedAnnouncement.title}
              </h2>
            </div>

            <div className="p-5 bg-surface-color-light border border-border-color rounded-lg font-body text-text-primary leading-relaxed whitespace-pre-wrap">
              {selectedAnnouncement.content}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-tech">
              <div className="p-3 bg-surface-color-light rounded border border-border-color flex items-center gap-2">
                <User size={14} className="text-accent-primary" />
                <span className="text-text-secondary uppercase">Author:</span>
                <span className="text-text-primary font-bold">{selectedAnnouncement.author}</span>
              </div>
              <div className="p-3 bg-surface-color-light rounded border border-border-color flex items-center gap-2">
                <Calendar size={14} className="text-accent-tertiary" />
                <span className="text-text-secondary uppercase">Published At:</span>
                <span className="text-text-primary font-bold" suppressHydrationWarning>
                  {formatDateTime(selectedAnnouncement.publishedAt)}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Publish Toggle Confirmation */}
      <ConfirmDialog
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        onConfirm={handleConfirmPublishToggle}
        title={announcementToPublish?.status === 'Published' ? 'Unpublish Announcement' : 'Publish Announcement'}
        message={`Are you sure you want to ${
          announcementToPublish?.status === 'Published' ? 'unpublish' : 'publish'
        } "${announcementToPublish?.title}"? ${
          announcementToPublish?.status === 'Published'
            ? 'This will revert it to Draft status and hide it from live portals.'
            : 'This will broadcast the announcement live to targeted feeds.'
        }`}
        variant={announcementToPublish?.status === 'Published' ? 'warning' : 'info'}
        isLoading={submitting}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Announcement"
        message={`Are you sure you want to permanently delete "${announcementToDelete?.title}"? This action cannot be undone.`}
        variant="danger"
        isLoading={submitting}
      />
    </div>
  );
}
