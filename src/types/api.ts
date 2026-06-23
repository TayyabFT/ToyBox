export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
};

export type SignInRequest = {
  email: string;
  password: string;
};

export type SignInData = {
  role: string;
  panel: string;
  accessToken: string;
  refreshToken: string;
};

export type SignInResponse = ApiResponse<SignInData>;

export type ApiError = {
  status: number;
  message: string;
};

export type InviteRole = "member" | "staff";

export type InviteRequest = {
  role: InviteRole;
  email: string;
  firstName?: string;
  lastName?: string;
};

export type InviteData = {
  role: string;
  panel: string;
  invitationSent: boolean;
  otpSentTo: string;
  user?: unknown;
  nextSteps?: string[];
};

export type InviteResponse = ApiResponse<InviteData>;

export type VerifyOtpRequest = {
  otp: string;
};

export type VerifyOtpData = {
  role: InviteRole;
  panel: string;
  setupToken: string;
  user?: unknown;
  nextStep?: string;
};

export type VerifyOtpResponse = ApiResponse<VerifyOtpData>;

export type ResendOtpRequest = {
  email: string;
};

export type ResendOtpResponse = ApiResponse<unknown>;

export type SetupPasswordRequest = {
  setupToken: string;
  newPassword: string;
  confirmPassword: string;
  email?: string;
};

export type SetupPasswordResponse = ApiResponse<SignInData>;

export type RefreshTokenRequest = {
  refreshToken: string;
};

export type RefreshTokenResponse = ApiResponse<SignInData>;

