"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Save,
  Calendar,
  Monitor,
  Megaphone,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';
import { fullSettingsSchema, FullSettingsFormData } from '@/lib/validations/adminSchemas';
import { LoadingState, ErrorState } from '@/components/admin/States';
import { TextInput, SelectInput, TextAreaInput, ToggleSwitch } from '@/components/admin/FormControls';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'event' | 'display' | 'announcements' | 'general'>('event');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FullSettingsFormData>({
    resolver: zodResolver(fullSettingsSchema),
    defaultValues: {
      eventInfo: {
        eventName: 'Vice Verse 1.0 2026',
        tagline: 'Ideate • Visualize • Create',
        clubName: 'IVC × InUnity',
        venue: 'Sri H. Kempegowda Indoor Sports Complex',
        eventDate: '2026-10-26',
        eventTime: '09:00 AM',
        contactEmail: 'support@ivc-pulse.org',
        contactPhone: '+91 821 234 5678',
        description: 'Vice Verse 1.0 is the premier technical ideathon and hackathon of VVCE in collaboration with InUnity.'
      },
      display: {
        themeMode: 'Neon Cyberpunk',
        enableScanlines: true,
        enableGlitchEffects: true,
        compactTables: false,
        refreshIntervalSeconds: 30
      },
      announcement: {
        defaultCategory: 'General',
        defaultTargetAudience: 'All',
        autoArchiveDays: 30,
        notifyOnPublish: true
      },
      general: {
        allowNewRegistrations: true,
        maxTeamSize: 3,
        registrationFee: 500,
        currency: 'INR',
        judgeAutoAssignment: false,
        maintenanceMode: false
      }
    }
  });

  // Watch boolean fields for custom toggle switches
  const displayWatch = watch('display');
  const announcementWatch = watch('announcement');
  const generalWatch = watch('general');

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/settings');
      const json = await res.json();
      if (json.success && json.data) {
        reset(json.data);
      } else {
        setError(json.error || 'Failed to load configuration settings');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error connecting to settings API';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [reset]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSaveSettings = async (data: FullSettingsFormData) => {
    setSaving(true);
    setSuccessMsg(null);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (json.success) {
        setSuccessMsg('Admin Settings Saved Successfully!');
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        alert(json.error || 'Failed to save admin settings');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving settings';
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-fade-in">
        <header className="mb-6">
          <h1 className="text-text-primary text-[2.8rem] font-heading tracking-[2px] leading-[1.1] uppercase m-0 mb-2">
            Admin Configuration
          </h1>
        </header>
        <LoadingState message="Retrieving Vice Verse global settings..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fade-in">
        <header className="mb-6">
          <h1 className="text-text-primary text-[2.8rem] font-heading tracking-[2px] leading-[1.1] uppercase m-0 mb-2">
            Admin Configuration
          </h1>
        </header>
        <ErrorState message={error} onRetry={fetchSettings} />
      </div>
    );
  }

  return (
    <div className="animate-fade-in flex flex-col gap-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-text-primary text-[2.5rem] md:text-[3rem] font-heading tracking-[2px] leading-[1.1] uppercase m-0 mb-2">
            Admin Settings
          </h1>
          <p className="text-text-secondary leading-[1.6] m-0">
            Configure event parameters, display preferences, broadcast policies, and system administration rules.
          </p>
        </div>
        <button
          onClick={handleSubmit(handleSaveSettings)}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 font-bold font-tech uppercase tracking-[1px] cursor-pointer transition-all duration-200 border-none bg-accent-primary text-black hover:bg-accent-primary-hover hover:shadow-[0_0_15px_rgba(251,200,21,0.4)] animate-glow shrink-0"
        >
          <Save size={18} /> {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </header>

      {/* Success Notification */}
      {successMsg && (
        <div className="bg-[rgba(16,185,129,0.15)] border border-status-success text-status-success p-4 rounded flex items-center gap-3 animate-fade-in font-tech font-bold uppercase tracking-[1px]">
          <CheckCircle2 size={20} /> {successMsg}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border-color pb-3 font-tech font-bold uppercase tracking-[1px] text-sm">
        <button
          type="button"
          onClick={() => setActiveTab('event')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded transition-all cursor-pointer ${
            activeTab === 'event'
              ? 'bg-accent-secondary/20 text-text-primary border-b-2 border-accent-secondary'
              : 'text-text-secondary hover:text-white hover:bg-surface-color-light'
          }`}
        >
          <Calendar size={16} /> Event Information
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('display')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded transition-all cursor-pointer ${
            activeTab === 'display'
              ? 'bg-accent-secondary/20 text-text-primary border-b-2 border-accent-secondary'
              : 'text-text-secondary hover:text-white hover:bg-surface-color-light'
          }`}
        >
          <Monitor size={16} /> Display Settings
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('announcements')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded transition-all cursor-pointer ${
            activeTab === 'announcements'
              ? 'bg-accent-secondary/20 text-text-primary border-b-2 border-accent-secondary'
              : 'text-text-secondary hover:text-white hover:bg-surface-color-light'
          }`}
        >
          <Megaphone size={16} /> Announcement Settings
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded transition-all cursor-pointer ${
            activeTab === 'general'
              ? 'bg-accent-secondary/20 text-text-primary border-b-2 border-accent-secondary'
              : 'text-text-secondary hover:text-white hover:bg-surface-color-light'
          }`}
        >
          <ShieldAlert size={16} /> General Admin
        </button>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit(handleSaveSettings)} className="glass-panel p-6 md:p-8">
        {/* TAB 1: EVENT INFORMATION */}
        {activeTab === 'event' && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <h2 className="text-xl font-heading tracking-[2px] text-accent-primary uppercase m-0 flex items-center gap-2">
              <Calendar size={22} className="text-accent-primary" /> Core Event Information
            </h2>
            <p className="text-xs text-text-secondary m-0">Basic event metadata rendered on public portals and headers.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextInput
                label="Event Name"
                required
                {...register('eventInfo.eventName')}
                error={errors.eventInfo?.eventName?.message}
              />
              <TextInput
                label="Tagline / Motto"
                required
                {...register('eventInfo.tagline')}
                error={errors.eventInfo?.tagline?.message}
              />
              <TextInput
                label="Club / Host Organization"
                required
                {...register('eventInfo.clubName')}
                error={errors.eventInfo?.clubName?.message}
              />
              <TextInput
                label="Venue / Location"
                required
                {...register('eventInfo.venue')}
                error={errors.eventInfo?.venue?.message}
              />
              <TextInput
                label="Event Date"
                type="date"
                required
                {...register('eventInfo.eventDate')}
                error={errors.eventInfo?.eventDate?.message}
              />
              <TextInput
                label="Event Time"
                type="text"
                placeholder="e.g. 09:00 AM"
                required
                {...register('eventInfo.eventTime')}
                error={errors.eventInfo?.eventTime?.message}
              />
              <TextInput
                label="Support Email"
                type="email"
                required
                {...register('eventInfo.contactEmail')}
                error={errors.eventInfo?.contactEmail?.message}
              />
              <TextInput
                label="Support Phone"
                required
                {...register('eventInfo.contactPhone')}
                error={errors.eventInfo?.contactPhone?.message}
              />
            </div>

            <TextAreaInput
              label="Event Description / Guidelines"
              rows={4}
              {...register('eventInfo.description')}
              error={errors.eventInfo?.description?.message}
            />
          </div>
        )}

        {/* TAB 2: DISPLAY SETTINGS */}
        {activeTab === 'display' && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <h2 className="text-xl font-heading tracking-[2px] text-accent-secondary uppercase m-0 flex items-center gap-2">
              <Monitor size={22} className="text-accent-secondary" /> Display & UI Preferences
            </h2>
            <p className="text-xs text-text-secondary m-0">Customize visual theme modes, glitch effects, scanlines, and table density.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectInput
                label="Cyberpunk Theme Preset"
                {...register('display.themeMode')}
                options={[
                  { value: 'Neon Cyberpunk', label: 'Neon Cyberpunk (Vice City Classic)' },
                  { value: 'Dark High Tech', label: 'Dark High Tech' },
                  { value: 'Minimal Cyber', label: 'Minimal Cyber' }
                ]}
                error={errors.display?.themeMode?.message}
              />
              <TextInput
                label="Telemetry Auto-Refresh (Seconds)"
                type="number"
                min={5}
                max={300}
                {...register('display.refreshIntervalSeconds', { valueAsNumber: true })}
                error={errors.display?.refreshIntervalSeconds?.message}
              />
            </div>

            <div className="flex flex-col gap-3 pt-4 border-t border-border-color">
              <ToggleSwitch
                label="Vice City CRT Scanlines"
                description="Enable retro CRT scanline overlays across administrative portals"
                checked={displayWatch.enableScanlines}
                onChange={(val) => setValue('display.enableScanlines', val)}
              />
              <ToggleSwitch
                label="Neon Sign Glitch Animations"
                description="Enable text flicker and glitch effects on active UI elements"
                checked={displayWatch.enableGlitchEffects}
                onChange={(val) => setValue('display.enableGlitchEffects', val)}
              />
              <ToggleSwitch
                label="Compact Table Mode"
                description="Reduce table row padding for higher data density"
                checked={displayWatch.compactTables}
                onChange={(val) => setValue('display.compactTables', val)}
              />
            </div>
          </div>
        )}

        {/* TAB 3: ANNOUNCEMENT SETTINGS */}
        {activeTab === 'announcements' && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <h2 className="text-xl font-heading tracking-[2px] text-accent-tertiary uppercase m-0 flex items-center gap-2">
              <Megaphone size={22} className="text-accent-tertiary" /> Announcement & Broadcast Policy
            </h2>
            <p className="text-xs text-text-secondary m-0">Manage default options for new bulletins and auto-archiving schedules.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectInput
                label="Default Category"
                {...register('announcement.defaultCategory')}
                options={[
                  { value: 'General', label: 'General' },
                  { value: 'Urgent', label: 'Urgent' },
                  { value: 'Schedule', label: 'Schedule' },
                  { value: 'Competition', label: 'Competition' },
                  { value: 'Payment', label: 'Payment' }
                ]}
                error={errors.announcement?.defaultCategory?.message}
              />
              <SelectInput
                label="Default Target Audience"
                {...register('announcement.defaultTargetAudience')}
                options={[
                  { value: 'All', label: 'All Users' },
                  { value: 'Participants', label: 'Participants' },
                  { value: 'Judges', label: 'Judges' },
                  { value: 'Club Members', label: 'Club Members' }
                ]}
                error={errors.announcement?.defaultTargetAudience?.message}
              />
              <TextInput
                label="Auto-Archive Period (Days)"
                type="number"
                min={1}
                max={365}
                {...register('announcement.autoArchiveDays', { valueAsNumber: true })}
                error={errors.announcement?.autoArchiveDays?.message}
              />
            </div>

            <div className="pt-4 border-t border-border-color">
              <ToggleSwitch
                label="Push Notification on Publish"
                description="Trigger broadcast notifications to connected client sockets upon publishing"
                checked={announcementWatch.notifyOnPublish}
                onChange={(val) => setValue('announcement.notifyOnPublish', val)}
              />
            </div>
          </div>
        )}

        {/* TAB 4: GENERAL ADMIN SETTINGS */}
        {activeTab === 'general' && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <h2 className="text-xl font-heading tracking-[2px] text-status-error uppercase m-0 flex items-center gap-2">
              <ShieldAlert size={22} className="text-status-error" /> General System Administration
            </h2>
            <p className="text-xs text-text-secondary m-0">Registration controls, fee structures, and emergency maintenance controls.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TextInput
                label="Maximum Team Size"
                type="number"
                min={1}
                max={10}
                {...register('general.maxTeamSize', { valueAsNumber: true })}
                error={errors.general?.maxTeamSize?.message}
              />
              <TextInput
                label="Registration Fee"
                type="number"
                min={0}
                {...register('general.registrationFee', { valueAsNumber: true })}
                error={errors.general?.registrationFee?.message}
              />
              <TextInput
                label="Currency Code"
                {...register('general.currency')}
                error={errors.general?.currency?.message}
              />
            </div>

            <div className="flex flex-col gap-3 pt-4 border-t border-border-color">
              <ToggleSwitch
                label="Allow New Registrations"
                description="Enable team and participant registration forms across the platform"
                checked={generalWatch.allowNewRegistrations}
                onChange={(val) => setValue('general.allowNewRegistrations', val)}
              />
              <ToggleSwitch
                label="Judge Auto-Assignment"
                description="Automatically pair newly registered teams with available judging panels"
                checked={generalWatch.judgeAutoAssignment}
                onChange={(val) => setValue('general.judgeAutoAssignment', val)}
              />
              <ToggleSwitch
                label="Emergency Maintenance Mode"
                description="Lock down public access and display a system maintenance banner"
                checked={generalWatch.maintenanceMode}
                onChange={(val) => setValue('general.maintenanceMode', val)}
              />
            </div>
          </div>
        )}

        {/* Footer save button */}
        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-border-color">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 font-bold font-tech uppercase tracking-[1px] cursor-pointer transition-all duration-200 border-none bg-accent-primary text-black hover:bg-accent-primary-hover hover:shadow-[0_0_15px_rgba(251,200,21,0.4)]"
          >
            <Save size={18} /> {saving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
