import React, { useState, useEffect } from 'react';
import { ShimmerBlock } from '@/components/common/ShimmerBlock';

interface Attendee {
  name: string;
  car: string;
  status: 'CONFIRMED' | 'WAITLIST';
  initial?: string;
  profileImageUrl?: string;
}

interface EventDetails {
  id?: string | number;
  title: string;
  date: string;
  rsvpsCount: number;
  capacity: number;
  waitlistCount: number;
  attendanceRate: number;
  attendees: Attendee[];
  notes?: string;
}

interface EventPopupProps {
  isOpen: boolean;
  onClose: () => void;
  eventData?: EventDetails;
  isLoading?: boolean;
  onEditClick?: () => void;
  onSendUpdateClick?: () => void;
  onDeleteClick?: () => void;
  onSaveNotes?: (notes: string) => void | Promise<void>;
  isSendingUpdate?: boolean;
  isDeleting?: boolean;
  isSavingNotes?: boolean;
}

export function EventPopup({
  isOpen,
  onClose,
  eventData,
  isLoading = false,
  onEditClick,
  onSendUpdateClick,
  onDeleteClick,
  onSaveNotes,
  isSendingUpdate = false,
  isDeleting = false,
  isSavingNotes = false,
}: EventPopupProps) {
  const [activeTab, setActiveTab] = useState<'RSVPS' | 'WAITLIST' | 'NOTES' | 'SETTINGS'>('RSVPS');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [notesDraft, setNotesDraft] = useState('');

  useEffect(() => {
    if (isOpen) {
      setConfirmDelete(false);
      setActiveTab('RSVPS');
    }
  }, [isOpen]);

  useEffect(() => {
    setNotesDraft(eventData?.notes ?? '');
  }, [eventData?.id, eventData?.notes]);

  if (!isOpen || !eventData) return null;

  const confirmedAttendees = eventData.attendees.filter((a) => a.status === 'CONFIRMED');
  const waitlistAttendees = eventData.attendees.filter((a) => a.status === 'WAITLIST');

  const renderAttendeeList = (attendees: Attendee[], emptyMessage: string) => {
    if (isLoading) {
      return (
        <div className="space-y-2.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-accent/20 bg-card p-3">
              <ShimmerBlock className="size-9 shrink-0 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <ShimmerBlock className="h-3 w-32" />
                <ShimmerBlock className="h-2.5 w-20" />
              </div>
              <ShimmerBlock className="h-5 w-20 rounded-full" />
            </div>
          ))}
        </div>
      );
    }

    if (attendees.length === 0) {
      return (
        <div className="text-center py-12 text-section-label text-xs tracking-wider uppercase">
          {emptyMessage}
        </div>
      );
    }

    return attendees.map((attendee, index) => (
      <div
        key={`${attendee.name}-${index}`}
        className="bg-card rounded-xl p-3 border border-accent/20 flex items-center justify-between hover:border-accent/35 transition-all"
      >
        <div className="flex items-center gap-3">
          {attendee.profileImageUrl ? (
            <img
              src={attendee.profileImageUrl}
              alt={attendee.name}
              className="w-9 h-9 rounded-full object-cover border border-accent/20"
            />
          ) : (
            <div className="admin-gold-avatar w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0">
              {attendee.initial ?? attendee.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h4 className="text-sm font-medium text-foreground-soft tracking-wide">{attendee.name}</h4>
            <p className="text-xs text-section-label mt-0.5">{attendee.car}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 text-[9px] font-bold tracking-widest px-2.5 py-1 rounded-full border ${
            attendee.status === 'WAITLIST'
              ? 'text-accent bg-accent/5 border-accent/10'
              : 'text-teal bg-teal/5 border-teal/10'
          }`}>
            <span className={`w-1 h-1 rounded-full ${attendee.status === 'WAITLIST' ? 'bg-accent' : 'bg-teal'}`} />
            {attendee.status}
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-dark/60 backdrop-blur-sm"
        onClick={() => { setConfirmDelete(false); onClose(); }}
      />

      <div className="admin-modal-panel relative z-10 flex w-full max-w-xl max-h-[90vh] flex-col overflow-hidden rounded-2xl border border-accent/25 text-foreground shadow-[var(--shadow-modal)]">
        <div className="p-6 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] text-accent uppercase mb-1">
                EVENT MANAGEMENT
              </p>
              <h2 className="text-xl font-bold tracking-wide text-foreground font-sans">
                {eventData.title}
              </h2>
              <div className="flex items-center gap-2 mt-2 text-secondary text-xs">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{eventData.date}</span>
              </div>
            </div>

            <button
              onClick={() => { setConfirmDelete(false); onClose(); }}
              className="p-2 rounded-full border border-accent/25 bg-card hover:bg-elevated text-secondary transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 px-6 pb-6">
          <div className="bg-card rounded-xl p-4 border border-accent/20">
            <span className="text-2xl font-semibold text-accent">{eventData.rsvpsCount}</span>
            <p className="text-[10px] font-bold tracking-wider text-secondary mt-1">RSVPS</p>
            <p className="text-[9px] text-section-label mt-0.5">of {eventData.capacity} capacity</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-accent/20">
            <span className="text-2xl font-semibold text-accent">{eventData.waitlistCount}</span>
            <p className="text-[10px] font-bold tracking-wider text-secondary mt-1">WAITLIST</p>
            <p className="text-[9px] text-section-label mt-0.5">members waiting</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-accent/20">
            <span className="text-2xl font-semibold text-accent">{eventData.attendanceRate}%</span>
            <p className="text-[10px] font-bold tracking-wider text-secondary mt-1">CONFIRMED</p>
            <p className="text-[9px] text-section-label mt-0.5">attendance rate</p>
          </div>
        </div>

        <div className="flex border-b border-accent/20 px-6">
          {(['RSVPS', 'WAITLIST', 'NOTES', 'SETTINGS'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-[11px] font-bold tracking-[0.15em] mr-8 transition-all border-b-2 ${
                activeTab === tab
                  ? 'border-accent text-accent'
                  : 'border-transparent text-secondary hover:text-foreground-soft'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto Custom__Scrollbar p-6 space-y-2.5">
          {activeTab === 'RSVPS' && renderAttendeeList(confirmedAttendees, 'No RSVPs yet')}
          {activeTab === 'WAITLIST' && renderAttendeeList(waitlistAttendees, 'No waitlist members')}
          {activeTab === 'NOTES' && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="event-notes"
                  className="mb-2 block text-[10px] font-bold tracking-[0.15em] text-secondary uppercase"
                >
                  Event Notes
                </label>
                <textarea
                  id="event-notes"
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  placeholder="Add internal notes about venue, catering, parking, and logistics..."
                  rows={8}
                  disabled={isLoading || isSavingNotes}
                  className="w-full resize-none rounded-xl border border-accent/20 bg-input-muted px-4 py-3 text-sm leading-relaxed text-foreground-soft placeholder:text-section-label focus:border-accent/40 focus:outline-none disabled:opacity-60"
                />
              </div>
              <button
                type="button"
                onClick={() => onSaveNotes?.(notesDraft)}
                disabled={isLoading || isSavingNotes || !onSaveNotes}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-accent/20 bg-accent/5 py-3 text-[10px] font-bold tracking-[0.15em] text-accent uppercase transition-all hover:border-accent/50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSavingNotes ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border border-accent/30 border-t-accent" />
                    Saving...
                  </>
                ) : (
                  'Save Notes'
                )}
              </button>
            </div>
          )}
          {activeTab === 'SETTINGS' && (
            <div className="text-center py-12 text-section-label text-xs tracking-wider uppercase">
              Settings view content goes here
            </div>
          )}
        </div>

        <div className="shrink-0 space-y-2.5 border-t border-accent/20 p-6">
          <div className="grid grid-cols-2 gap-3">
            <button onClick={onEditClick} className="flex items-center justify-center gap-2 border border-accent/25 hover:border-accent/50 text-foreground-soft bg-card py-3 rounded-xl text-[10px] font-bold tracking-[0.15em] uppercase transition-all">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              EDIT EVENT
            </button>
            <button
              type="button"
              onClick={onSendUpdateClick}
              disabled={isSendingUpdate || isDeleting}
              className="flex items-center justify-center gap-2 border border-accent/20 hover:border-accent/50 text-accent bg-accent/5 py-3 rounded-xl text-[10px] font-bold tracking-[0.15em] uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSendingUpdate ? (
                <>
                  <span className="w-3.5 h-3.5 border border-accent/30 border-t-accent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  SEND UPDATE
                </>
              )}
            </button>
          </div>

          {confirmDelete ? (
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmDelete(false)}
                disabled={isDeleting}
                className="flex-1 py-3 rounded-xl text-[10px] font-bold tracking-[0.15em] uppercase border border-accent/25 text-secondary hover:bg-card transition-all disabled:opacity-50"
              >
                Keep Event
              </button>
              <button
                onClick={onDeleteClick}
                disabled={isDeleting}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-bold tracking-[0.15em] uppercase bg-pink hover:opacity-90 text-dark transition-all disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <span className="w-3 h-3 border border-dark/30 border-t-dark rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Yes, Delete
                  </>
                )}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="w-full flex items-center justify-center gap-2 border border-pink/40 hover:border-pink/30 text-pink/80 hover:text-pink bg-pink/5 py-3 rounded-xl text-[10px] font-bold tracking-[0.15em] uppercase transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              DELETE EVENT
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
