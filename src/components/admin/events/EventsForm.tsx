import React, { useState } from 'react';
import { eventsApi, CreateEventRequest } from "@/api/events.api";
import { showError, showSuccess } from "@/lib/toast";

interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void; // Optional callback to refresh the list in the parent view
}

export function EventForm({ isOpen, onClose, onSuccess }: EventFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "auctions",
    description: "",
    location: "",
    startsAt: "",
    endsAt: "",
    isAllDay: false,
    imageUrl: "",
    isFeatured: true,
    capacity: 50,
    accessType: "open",
    status: "draft"
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Formats HTML datetime-local state string fields to standard ISO Strings required by the backend schema
      const payload: CreateEventRequest = {
        ...formData,
        capacity: Number(formData.capacity),
        startsAt: formData.startsAt ? new Date(formData.startsAt).toISOString() : new Date().toISOString(),
        endsAt: formData.endsAt ? new Date(formData.endsAt).toISOString() : new Date().toISOString(),
      };

      await eventsApi.create(payload);

      showSuccess("Event successfully created!");
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to create event:", error);
      showError("Something went wrong while creating the event.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex justify-end bg-black/70 backdrop-blur-sm">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={isSubmitting ? undefined : onClose} />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-xl bg-[#0c0d0e] h-full text-white flex flex-col shadow-2xl border-l border-[#D4A847]/10">
        
        {/* Header */}
        <div className="p-6 border-b border-zinc-900/50 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-[#D4A847] uppercase">
              — Create New
            </p>
            <h2 className="text-2xl font-semibold font-copperplate uppercase mt-1">
              Add Event
            </h2>
          </div>
          <button 
            disabled={isSubmitting} 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-zinc-900 text-zinc-500 transition-colors disabled:opacity-30"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form id="event-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
          
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Event Title</label>
              <input 
                name="title" 
                value={formData.title} 
                onChange={handleChange}
                placeholder="e.g. Auction Day — Yas Marina"
                className="bg-[#121314] border border-zinc-800 rounded-lg px-4 py-3 text-sm focus:border-[#D4A847]/40 outline-none transition-all"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Category</label>
                <select 
                  name="category" 
                  value={formData.category} 
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="bg-[#121314] border border-zinc-800 rounded-lg px-4 py-3 text-sm focus:border-[#D4A847]/40 outline-none transition-all appearance-none"
                >
                  <option value="auctions">Auctions</option>
                  <option value="drives">Drives</option>
                  <option value="social">Social</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Capacity</label>
                <input 
                  type="number" 
                  name="capacity" 
                  value={formData.capacity} 
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="bg-[#121314] border border-zinc-800 rounded-lg px-4 py-3 text-sm focus:border-[#D4A847]/40 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-bold tracking-[0.15em] text-[#D4A847] border-b border-zinc-900 pb-2">SCHEDULE</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Starts At</label>
                <input 
                  type="datetime-local" 
                  name="startsAt" 
                  value={formData.startsAt}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                  className="bg-[#121314] border border-zinc-800 rounded-lg px-4 py-3 text-sm focus:border-[#D4A847]/40 outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Ends At</label>
                <input 
                  type="datetime-local" 
                  name="endsAt" 
                  value={formData.endsAt}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                  className="bg-[#121314] border border-zinc-800 rounded-lg px-4 py-3 text-sm focus:border-[#D4A847]/40 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Location & Image */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-bold tracking-[0.15em] text-[#D4A847] border-b border-zinc-900 pb-2">DETAILS</h3>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Location</label>
              <input 
                name="location" 
                value={formData.location} 
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="Yas Marina Circuit, Abu Dhabi"
                className="bg-[#121314] border border-zinc-800 rounded-lg px-4 py-3 text-sm focus:border-[#D4A847]/40 outline-none"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Image URL</label>
              <input 
                name="imageUrl" 
                value={formData.imageUrl} 
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="https://example.com/image.jpg"
                className="bg-[#121314] border border-zinc-800 rounded-lg px-4 py-3 text-sm focus:border-[#D4A847]/40 outline-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Description</label>
              <textarea 
                name="description" 
                rows={3}
                value={formData.description} 
                onChange={handleChange}
                disabled={isSubmitting}
                className="bg-[#121314] border border-zinc-800 rounded-lg px-4 py-3 text-sm focus:border-[#D4A847]/40 outline-none resize-none"
                required
              />
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="p-8 border-t border-zinc-950 bg-[#0c0d0e]">
          <div className="flex gap-3">
            <button 
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="flex-1 py-4 rounded-xl text-[10px] font-bold tracking-widest text-zinc-400 border border-zinc-800 hover:bg-zinc-900 uppercase transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              form="event-form"
              disabled={isSubmitting}
              className="flex-1 py-4 rounded-xl text-[10px] font-bold tracking-widest text-dark bg-primary hover:bg-[#D4B45C] uppercase shadow-[0_0_20px_rgba(201,168,76,0.15)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-dark/30 border-t-dark rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Event"
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}