"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { Save, Calendar, CheckCircle2 } from 'lucide-react';
import { TextInput, TextAreaInput } from '@/components/admin/FormControls';
import { LoadingState, ErrorState } from '@/components/admin/States';

export default function EventDetailsPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [eventInfo, setEventInfo] = useState({
    eventName: 'Vice Verse 1.0 2026',
    tagline: 'Ideate • Visualize • Create',
    clubName: 'IVC × InUnity',
    venue: 'Sri H. Kempegowda Indoor Sports Complex',
    eventDate: '2026-10-26',
    eventTime: '09:00 AM',
    contactEmail: 'support@ivc-pulse.org',
    contactPhone: '+91 821 234 5678',
    description: 'Vice Verse 1.0 is the premier technical ideathon and hackathon of VVCE in collaboration with InUnity.'
  });

  const fetchDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/settings');
      const json = await res.json();
      if (json.success && json.data && json.data.eventInfo) {
        setEventInfo(json.data.eventInfo);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to connect to settings API';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    try {
      const getRes = await fetch('/api/settings');
      const getJson = await getRes.json();
      const currentFullSettings = getJson.data || {};

      const updatedFull = {
        ...currentFullSettings,
        eventInfo
      };

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFull)
      });
      const json = await res.json();
      if (json.success) {
        setSuccessMsg('Event Details Saved & Broadcasted Successfully!');
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        alert(json.error || 'Failed to save event details');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving event details';
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingState message="Retrieving Vice Verse event parameters..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchDetails} />;
  }

  return (
    <div className="animate-fade-in flex flex-col gap-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-text-primary text-[2.5rem] md:text-[3rem] font-heading tracking-[2px] leading-[1.1] uppercase m-0 mb-2">
            Event Information
          </h1>
          <p className="text-text-secondary leading-[1.6] m-0">
            Configure core Vice Verse event metadata, venue schedules, and organizer contact profiles.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 font-bold font-tech uppercase tracking-[1px] cursor-pointer transition-all duration-200 border-none bg-accent-primary text-black hover:bg-accent-primary-hover hover:shadow-[0_0_15px_rgba(251,200,21,0.4)] animate-glow shrink-0"
        >
          <Save size={18} /> {saving ? 'Saving...' : 'Save Event Details'}
        </button>
      </header>

      {successMsg && (
        <div className="bg-[rgba(16,185,129,0.15)] border border-status-success text-status-success p-4 rounded flex items-center gap-3 animate-fade-in font-tech font-bold uppercase tracking-[1px]">
          <CheckCircle2 size={20} /> {successMsg}
        </div>
      )}

      <form onSubmit={handleSave} className="glass-panel p-6 md:p-8 flex flex-col gap-6">
        <h2 className="text-xl font-heading tracking-[2px] text-accent-primary uppercase m-0 flex items-center gap-2">
          <Calendar size={22} className="text-accent-primary" /> General Specification
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextInput
            label="Event Title"
            required
            value={eventInfo.eventName}
            onChange={e => setEventInfo({ ...eventInfo, eventName: e.target.value })}
          />
          <TextInput
            label="Tagline / Motto"
            required
            value={eventInfo.tagline}
            onChange={e => setEventInfo({ ...eventInfo, tagline: e.target.value })}
          />
          <TextInput
            label="Host Club / Organization"
            required
            value={eventInfo.clubName}
            onChange={e => setEventInfo({ ...eventInfo, clubName: e.target.value })}
          />
          <TextInput
            label="Event Venue"
            required
            value={eventInfo.venue}
            onChange={e => setEventInfo({ ...eventInfo, venue: e.target.value })}
          />
          <TextInput
            label="Event Date"
            type="date"
            required
            value={eventInfo.eventDate}
            onChange={e => setEventInfo({ ...eventInfo, eventDate: e.target.value })}
          />
          <TextInput
            label="Event Time"
            required
            placeholder="e.g. 09:00 AM"
            value={eventInfo.eventTime}
            onChange={e => setEventInfo({ ...eventInfo, eventTime: e.target.value })}
          />
          <TextInput
            label="Support Email"
            type="email"
            required
            value={eventInfo.contactEmail}
            onChange={e => setEventInfo({ ...eventInfo, contactEmail: e.target.value })}
          />
          <TextInput
            label="Support Phone"
            required
            value={eventInfo.contactPhone}
            onChange={e => setEventInfo({ ...eventInfo, contactPhone: e.target.value })}
          />
        </div>

        <TextAreaInput
          label="Event Guidelines & Description"
          rows={4}
          value={eventInfo.description}
          onChange={e => setEventInfo({ ...eventInfo, description: e.target.value })}
        />

        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border-color">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 font-bold font-tech uppercase tracking-[1px] cursor-pointer transition-all duration-200 border-none bg-accent-primary text-black hover:bg-accent-primary-hover hover:shadow-[0_0_15px_rgba(251,200,21,0.4)]"
          >
            <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
