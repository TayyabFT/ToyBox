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
  member: {
    dashboard: "/api/v1/dashboard",
    diary: "/api/v1/members/diary",
  },
  memberVehicles: {
    list: "/api/v1/vehicles",
    detail: (id: string | number) => `/api/v1/vehicles/${id}`,
  },
  memberTransport: {
    requests: "/api/v1/transport/requests",
  },
  memberDetailing: {
    bookings: "/api/v1/detailing/bookings",
    catalog: "/api/v1/detailing/catalog",
  },
  memberMaintenance: {
    requests: "/api/v1/maintenance/requests",
  },
  memberParking: {
    slots: "/api/v1/parking/slots",
    sessions: "/api/v1/parking/sessions",
    sessionDetail: (id: string | number) => `/api/v1/parking/sessions/${id}`,
  },
  memberSourcing: {
    requests: "/api/v1/sourcing/requests",
    request: (id: string | number) => `/api/v1/sourcing/requests/${id}`,
    status: (id: string | number) => `/api/v1/sourcing/requests/${id}/status`,
    cancel: (id: string | number) => `/api/v1/sourcing/requests/${id}/cancel`,
    approveVehicle: (id: string | number) => `/api/v1/sourcing/requests/${id}/approve-vehicle`,
    rejectVehicle: (id: string | number) => `/api/v1/sourcing/requests/${id}/reject-vehicle`,
  },
  clubhouse: {
    spaces: "/api/v1/clubhouse/spaces",
    spacesByCategory: "/api/v1/clubhouse/spaces/by-category",
    overview: "/api/v1/clubhouse/overview",
    availability: (id: string | number) => `/api/v1/clubhouse/spaces/${id}/availability`,
    reservations: "/api/v1/clubhouse/reservations",
    slotAvailability: "/api/v1/clubhouse/availability",
  },
  adminClubhouse: {
    overview: "/api/v1/admin/clubhouse/overview",
    reservations: "/api/v1/admin/clubhouse/reservations",
    restaurant: "/api/v1/admin/clubhouse/restaurant",
    restaurantOverview: "/api/v1/admin/clubhouse/restaurant/overview",
    privateLounge: "/api/v1/admin/clubhouse/private-lounge",
    privateLoungeOverview: "/api/v1/admin/clubhouse/private-lounge/overview",
    suiteLounge: "/api/v1/admin/clubhouse/suite-lounge",
    suiteLoungeOverview: "/api/v1/admin/clubhouse/suite-lounge/overview",
  },
  vehicles: {
    inventory: "/api/v1/admin/vehicles/inventory",
    admin: "/api/v1/admin/vehicles",
    detail: (id: string | number) => `/api/v1/admin/vehicles/${id}`,
    details: (id: string | number) => `/api/v1/admin/vehicles/${id}/details`,
  },
  staffVehicles: {
    summary: "/api/v1/staff/vehicles/summary",
    assigned: "/api/v1/staff/vehicles/assigned",
    assignedDetail: (id: string) => `/api/v1/staff/vehicles/assigned/${id}`,
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
    main: "/api/v1/admin/overview",
    jobs: "/api/v1/admin/overview/jobs",
  },
  adminServiceRequestJobs: {
    active: "/api/v1/admin/service-requests/jobs/active",
    detail: (taskQueueId: string) =>
      `/api/v1/admin/service-requests/jobs/${taskQueueId}`,
    all: "/api/v1/admin/service-requests/jobs",
  },
  adminNavigation: {
    badges: "/api/v1/admin/navigation/badges",
    resolveBadge: "/api/v1/admin/navigation/badges/resolve",
  },
  staffNavigation: {
    badges: "/api/v1/staff/navigation/badges",
    resolveBadge: "/api/v1/staff/navigation/badges/resolve",
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
  staffInspections: {
    list: "/api/v1/staff/inspections",
    summary: "/api/v1/staff/inspections/summary",
    detail: (id: string | number) => `/api/v1/staff/inspections/${id}`,
    photos: (id: string | number) => `/api/v1/staff/inspections/${id}/photos`,
    submit: (id: string | number) => `/api/v1/staff/inspections/${id}/submit`,
  },
  staffParking: {
    slots: "/api/v1/staff/parking/slots",
    slotDetail: (id: string | number) => `/api/v1/staff/parking/slots/${id}`,
    summary: "/api/v1/staff/parking/slots/summary",
    sessions: "/api/v1/staff/parking/sessions",
    sessionDetail: (id: string | number) =>
      `/api/v1/staff/parking/sessions/${id}`,
    sessionAccept: (id: string | number) =>
      `/api/v1/staff/parking/sessions/${id}/accept`,
    sessionStart: (id: string | number) =>
      `/api/v1/staff/parking/sessions/${id}/start`,
    sessionComplete: (id: string | number) =>
      `/api/v1/staff/parking/sessions/${id}/complete`,
  },
  adminParking: {
    slots: "/api/v1/admin/parking/slots",
    slotDetail: (id: string | number) => `/api/v1/admin/parking/slots/${id}`,
    summary: "/api/v1/admin/parking/slots/summary",
    sessions: "/api/v1/admin/parking/sessions",
    sessionDetail: (id: string | number) =>
      `/api/v1/admin/parking/sessions/${id}`,
  },
  staffClubhouse: {
    summary: "/api/v1/staff/clubhouse/summary",
    reservations: "/api/v1/staff/clubhouse/reservations",
    reservationDetail: (id: string | number) =>
      `/api/v1/staff/clubhouse/reservations/${id}`,
    reservationApprove: (id: string | number) =>
      `/api/v1/staff/clubhouse/reservations/${id}/approve`,
    reservationCancel: (id: string | number) =>
      `/api/v1/staff/clubhouse/reservations/${id}/cancel`,
    reservationMessage: (id: string | number) =>
      `/api/v1/staff/clubhouse/reservations/${id}/message`,
  },
  staffHealthReports: {
    vehicles: "/api/v1/staff/health-reports/vehicles",
    vehicleDetail: (id: string | number) =>
      `/api/v1/staff/health-reports/vehicles/${id}`,
  },
  staffPhotoUploads: {
    list: "/api/v1/staff/photo-uploads",
    summary: "/api/v1/staff/photo-uploads/summary",
    today: "/api/v1/staff/photo-uploads/today",
    detail: (id: string | number) => `/api/v1/staff/photo-uploads/${id}`,
    sync: (id: string | number) => `/api/v1/staff/photo-uploads/${id}/sync`,
    syncAll: "/api/v1/staff/photo-uploads/sync-all",
    upload: "/api/v1/staff/photo-uploads/upload",
  },
  staffOperationalUpdates: {
    list: "/api/v1/staff/operational-updates",
    summary: "/api/v1/staff/operational-updates/summary",
    feed: "/api/v1/staff/operational-updates/feed",
    pinned: "/api/v1/staff/operational-updates/pinned",
    myShiftLog: "/api/v1/staff/operational-updates/my-shift-log",
    detail: (id: string | number) => `/api/v1/staff/operational-updates/${id}`,
    pin: (id: string | number) => `/api/v1/staff/operational-updates/${id}/pin`,
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
  memberChat: {
    initiate: "/api/v1/chat/initiate",
    messages: "/api/v1/chat/messages",
    markRead: "/api/v1/chat/read",
  },
  events: {
    createevent: "/api/v1/admin/events",
    getevents: "/api/v1/admin/events/all",
    getstats: "/api/v1/admin/events/stats",
    update: (id: string | number) => `/api/v1/admin/events/${id}`,
    detail: (id: string | number) => `/api/v1/admin/events/${id}`,
    delete: (id: string | number) => `/api/v1/admin/events/${id}`,
    sendUpdate: (id: string | number) =>
      `/api/v1/admin/events/${id}/send-update`,
    notes: (id: string | number) => `/api/v1/admin/events/${id}/notes`,
  },
  /** Member-facing events — uses the public/optionalAuth routes */
  memberEvents: {
    list:      "/api/v1/events",
    join:      (id: string) => `/api/v1/events/${id}/join`,
    leave:     (id: string) => `/api/v1/events/${id}/leave`,
    waitlist:  (id: string) => `/api/v1/events/${id}/waitlist`,
    favorite:  (id: string) => `/api/v1/events/${id}/favorite`,
    detail:    (id: string) => `/api/v1/events/${id}`,
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
  adminProfile: {
    overview: "/api/v1/admin/profile/overview",
    profile: "/api/v1/admin/profile",
    activity: "/api/v1/admin/profile/activity",
    sessions: "/api/v1/admin/profile/sessions",
  },
  adminAnalytics: {
    stats: "/api/v1/admin/analytics/stats",
    dashboard: "/api/v1/admin/analytics",
  },
  ai: {
    conversation: "/api/v1/ai/conversation",
    conversationReset: "/api/v1/ai/conversation/reset",
    conversationMessages: (id: string | number) =>
      `/api/v1/ai/conversations/${id}/messages`,
    query: "/api/v1/ai/query",
  },
} as const;