export type InboxNotificationRaw = {
  id: number | string;
  title?: string;
  subject?: string;
  heading?: string;
  message?: string;
  body?: string;
  description?: string;
  subheading?: string;
  summary?: string;
  content?: string;
  read?: boolean;
  isRead?: boolean;
  readAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type NotificationInboxData =
  | InboxNotificationRaw[]
  | {
      items?: InboxNotificationRaw[];
      notifications?: InboxNotificationRaw[];
      records?: InboxNotificationRaw[];
      data?: InboxNotificationRaw[];
      inbox?: InboxNotificationRaw[];
      unreadCount?: number;
    };

export type NotificationItem = {
  id: string;
  title: string;
  subheading: string;
  read: boolean;
};

export type NotificationInboxResponse = ApiResponse<NotificationInboxData>;
export type MarkNotificationReadResponse = ApiResponse<unknown>;
export type MarkAllNotificationsReadResponse = ApiResponse<unknown>;

export type InventoryVehicleHealthRaw = {
  category?: string;
  percentage?: number;
  note?: string | null;
};

export type InventoryVehicleInfoRaw = {
  name?: string;
  make?: string;
  model?: string;
  year?: number;
};

export type InventoryOwnershipInfoRaw = {
  storageBay?: string;
  mileage?: string;
  plate?: string;
};

export type InventoryVehicleRaw = {
  id?: number | string;
  name?: string;
  displayName?: string;
  make?: string;
  model?: string;
  year?: number;
  status?: string;
  storageBay?: string;
  mileage?: string;
  plate?: string;
  vehicleInfo?: InventoryVehicleInfoRaw;
  ownershipInfo?: InventoryOwnershipInfoRaw;
  health?: InventoryVehicleHealthRaw[];
  memberId?: string | number | null;
  member?: { name?: string };
  isPriority?: boolean;
};

export type VehicleInventorySummaryStat = {
  key?: string;
  label?: string;
  value?: number;
  subLabel?: string;
};

export type VehicleInventorySummary = {
  total?: VehicleInventorySummaryStat;
  ready?: VehicleInventorySummaryStat;
  inService?: VehicleInventorySummaryStat;
  overdueService?: VehicleInventorySummaryStat;
};

export type VehicleInventoryData =
  | InventoryVehicleRaw[]
  | {
      vehicles?: InventoryVehicleRaw[];
      items?: InventoryVehicleRaw[];
      records?: InventoryVehicleRaw[];
      data?: InventoryVehicleRaw[];
      summary?: VehicleInventorySummary;
      total?: number;
      limit?: number;
      offset?: number;
    };

export type VehicleInventoryResponse = ApiResponse<VehicleInventoryData>;

export type AddVehicleHealthItem = {
  category: string;
  percentage: number;
  note?: string;
};

export type AddVehicleInventoryRequest = {
  vehicleInfo: {
    name?: string;
    make?: string;
    model: string;
    year: number;
    engine: string;
    power: string;
    transmission: string;
    drive: string;
    zeroToHundred: string;
    topSpeed: string;
  };
  ownershipInfo: {
    colour: string;
    chassisNo: string;
    plate: string;
    purchasedAt: string;
    storageBay: string;
    mileage: string;
  };
  health: AddVehicleHealthItem[];
  documents?: {
    vehicleRegistration?: string;
    insuranceCertificate?: string;
    specsAndInfo?: string;
    serviceRecord?: string;
    purchasedInvoice?: string;
    warrantyCertificate?: string;
  };
  status?: string;
  isPriority?: boolean;
  imageUrl?: string;
};

export type AddVehicleInventoryResponse = ApiResponse<unknown>;

export type MemberSummaryStat = {
  key?: string;
  label?: string;
  value?: number | string;
  subLabel?: string;
  displayValue?: string;
  trend?: string;
};

export type MembersSummary = {
  totalMembers?: MemberSummaryStat;
  vipTier?: MemberSummaryStat;
  onPremises?: MemberSummaryStat;
  retentionYtd?: MemberSummaryStat;
};

export type MembersSummaryResponse = ApiResponse<MembersSummary>;

export type MemberDirectoryStatsRaw = {
  vehicles?: number;
  events?: number;
  miles?: number;
  days?: number;
};

export type MemberFilterOption = {
  key: string;
  label: string;
};

export type MemberListItemRaw = {
  id?: number | string;
  memberNumber?: string;
  memberNumberLabel?: string;
  displayName?: string;
  email?: string;
  membershipTier?: string;
  tierLabel?: string;
  memberSince?: string;
  memberSinceLabel?: string;
  lastSeen?: string;
  profileImageUrl?: string;
  headerStats?: MemberDirectoryStatsRaw;
  onPremises?: boolean;
  accountStatus?: string;
};

export type MembersListData = {
  summary?: MembersSummary;
  filters?: MemberFilterOption[];
  tier?: MemberTierFilter;
  members?: MemberListItemRaw[];
  total?: number;
  limit?: number;
  offset?: number;
};

export type MembersListResponse = ApiResponse<MembersListData>;

export type MemberTierFilter =
  | "all"
  | "access"
  | "private"
  | "principal"
  | "black_card";

export type MemberProfileData = MemberListItemRaw & {
  firstName?: string;
  lastName?: string;
  mobile?: string;
  mobileCountryCode?: string;
  residence?: string;
  displayHandle?: string;
  membershipValidUntil?: string;
  membershipValidityMonths?: string;
  invitedAt?: string;
  invitationAcceptedAt?: string;
  privacySettings?: string;
};

export type MemberProfileResponse = ApiResponse<MemberProfileData>;

export type StaffSummaryStat = {
  key?: string;
  label?: string;
  value?: number | string;
  subLabel?: string;
  displayValue?: string;
  trend?: string;
};

export type StaffSummary = {
  totalStaff?: StaffSummaryStat;
  activeStaff?: StaffSummaryStat;
  pendingActivation?: StaffSummaryStat;
  invitedThisMonth?: StaffSummaryStat;
};

export type StaffFilterOption = {
  key: string;
  label: string;
};

export type StaffListItemRaw = {
  id?: number | string;
  displayName?: string;
  email?: string;
  jobTitle?: string;
  role?: string;
  accountStatus?: string;
  lastSeen?: string;
  profileImageUrl?: string;
  invitedAt?: string;
  invitationAcceptedAt?: string;
};

export type StaffListData = {
  summary?: StaffSummary;
  filters?: StaffFilterOption[];
  status?: string;
  staff?: StaffListItemRaw[];
  total?: number;
  limit?: number;
  offset?: number;
};

export type StaffListResponse = ApiResponse<StaffListData>;

export type StaffSummaryResponse = ApiResponse<StaffSummary>;

export type StaffProfileData = StaffListItemRaw & {
  firstName?: string;
  lastName?: string;
  mobile?: string;
  mobileCountryCode?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type StaffProfileResponse = ApiResponse<StaffProfileData>;

export type SourcingSummaryStat = {
  value?: number;
  subtitle?: string;
  unit?: string;
};

export type SourcingSummary = {
  pendingConfirm?: SourcingSummaryStat;
  signOffQueue?: SourcingSummaryStat;
  completedToday?: SourcingSummaryStat;
  shiftProgress?: SourcingSummaryStat;
  inReview?: SourcingSummaryStat;
};

export type SourcingVehicleMatch = {
  make?: string;
  model?: string;
  year?: number;
  status?: string;
  vehicleId?: number | string;
};

export type SourcingPendingOffer = {
  id?: number | string;
  vehicleId?: number | string;
  status?: string;
  vehicle?: {
    id?: number | string;
    make?: string;
    model?: string;
    year?: number;
  };
};

export type SourcingRequestRaw = {
  id?: number | string;
  referenceNumber?: string;
  status?: string;
  make?: string;
  model?: string;
  yearMin?: number;
  yearMax?: number;
  colour?: string;
  memberId?: number | string;
  member?: {
    id?: number | string;
    name?: string;
    email?: string;
  };
  confirmationStatus?: string;
  canOfferVehicle?: boolean;
  pendingOffer?: SourcingPendingOffer | string | null;
  matches?: SourcingVehicleMatch[];
  timelineNotes?: string;
  createdAt?: string;
};

export type StaffSourcingRequestsData = {
  summary?: SourcingSummary;
  requests?: SourcingRequestRaw[];
  total?: number;
  count?: number;
  limit?: number;
  offset?: number;
};

export type StaffSourcingRequestsResponse =
  ApiResponse<StaffSourcingRequestsData>;

export type AdminSourcingMember = {
  id?: number | string;
  name?: string;
  profileImageUrl?: string;
};

export type AdminSourcingVehicle = {
  id?: number | string;
  displayName?: string;
  make?: string;
  model?: string;
  year?: number;
  imageUrl?: string;
};

export type AdminInReviewBookingRaw = {
  id?: number | string;
  sourcingRequestId?: number | string;
  referenceNumber?: string;
  member?: AdminSourcingMember;
  vehicle?: AdminSourcingVehicle;
  offerStartDate?: string;
  offerEndDate?: string;
  preferredDates?:
    | {
        start?: string;
        end?: string;
      }
    | string;
  status?: string;
  assignedAt?: string;
};

export type AdminStaffOnDuty = {
  id?: number | string;
  name?: string;
  role?: string;
  status?: string;
  profileImageUrl?: string;
};

export type AdminSourcingRequestsData = {
  summary?: SourcingSummary;
  inReviewBookings?: AdminInReviewBookingRaw[];
  staffOnDuty?: AdminStaffOnDuty[];
  requests?: SourcingRequestRaw[];
  total?: number;
  count?: number;
  limit?: number;
  offset?: number;
};

export type AdminSourcingRequestsResponse =
  ApiResponse<AdminSourcingRequestsData>;

export type AdminVehicleTrend = {
  direction?: string;
  value?: number;
  displayValue?: string;
};

export type AdminVehicleDashboardStat = {
  key?: string;
  label?: string;
  value?: number | string;
  subLabel?: string;
  displayValue?: string;
  trend?: AdminVehicleTrend;
  ratio?: {
    used?: number;
    total?: number;
    displayValue?: string;
  };
};

export type AdminVehicleDashboardSummary = {
  totalVehicles?: AdminVehicleDashboardStat;
  inStorage?: AdminVehicleDashboardStat;
  inService?: AdminVehicleDashboardStat;
  bayUtilization?: AdminVehicleDashboardStat;
};

export type AdminVehicleBayRaw = {
  id?: string;
  label?: string;
  occupied?: boolean;
  vehicleId?: number | string;
  statusKey?: string;
  vehicleName?: string;
  displayName?: string;
};

export type AdminVehicleBayMap = {
  level?: string;
  label?: string;
  bays?: AdminVehicleBayRaw[];
};

export type AdminVehicleOperationMember = {
  id?: number | string;
  name?: string;
  memberNumber?: string;
  profileImageUrl?: string;
};

export type AdminVehicleOperationVehicle = {
  id?: number | string;
  displayName?: string;
  make?: string;
  model?: string;
};

export type AdminVehicleLastActivity = {
  label?: string;
  at?: string;
};

export type AdminVehicleOperationRaw = {
  id?: number | string;
  bay?: string;
  member?: AdminVehicleOperationMember;
  vehicle?: AdminVehicleOperationVehicle;
  statusLabel?: string;
  statusKey?: string;
  lastActivity?: AdminVehicleLastActivity | string;
};

export type AdminVehiclesSummaryKey =
  | "ready"
  | "in_service"
  | "in_storage"
  | "overdue_service";

export type AdminVehiclesData = {
  dashboardSummary?: AdminVehicleDashboardSummary;
  bayMap?: AdminVehicleBayMap;
  operations?: AdminVehicleOperationRaw[];
  summary?: unknown;
  vehicles?: unknown[];
  total?: number;
  limit?: number;
  offset?: number;
};

export type AdminVehiclesResponse = ApiResponse<AdminVehiclesData>;

export type AdminVehicleHealthItem = {
  note?: string;
  category?: string;
  percentage?: number;
};

export type AdminVehicleDocumentFile = {
  url?: string;
  uploadedAt?: string;
};

export type AdminVehicleDocumentValue = string | AdminVehicleDocumentFile;

export type AdminVehicleDocuments = {
  specsAndInfo?: AdminVehicleDocumentValue;
  serviceRecord?: AdminVehicleDocumentValue;
  purchasedInvoice?: AdminVehicleDocumentValue;
  vehicleRegistration?: AdminVehicleDocumentValue;
  warrantyCertificate?: AdminVehicleDocumentValue;
  insuranceCertificate?: AdminVehicleDocumentValue;
};

export type AdminVehicleDetailMember = {
  id?: number | string;
  name?: string;
  profileImageUrl?: string;
};

export type AdminVehicleDetailRaw = {
  id?: number | string;
  displayName?: string;
  make?: string;
  model?: string;
  year?: number | string;
  imageUrl?: string;
  storageBay?: string;
  ownerName?: string;
  memberId?: number | string;
  mileage?: string;
  status?: string;
  statusKey?: string;
  statusLabel?: string;
  isOverdueService?: boolean;
  ownershipType?: string;
  isPriority?: boolean;
  bay?: string;
  member?: AdminVehicleDetailMember;
  lastActivity?: AdminVehicleLastActivity | string;
  plate?: string;
  colour?: string;
  chassisNo?: string;
  lastServicedAt?: string;
  fuelLevel?: string;
  health?: AdminVehicleHealthItem[];
  documents?: AdminVehicleDocuments;
};

export type AdminVehicleDetailResponse = ApiResponse<AdminVehicleDetailRaw>;

export type AdminDetailingPackage = {
  key?: string;
  name?: string;
  inclusions?: string[];
  priceAed?: number;
};

export type AdminDetailingAddon = {
  key?: string;
  name?: string;
  priceAed?: number;
};

export type AdminDetailingBookingRaw = {
  id?: number | string;
  referenceNumber?: string;
  status?: string;
  serviceType?: string;
  service?: string;
  vehicle?: string;
  vehicleId?: number | string;
  package?: AdminDetailingPackage;
  addons?: AdminDetailingAddon[];
  location?: string;
  serviceLocation?: string;
  locationKey?: string;
  scheduledDate?: string;
  preferredDate?: string;
  preferredDateLabel?: string;
  timeWindow?: string;
  timeWindowStart?: string;
  timeWindowEnd?: string;
  specialInstructions?: string;
  notes?: string;
  totalEstimate?: number;
  currency?: string;
  totalLabel?: string;
  createdAt?: string;
};

export type AdminDetailingBookingsData = {
  count?: number;
  bookings?: AdminDetailingBookingRaw[];
};

export type AdminDetailingBookingsResponse =
  ApiResponse<AdminDetailingBookingsData>;

export type StaffDetailingBookingsData = AdminDetailingBookingsData;

export type StaffDetailingBookingsResponse =
  ApiResponse<StaffDetailingBookingsData>;

export type AdminMaintenanceService = {
  key?: string;
  name?: string;
};

export type AdminMaintenanceRequestRaw = {
  id?: number | string;
  referenceNumber?: string;
  status?: string;
  vehicle?: string;
  vehicleId?: number | string;
  memberId?: number | string;
  services?: AdminMaintenanceService[];
  scheduledAt?: string;
  location?: string;
  locationKey?: string;
  notes?: string;
  documentUrls?: string[];
  totalAmount?: string | number;
  currency?: string;
  lineItems?: unknown[];
  canCancel?: boolean;
  requiresApproval?: boolean;
  isPaid?: boolean;
  createdAt?: string;
};

export type AdminMaintenanceRequestsData = {
  count?: number;
  requests?: AdminMaintenanceRequestRaw[];
};

export type AdminMaintenanceRequestsResponse =
  ApiResponse<AdminMaintenanceRequestsData>;

export type StaffMaintenanceRequestsData = AdminMaintenanceRequestsData;

export type StaffMaintenanceRequestsResponse =
  ApiResponse<StaffMaintenanceRequestsData>;

export type AdminTransportTimelineItem = {
  key?: string;
  label?: string;
  status?: string;
  completedAt?: string;
};

export type AdminTransportRequestDetail = {
  id?: number | string;
  referenceNumber?: string;
  status?: string;
  vehicle?: string;
  vehicleId?: number | string;
  memberId?: number | string;
  memberNumber?: string;
  serviceType?: string;
  serviceTypeLabel?: string;
  serviceTypeDescription?: string;
  pickupLocation?: string;
  dropoffLocation?: string;
  deliveryAddress?: string;
  destination?: string;
  preferredDate?: string;
  preferredDateLabel?: string;
  timeWindow?: string;
  timeWindowStart?: string;
  timeWindowEnd?: string;
  scheduledAt?: string;
  notes?: string;
  timeline?: AdminTransportTimelineItem[];
  canCancel?: boolean;
  createdAt?: string;
};

export type AdminTransportRequestRaw = {
  id?: number | string;
  source?: string;
  requestType?: string;
  requestTypeLabel?: string;
  referenceNumber?: string;
  status?: string;
  tab?: string;
  title?: string;
  vehicleId?: number | string;
  vehicle?: string;
  memberId?: number | string;
  memberNumber?: string;
  scheduledAt?: string;
  createdAt?: string;
  updatedAt?: string;
  detail?: AdminTransportRequestDetail;
};

export type AdminTransportRequestsData = {
  unified?: boolean;
  tab?: string;
  count?: number;
  total?: number;
  requests?: AdminTransportRequestRaw[];
};

export type AdminTransportRequestsResponse =
  ApiResponse<AdminTransportRequestsData>;

export type StaffTransportRequestsData = AdminTransportRequestsData;

export type StaffTransportRequestsResponse =
  ApiResponse<StaffTransportRequestsData>;

export type AdminOverviewJobsData = {
  pendingConfirm?: number;
  signOffQueue?: number;
  completedToday?: number;
  shiftProgress?: number;
};

export type AdminOverviewJobsResponse = ApiResponse<AdminOverviewJobsData>;

export type StaffOverviewJobsData = AdminOverviewJobsData;

export type StaffOverviewJobsResponse = ApiResponse<StaffOverviewJobsData>;

export type AssignVehicleRequest = {
  vehicleId: string;
  memberId: string;
  offerStartDate: string;
  offerEndDate: string;
  adminNotes?: string;
};

export type AssignVehicleResponse = ApiResponse<unknown>;

export type ChatConversation = {
  conversationId: string;
  memberId: string;
  memberName: string;
  status: string;
  initiatedBy: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadForMember: number;
  unreadForAdmin: number;
  createdAt: string;
};

export type ChatMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: string;
  senderName: string;
  body: string;
  createdAt: string;
};

export type ChatConversationsData = {
  conversations: ChatConversation[];
  total: number;
};

export type ChatMessagesData = {
  conversationId: string;
  conversation?: ChatConversation;
  messages: ChatMessage[];
};

export type ChatInitiateRequest = {
  memberId: string;
  initialMessage: string;
};

export type ChatSendMessageRequest = {
  body: string;
};

export type ChatConversationsResponse = ApiResponse<ChatConversationsData>;
export type ChatMessagesResponse = ApiResponse<ChatMessagesData>;
export type ChatSendMessageResponse = ApiResponse<{
  conversationId: string;
  message: ChatMessage;
  conversation: ChatConversation;
}>;
export type ChatInitiateResponse = ApiResponse<{
  created: boolean;
  conversation: ChatConversation;
}>;
export type ChatMarkReadResponse = ApiResponse<{
  memberId: string;
  markedRead: boolean;
}>;

export type CreateEventRequest = {
  title: string;
  category: "auctions" | "drives" | "social" | string;
  description: string;
  location: string;
  startsAt: string;
  endsAt: string;
  isAllDay: boolean;
  imageUrl: string;
  isFeatured: boolean;
  capacity: number;
  accessType: "open" | "invite-only" | string;
  status: "confirmed" | "draft" | "past" | string;
};

export type EventResponse = CreateEventRequest & {
  id: string | number;
  attendingCount?: number;
  waitlistCount?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type EventsListData = {
  events?: EventResponse[];
};

export type EventsListResponse = ApiResponse<EventsListData>;

export type EventStatsData = {
  upcoming?: number;
  confirmed?: number;
  drafts?: number;
  past?: number;
  attendanceRate?: number;
  upcomingTrend?: string;
  confirmedTrend?: string;
  attendanceTrend?: string;
  [key: string]: unknown;
};

export type EventStatsResponse = ApiResponse<EventStatsData>;

// Shape of a single RSVP entry returned inside rsvpList by GET /api/v1/events/:id
export type EventRsvpRaw = {
  rsvpId?: string | number;
  status?: string; // "confirmed" | "waitlist"
  isFavorite?: boolean;
  joinedAt?: string;
  member?: {
    id?: string | number;
    name?: string;
    initial?: string;
    profileImageUrl?: string;
  };
  vehicle?: {
    id?: string | number;
    name?: string;
  };
};

// Full detail response returned by GET /api/v1/events/:id
export type EventDetailData = EventResponse & {
  spotsRemaining?: number;
  isJoined?: boolean;
  myRsvp?: unknown;
  rsvpList?: EventRsvpRaw[];
};

export type EventDetailResponse = ApiResponse<EventDetailData>;
