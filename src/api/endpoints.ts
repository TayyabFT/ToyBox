export const API_ENDPOINTS = {
  auth: {
    signIn: "/api/v1/auth/sign-in",
    setupPassword: "/api/v1/auth/setup-password",
    refresh: "/api/v1/auth/refresh",
    profile: "/api/v1/auth/profile",
    invitations: "/api/v1/auth/invitations",
    verifyOtp: "/api/v1/auth/invitations/verify-otp",
    resend: "/api/v1/auth/invitations/resend",
  },
  notifications: {
    inbox: "/api/v1/notifications/inbox",
    readAll: "/api/v1/notifications/inbox/read-all",
    markRead: (id: string | number) => `/api/v1/notifications/inbox/${id}/read`,
  },
  vehicles: {
    inventory: "/api/v1/admin/vehicles/inventory",
    admin: "/api/v1/admin/vehicles",
    detail: (id: string | number) => `/api/v1/admin/vehicles/${id}`,
  },
  sourcing: {
    staffRequests: "/api/v1/staff/sourcing/requests",
    adminRequests: "/api/v1/admin/sourcing/requests",
    assignVehicle: (id: string | number) =>
      `/api/v1/staff/sourcing/requests/${id}/assign`,
  },
  members: {
    summary: "/api/v1/admin/members/summary",
    list: "/api/v1/admin/members",
    detail: (id: string | number) => `/api/v1/admin/members/${id}`,
  },
  staff: {
    summary: "/api/v1/admin/staff/summary",
    list: "/api/v1/admin/staff",
    detail: (id: string | number) => `/api/v1/admin/staff/${id}`,
  },
  detailing: {
    bookings: "/api/v1/admin/detailing/bookings",
  },
  staffDetailing: {
    bookings: "/api/v1/staff/detailing/bookings",
  },
  maintenance: {
    requests: "/api/v1/admin/maintenance/requests",
  },
  staffMaintenance: {
    requests: "/api/v1/staff/maintenance/requests",
  },
  transport: {
    requests: "/api/v1/admin/transport/requests",
  },
  staffTransport: {
    requests: "/api/v1/staff/transport/requests",
  },
  overview: {
    jobs: "/api/v1/admin/overview/jobs",
  },
  staffOverview: {
    overview: "/api/v1/staff/overview",
    jobs: "/api/v1/staff/overview/jobs",
  },
  staffJobs: {
    active: "/api/v1/staff/jobs/active",
    progress: (id: string) => `/api/v1/staff/jobs/${id}/progress`,
    schedule: (id: string) => `/api/v1/staff/jobs/${id}/schedule`,
    start: (id: string) => `/api/v1/staff/jobs/${id}/start`,
    complete: (id: string) => `/api/v1/staff/jobs/${id}/complete`,
    subtask: (id: string, key: string) =>
      `/api/v1/staff/jobs/${id}/subtasks/${key}`,
    notesByReference: (referenceId: string) =>
      `/api/v1/jobs/${referenceId}/notes`,
    activeNotes: "/api/v1/staff/jobs/active/notes",
    activePhotos: "/api/v1/staff/jobs/active/photos",
    queue: "/api/v1/staff/jobs/queue",
    completed: "/api/v1/staff/jobs/completed",
  },
  chat: {
    conversations: "/api/v1/staff/chat/conversations",
    initiate: "/api/v1/staff/chat/initiate",
    messages: (memberId: string | number) =>
      `/api/v1/staff/chat/${memberId}/messages`,
    markRead: (memberId: string | number) =>
      `/api/v1/staff/chat/${memberId}/read`,
  },
  adminChat: {
    conversations: "/api/v1/admin/chat/conversations",
    initiate: "/api/v1/admin/chat/initiate",
    messages: (memberId: string | number) =>
      `/api/v1/admin/chat/${memberId}/messages`,
    markRead: (memberId: string | number) =>
      `/api/v1/admin/chat/${memberId}/read`,
  },
  events: {
    createevent: "/api/v1/events",
    getevents: "/api/v1/events/all",
    getstats: "/api/v1/events/stats",
    update: (id: string | number) => `/api/v1/events/${id}`,
    detail: (id: string | number) => `/api/v1/events/${id}`,
    delete: (id: string | number) => `/api/v1/events/${id}`,
    sendUpdate: (id: string | number) => `/api/v1/events/${id}/send-update`,
  },
  communications: {
    stats: "/api/v1/admin/communications/stats",
    bulletins: "/api/v1/admin/communications/bulletins",
    audiencePreview: "/api/v1/admin/communications/audience-preview",
  },
  workshop: {
    dashboardStats: "/api/v1/admin/workshop/dashboard/stats",
    dashboardBays: "/api/v1/admin/workshop/dashboard/bays",
    dashboardQueue: "/api/v1/admin/workshop/dashboard/queue",
  },
} as const;
