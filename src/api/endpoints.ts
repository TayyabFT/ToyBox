export const API_ENDPOINTS = {
  auth: {
    signIn: "/api/v1/auth/sign-in",
    setupPassword: "/api/v1/auth/setup-password",
    refresh: "/api/v1/auth/refresh",
    invitations: "/api/v1/auth/invitations",
    verifyOtp: "/api/v1/auth/invitations/verify-otp",
    resend: "/api/v1/auth/invitations/resend",
  },
  notifications: {
    inbox: "/api/v1/notifications/inbox",
    readAll: "/api/v1/notifications/inbox/read-all",
    markRead: (id: string | number) =>
      `/api/v1/notifications/inbox/${id}/read`,
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
    jobs: "/api/v1/staff/overview/jobs",
  },
  chat: {
    conversations: "/api/v1/staff/chat/conversations",
    initiate: "/api/v1/staff/chat/initiate",
    messages: (memberId: string | number) =>
      `/api/v1/staff/chat/${memberId}/messages`,
    markRead: (memberId: string | number) =>
      `/api/v1/staff/chat/${memberId}/read`,
  },
  events: {
    createevent: "/api/v1/events",
     getevents: "/api/v1/events/all", 
    getstats: "/api/v1/events/stats", 
    update: (id: string | number) => `/api/v1/events/${id}`,
  
  },
} as const;
