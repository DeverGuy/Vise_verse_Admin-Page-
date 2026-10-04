"use client";

import React, { useContext, useState } from 'react';
import { Plus, Edit3, Trash2, Clock, MapPin } from 'lucide-react';
import { DataContext, ScheduleItem } from '@/components/DataContext';
import { Modal } from '@/components/admin/Modal';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { TextInput, SelectInput } from '@/components/admin/FormControls';
import { StatusBadge } from '@/components/admin/StatusBadge';

export default function EventFlowPage() {
  const { schedule, addScheduleItem, editScheduleItem, deleteScheduleItem } = useContext(DataContext);

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);
  const [formData, setFormData] = useState({
    time: '',
    title: '',
    location: '',
    status: 'upcoming'
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ScheduleItem | null>(null);

  const openFormModal = (item: ScheduleItem | null = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        time: item.time,
        title: item.title,
        location: item.description || '',
        status: item.status || 'upcoming'
      });
    } else {
      setEditingItem(null);
      setFormData({ time: '', title: '', location: '', status: 'upcoming' });
    }
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const itemData = {
      time: formData.time,
      title: formData.title,
      description: formData.location,
      status: formData.status
    };

    if (editingItem) {
      editScheduleItem(editingItem.id, itemData);
    } else {
      addScheduleItem(itemData);
    }
    setIsFormModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      deleteScheduleItem(itemToDelete.id);
    }
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="animate-fade-in flex flex-col gap-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-text-primary text-[2.5rem] md:text-[3rem] font-heading tracking-[2px] leading-[1.1] uppercase m-0 mb-2">
            Event Schedule & Timeline Flow
          </h1>
          <p className="text-text-secondary leading-[1.6] m-0">
            Manage the sequential timeline, agenda sessions, speaker slots, and venue locations.
          </p>
        </div>
        <button
          onClick={() => openFormModal()}
          className="inline-flex items-center gap-2 px-6 py-3 font-bold font-tech uppercase tracking-[1px] cursor-pointer transition-all duration-200 border-none bg-accent-primary text-black hover:bg-accent-primary-hover hover:shadow-[0_0_15px_rgba(251,200,21,0.4)] animate-glow shrink-0"
        >
          <Plus size={18} /> Add Schedule Item
        </button>
      </header>

      {/* Main Timeline Card */}
      <div className="glass-panel p-6 md:p-8">
        <h2 className="text-xl font-heading tracking-[2px] text-text-primary uppercase mb-6 flex items-center gap-2">
          <Clock size={20} className="text-accent-secondary" /> Chronological Timeline
        </h2>

        {schedule.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-secondary text-sm font-body">No schedule items added yet. Click &apos;Add Schedule Item&apos; to create an event timeline.</p>
            <button
              onClick={() => openFormModal()}
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 font-bold font-tech uppercase tracking-[1px] bg-accent-primary text-black hover:bg-accent-primary-hover"
            >
              <Plus size={16} /> Add First Slot
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {schedule.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-surface-color-light border border-border-color transition-all duration-200 hover:border-accent-secondary/40"
                style={{ opacity: item.status === 'completed' ? 0.6 : 1 }}
              >
                <div className="flex items-center gap-4">
                  <div className="font-tech text-accent-primary text-sm font-bold min-w-[100px] flex items-center gap-2">
                    <Clock size={16} className="text-accent-secondary" />
                    {item.time}
                  </div>
                  <div>
                    <div className="font-heading text-lg text-text-primary tracking-[1px] uppercase flex items-center gap-2">
                      {item.title}
                    </div>
                    {item.description && (
                      <div className="flex items-center gap-1.5 text-xs text-text-secondary font-body mt-1">
                        <MapPin size={13} className="text-accent-tertiary" /> {item.description}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge
                    status={item.status === 'active' ? 'Active' : item.status === 'completed' ? 'Completed' : 'Draft'}
                    size="sm"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openFormModal(item)}
                      className="p-1.5 border border-border-color text-text-secondary hover:text-accent-primary hover:border-accent-primary transition-colors"
                      title="Edit Item"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => {
                        setItemToDelete(item);
                        setIsDeleteModalOpen(true);
                      }}
                      className="p-1.5 border border-status-error/40 text-status-error hover:bg-status-error/10 transition-colors"
                      title="Delete Item"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Schedule Item Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingItem ? 'Edit Schedule Slot' : 'Add Schedule Slot'}
        subtitle="Specify timeline duration, slot title, location, and execution status."
        headerColor="primary"
      >
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          <TextInput
            label="Slot Time"
            required
            placeholder="e.g. 09:00 AM - 10:30 AM"
            value={formData.time}
            onChange={e => setFormData({ ...formData, time: e.target.value })}
          />
          <TextInput
            label="Session Title"
            required
            placeholder="e.g. Keynote & Opening Ceremony"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
          />
          <TextInput
            label="Location / Venue Room"
            required
            placeholder="e.g. Main Auditorium Hall A"
            value={formData.location}
            onChange={e => setFormData({ ...formData, location: e.target.value })}
          />
          <SelectInput
            label="Status"
            value={formData.status}
            onChange={e => setFormData({ ...formData, status: e.target.value })}
            options={[
              { value: 'upcoming', label: 'Upcoming' },
              { value: 'active', label: 'Active / Live Now' },
              { value: 'completed', label: 'Completed' }
            ]}
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
              {editingItem ? 'Update Slot' : 'Save Slot'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Remove Schedule Slot"
        message={`Are you sure you want to delete "${itemToDelete?.title}" from the event schedule?`}
        variant="danger"
      />
    </div>
  );
}
