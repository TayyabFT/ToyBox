import React, { useState, useEffect } from 'react';

interface Attendee {
  name: string;
  car: string;
  status: 'CONFIRMED' | 'WAITLIST';
  initial?: string;
  profileImageUrl?: string;
}

interface EventDetails {
  title: string;
  date: string;
  rsvpsCount: number;
  capacity: number;
  waitlistCount: number;
  attendanceRate: number;
  attendees: Attendee[];
}

interface EventPopupProps {
  isOpen: boolean;
  onClose: () => void;
  eventData?: EventDetails;
  isLoading?: boolean;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
  isDeleting?: boolean;
}

export function EventPopup({
  isOpen,
  onClose,
  eventData,
  isLoading = false,
  onEditClick,
  onDeleteClick,
  isDeleting = false,
}: EventPopupProps) {
  const [activeTab, setActiveTab] = useState<'RSVPS' | 'WAITLIST' | 'NOTES' | 'SETTINGS'>('RSVPS');
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setConfirmDelete(false);
      setActiveTab('RSVPS');
    }
  }, [isOpen]);

  if (!isOpen || !eventData) return null;

  const confirmedAttendees = eventData.attendees.filter((a) => a.status === 'CONFIRMED');
  const waitlistAttendees = eventData.attendees.filter((a) => a.status === 'WAITLIST');

  const renderAttendeeList = (attendees: Attendee[], emptyMessage: string) => {
    if (isLoading) {
      return (
        <div className="space-y-2.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#121314] rounded-xl p-3 border border-zinc-900/60 flex items-center gap-3 animate-pulse">
              <div className="w-9 h-9 rounded-full bg-zinc-800 shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-32 bg-zinc-800 rounded" />
                <div className="h-2.5 w-20 bg-zinc-900 rounded" />
              </div>
              <div className="h-5 w-20 bg-zinc-800 rounded-full" />
            </div>
          ))}
        </div>
      );
    }

    if (attendees.length === 0) {
      return (
        <div className="text-center py-12 text-zinc-600 text-xs tracking-wider uppercase">
          {emptyMessage}
        </div>
      );
    }

    return attendees.map((attendee, index) => (
      <div
        key={`${attendee.name}-${index}`}
        className="bg-[#121314] rounded-xl p-3 border border-zinc-900/60 flex items-center justify-between hover:border-[#D4A847]/10 transition-all cursor-pointer group"
      >
        <div className="flex items-center gap-3">
          {attendee.profileImageUrl ? (
            <img
              src={attendee.profileImageUrl}
              alt={attendee.name}
              className="w-9 h-9 rounded-full object-cover border border-[#D4A847]/20"
            />
          ) : (
            <div className="w-9 h-9 rounded-full border border-[#D4A847]/20 flex items-center justify-center text-[11px] font-bold text-[#D4A847] bg-[#D4A847]/5 shrink-0">
              {attendee.initial ?? attendee.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h4 className="text-sm font-medium text-zinc-200 tracking-wide">{attendee.name}</h4>
            <p className="text-xs text-zinc-600 mt-0.5">{attendee.car}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 text-[9px] font-bold tracking-widest px-2.5 py-1 rounded-full border ${
            attendee.status === 'WAITLIST'
              ? 'text-amber-400 bg-amber-400/5 border-amber-400/10'
              : 'text-emerald-500 bg-emerald-500/5 border-emerald-500/10'
          }`}>
            <span className={`w-1 h-1 rounded-full ${attendee.status === 'WAITLIST' ? 'bg-amber-400' : 'bg-emerald-500'}`} />
            {attendee.status}
          </div>
          <svg className="w-3.5 h-3.5 text-zinc-700 group-hover:text-zinc-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    ));
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={() => { setConfirmDelete(false); onClose(); }} />

      <div className="relative w-full max-w-xl bg-[#0c0d0e] h-full text-white flex flex-col shadow-2xl border-l border-zinc-900/50">
        <div className="p-6 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] text-[#D4A847] uppercase mb-1">
                EVENT MANAGEMENT
              </p>
              <h2 className="text-xl font-bold tracking-wide text-zinc-100 font-sans">
                {eventData.title}
              </h2>
              <div className="flex items-center gap-2 mt-2 text-zinc-500 text-xs">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{eventData.date}</span>
              </div>
            </div>

            <button
              onClick={() => { setConfirmDelete(false); onClose(); }}
              className="p-2 rounded-full border border-[#D4A847]/10 bg-zinc-900/30 hover:bg-zinc-900 text-zinc-400 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 px-6 pb-6">
          <div className="bg-[#121314] rounded-xl p-4 border border-[#D4A847]/5">
            <span className="text-2xl font-semibold text-[#D4A847]">{eventData.rsvpsCount}</span>
            <p className="text-[10px] font-bold tracking-wider text-zinc-400 mt-1">RSVPS</p>
            <p className="text-[9px] text-zinc-600 mt-0.5">of {eventData.capacity} capacity</p>
          </div>
          <div className="bg-[#121314] rounded-xl p-4 border border-[#D4A847]/5">
            <span className="text-2xl font-semibold text-[#D4A847]">{eventData.waitlistCount}</span>
            <p className="text-[10px] font-bold tracking-wider text-zinc-400 mt-1">WAITLIST</p>
            <p className="text-[9px] text-zinc-600 mt-0.5">members waiting</p>
          </div>
          <div className="bg-[#121314] rounded-xl p-4 border border-[#D4A847]/5">
            <span className="text-2xl font-semibold text-[#D4A847]">{eventData.attendanceRate}%</span>
            <p className="text-[10px] font-bold tracking-wider text-zinc-400 mt-1">CONFIRMED</p>
            <p className="text-[9px] text-zinc-600 mt-0.5">attendance rate</p>
          </div>
        </div>

        <div className="flex border-b border-zinc-900/80 px-6">
          {(['RSVPS', 'WAITLIST', 'NOTES', 'SETTINGS'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-[11px] font-bold tracking-[0.15em] mr-8 transition-all border-b-2 ${
                activeTab === tab
                  ? 'border-[#D4A847] text-[#D4A847]'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-2.5 pb-36">
          {activeTab === 'RSVPS' && renderAttendeeList(confirmedAttendees, 'No RSVPs yet')}
          {activeTab === 'WAITLIST' && renderAttendeeList(waitlistAttendees, 'No waitlist members')}
          {activeTab !== 'RSVPS' && activeTab !== 'WAITLIST' && (
            <div className="text-center py-12 text-zinc-600 text-xs tracking-wider uppercase">
              {activeTab} view content goes here
            </div>
          )}
        </div>

        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#0c0d0e] via-[#0c0d0e] to-transparent p-6 pt-10 space-y-2.5 border-t border-zinc-950">
          <div className="grid grid-cols-2 gap-3">
            <button onClick={onEditClick} className="flex items-center justify-center gap-2 border border-[#D4A847]/20 hover:border-[#D4A847]/50 text-zinc-300 bg-[#121314]/50 py-3 rounded-xl text-[10px] font-bold tracking-[0.15em] uppercase transition-all">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              EDIT EVENT
            </button>
            <button className="flex items-center justify-center gap-2 border border-[#D4A847]/20 hover:border-[#D4A847]/50 text-[#D4A847] bg-[#D4A847]/5 py-3 rounded-xl text-[10px] font-bold tracking-[0.15em] uppercase transition-all">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              SEND UPDATE
            </button>
          </div>

          {confirmDelete ? (
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmDelete(false)}
                disabled={isDeleting}
                className="flex-1 py-3 rounded-xl text-[10px] font-bold tracking-[0.15em] uppercase border border-zinc-800 text-zinc-400 hover:bg-zinc-900 transition-all disabled:opacity-50"
              >
                Keep Event
              </button>
              <button
                onClick={onDeleteClick}
                disabled={isDeleting}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-bold tracking-[0.15em] uppercase bg-red-600 hover:bg-red-700 text-white transition-all disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
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
              className="w-full flex items-center justify-center gap-2 border border-red-950/40 hover:border-red-500/30 text-red-400/80 hover:text-red-400 bg-red-950/5 py-3 rounded-xl text-[10px] font-bold tracking-[0.15em] uppercase transition-all"
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
