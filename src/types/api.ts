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

export type AuthProfilePanel = "member" | "staff" | "admin";

export type AuthProfileHeaderStatRaw = {
  key?: string;
  label?: string;
  value?: string | number;
  count?: string | number;
  subtext?: string;
  sub?: string;
};

export type AuthProfileFieldRaw = {
  key?: string;
  label?: string;
  value?: string | number | boolean | null;
};

export type AuthProfileSectionRaw = {
  key?: string;
  title?: string;
  label?: string;
  fields?: AuthProfileFieldRaw[];
  items?: AuthProfileFieldRaw[];
};

export type AuthProfileData = {
  role?: string;
  panel?: AuthProfilePanel | string;
  name?: string;
  fullName?: string;
  displayName?: string;
  jobTitle?: string;
  membershipTier?: string;
  tier?: string;
  email?: string;
  avatarUrl?: string;
  profileImageUrl?: string;
  headerStats?: AuthProfileHeaderStatRaw[];
  sections?:
    | Record<string, AuthProfileSectionRaw>
    | AuthProfileSectionRaw[];
};

export type AuthProfileResponse = ApiResponse<AuthProfileData>;

export type ApiFieldError = {
  field?: string;
  message?: string;
};

export type ApiError = {
  status: number;
  message: string;
  errors?: ApiFieldError[];
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

export type MemberVehicleItemRaw = {
  id?: number | string;
  name?: string;
  displayName?: string;
  plate?: string;
  status?: string;
  statusLabel?: string;
};

export type MemberRecentActivityItemRaw = {
  id?: string;
  type?: string;
  title?: string;
  subtitle?: string;
  occurredAt?: string;
  timeLabel?: string;
  tone?: string;
};

export type MemberUpcomingEventRaw = {
  id?: string | number;
  title?: string;
  location?: string;
  startsAt?: string;
  dateLabel?: string;
  monthLabel?: string;
  dayLabel?: string;
  status?: string;
  statusLabel?: string;
  isFavorite?: boolean;
};

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
  vehiclesSection?: {
    total?: number;
    items?: MemberVehicleItemRaw[];
  };
  recentActivity?: MemberRecentActivityItemRaw[];
  upcomingEvents?: MemberUpcomingEventRaw[];
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

export type AdminBookingRaw = {
  id?: number | string;
  sourcingRequestId?: number | string;
  referenceNumber?: string;
  confirmationStatus?: string;
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
  confirmedAt?: string;
};

export type AdminInReviewBookingRaw = AdminBookingRaw;

export type AdminStaffOnDuty = {
  id?: number | string;
  name?: string;
  role?: string;
  status?: string;
  profileImageUrl?: string;
};

export type AdminSourcingRequestsData = {
  summary?: SourcingSummary;
  pendingBookings?: AdminBookingRaw[];
  inReviewBookings?: AdminBookingRaw[];
  confirmedBookings?: AdminBookingRaw[];
  completedTodayBookings?: AdminBookingRaw[];
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

export type AdminVehicleDetailsOwnerRaw = {
  id?: string;
  name?: string;
  initial?: string;
  memberNumber?: string;
  membershipTier?: string;
  tierLabel?: string;
  memberSince?: string;
  infoLabel?: string;
  totalVehiclesRegistered?: number;
};

export type AdminVehicleDetailsKeyAssignmentRaw = {
  bay?: string;
  bayCode?: string;
  levelCode?: string;
  storedStatus?: string;
  inspectionStatus?: string;
  storedSince?: string;
  daysStored?: number;
  daysStoredLabel?: string;
  lastInspectedBy?: string;
};

export type AdminVehicleDetailsActivityRaw = {
  id?: string;
  title?: string;
  dotColor?: string;
  occurredAt?: string;
  description?: string;
  /** Legacy / alternate field names */
  label?: string;
  value?: string;
  meta?: string;
  detail?: string;
  time?: string;
  tone?: string;
};

export type AdminVehicleDetailsScreenRaw = {
  id?: string;
  make?: string;
  model?: string;
  displayName?: string;
  subtitle?: string;
  year?: number;
  colour?: string;
  engine?: string;
  mileage?: string;
  plate?: string;
  vin?: string;
  status?: string;
  statusKey?: string;
  statusLabel?: string;
  imageUrl?: string;
  owner?: AdminVehicleDetailsOwnerRaw;
  keyAssignment?: AdminVehicleDetailsKeyAssignmentRaw;
  activityHistory?: AdminVehicleDetailsActivityRaw[];
};

export type AdminVehicleDetailsScreenResponse =
  ApiResponse<AdminVehicleDetailsScreenRaw>;

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

export type StaffOverviewStaffRaw = {
  id?: number;
  name?: string;
  role?: string;
  jobTitle?: string;
  status?: string;
};

export type StaffOverviewShiftRaw = {
  label?: string;
  displayDate?: string;
  startTime?: string;
  endTime?: string;
  timeRemainingLabel?: string;
};

export type StaffOverviewKpiRaw = {
  label?: string;
  value?: string | number;
  subtext?: string;
  subtitle?: string;
  trend?: string;
  icon?: string;
};

export type StaffOverviewQuickActionRaw = {
  id?: string;
  title?: string;
  label?: string;
  subtitle?: string;
  subtext?: string;
  count?: number;
  href?: string;
  icon?: string;
};

export type StaffOverviewTaskRaw = {
  id?: string;
  index?: number | string;
  title?: string;
  detail?: string;
  description?: string;
  time?: string;
  scheduledAt?: string;
  status?: { label?: string; tone?: string } | string;
  icon?: string;
  iconTone?: string;
};

export type StaffOverviewScheduleEventRaw = {
  id?: string;
  time?: string;
  title?: string;
  detail?: string;
  description?: string;
};

export type StaffOverviewAlertRaw = {
  id?: string;
  message?: string;
  title?: string;
  time?: string;
  timeAgo?: string;
  icon?: string;
};

export type StaffOverviewStaffOnDutyRaw = {
  id?: number | string;
  name?: string;
  role?: string;
  jobTitle?: string;
  initial?: string;
  status?: string;
  isCurrentUser?: boolean;
  highlight?: boolean;
  avatarTone?: string;
};

export type StaffOverviewShiftStatRaw = {
  label?: string;
  value?: string | number;
};

export type StaffOverviewAssignmentRaw = {
  bay?: string;
  location?: string;
  workshop?: string;
  vehicle?: string;
  shiftStatus?: string;
  status?: string;
};

export type StaffOverviewListSectionRaw<T> = {
  items?: T[];
  urgentCount?: number;
  criticalCount?: number;
  count?: number;
  label?: string;
};

export type StaffOverviewData = {
  staff?: StaffOverviewStaffRaw;
  shift?: StaffOverviewShiftRaw;
  kpis?: StaffOverviewKpiRaw[] | Record<string, StaffOverviewKpiRaw>;
  quickActions?: StaffOverviewQuickActionRaw[];
  priorityTasks?:
    | StaffOverviewTaskRaw[]
    | StaffOverviewListSectionRaw<StaffOverviewTaskRaw>;
  schedule?:
    | StaffOverviewScheduleEventRaw[]
    | StaffOverviewListSectionRaw<StaffOverviewScheduleEventRaw>;
  systemAlerts?:
    | StaffOverviewAlertRaw[]
    | StaffOverviewListSectionRaw<StaffOverviewAlertRaw>;
  staffOnDuty?: StaffOverviewStaffOnDutyRaw[];
  shiftStats?:
    | StaffOverviewShiftStatRaw[]
    | StaffOverviewListSectionRaw<StaffOverviewShiftStatRaw>;
  yourAssignment?: StaffOverviewAssignmentRaw;
};

export type StaffOverviewResponse = ApiResponse<StaffOverviewData>;

export type StaffJobQueueStatus =
  | "pending"
  | "assigned"
  | "scheduled"
  | "in_progress"
  | "completed";

export type StaffJobSubtaskRaw = {
  key?: string;
  label?: string;
  done?: boolean;
  completed?: boolean;
  completedAt?: string;
};

export type StaffJobProgressRaw = {
  percent?: number;
  elapsedMinutes?: number;
  estimatedMinutes?: number;
  remainingMinutes?: number;
  subtasksTotal?: number;
  subtasksCompleted?: number;
  isComplete?: boolean;
  label?: string;
  note?: string;
};

export type StaffJobStatusBadgeRaw = {
  label?: string;
  tone?: string;
};

export type StaffJobScheduleRaw = {
  startTime?: string;
  endTime?: string;
};

export type StaffJobLocationRaw = {
  label?: string;
  detail?: string;
  address?: string;
};

export type StaffJobAuthorRaw = {
  id?: string;
  name?: string;
  role?: string;
};

export type StaffJobNoteRaw = {
  id?: string | number;
  referenceId?: string;
  note?: string;
  body?: string;
  text?: string;
  imageUrls?: string[];
  createdAt?: string;
  author?: StaffJobAuthorRaw | string;
  authorName?: string;
};

export type StaffJobTimelineItemRaw = {
  key?: string;
  label?: string;
  status?: string;
  completedAt?: string;
};

export type StaffActiveJobDetailRaw = {
  vehicle?: string;
  member?: string;
  memberName?: string;
  specialInstructions?: string;
  subtitle?: string;
  pickup?: StaffJobLocationRaw;
  dropoff?: StaffJobLocationRaw;
  from?: string;
  to?: string;
  serviceType?: string;
  centre?: string;
  workshop?: string;
};

export type StaffActiveJobRaw = {
  id?: string;
  referenceId?: string;
  referenceNumber?: string;
  referenceType?: string;
  status?: string;
  statusBadge?: StaffJobStatusBadgeRaw;
  staffProfileId?: string;
  category?: string;
  requestType?: string;
  requestTypeLabel?: string;
  title?: string;
  vehicle?: string;
  member?: string;
  memberName?: string;
  assignee?: string;
  assigneeName?: string;
  subtitle?: string;
  specialInstructions?: string;
  notesText?: string;
  pickup?: StaffJobLocationRaw;
  dropoff?: StaffJobLocationRaw;
  from?: StaffJobLocationRaw | string;
  to?: StaffJobLocationRaw | string;
  schedule?: StaffJobScheduleRaw;
  subtasks?: StaffJobSubtaskRaw[];
  progress?: StaffJobProgressRaw;
  timeline?: StaffJobTimelineItemRaw[];
  notes?: StaffJobNoteRaw[];
  detail?: StaffActiveJobDetailRaw;
  scheduledStart?: string;
  scheduledEnd?: string;
  startTime?: string;
  endTime?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt?: string;
  estimatedMinutes?: number;
  slotDurationHours?: number;
  serviceType?: string;
  centre?: string;
  workshop?: string;
};

export type StaffActiveJobData = {
  job?: StaffActiveJobRaw | null;
};

export type StaffActiveJobResponse = ApiResponse<StaffActiveJobData>;

export type StaffJobProgressData = {
  jobId?: string;
  referenceId?: string;
  status?: string;
  progress?: StaffJobProgressRaw;
};

export type StaffJobProgressResponse = ApiResponse<StaffJobProgressData>;

export type StaffJobNotesData = {
  referenceId?: string;
  count?: number;
  notes?: StaffJobNoteRaw[];
};

export type StaffJobNotesResponse = ApiResponse<StaffJobNotesData>;

export type StaffJobCompleteData = {
  completed?: StaffActiveJobRaw;
  nextJob?: StaffActiveJobRaw | null;
  staffStatus?: string;
};

export type StaffJobCompleteResponse = ApiResponse<StaffJobCompleteData>;

export type StaffJobMutationResponse = ApiResponse<StaffActiveJobRaw>;

export type StaffJobActiveNoteData = {
  jobId?: string;
  referenceId?: string;
  note?: StaffJobNoteRaw;
};

export type StaffJobActiveNoteResponse = ApiResponse<StaffJobActiveNoteData>;

export type StaffJobListPageRaw = {
  count?: number;
  limit?: number;
  offset?: number;
  jobs?: StaffActiveJobRaw[];
};

export type StaffJobQueueData = {
  staffProfileId?: string;
  mine?: StaffJobListPageRaw;
  available?: StaffJobListPageRaw;
};

export type StaffJobQueueResponse = ApiResponse<StaffJobQueueData>;

export type StaffJobCompletedData = {
  staffProfileId?: string;
  count?: number;
  limit?: number;
  offset?: number;
  jobs?: StaffActiveJobRaw[];
};

export type StaffJobCompletedResponse = ApiResponse<StaffJobCompletedData>;

export type StaffJobScheduleRequest = {
  startTime: string;
  endTime: string;
};

export type StaffJobStartRequest = {
  estimatedMinutes: number;
  subtasks: Array<{ key?: string; label: string }>;
};

export type StaffJobActiveNoteRequest = {
  note: string;
};

export type StaffInspectionStatRaw = {
  value?: string | number;
  subtitle?: string;
  subtext?: string;
  label?: string;
  count?: string | number;
  total?: string | number;
  displayValue?: string;
};

export type StaffInspectionDashboardSummaryRaw = {
  dueToday?: StaffInspectionStatRaw;
  inProgress?: StaffInspectionStatRaw;
  completedThisShift?: StaffInspectionStatRaw;
  completed?: StaffInspectionStatRaw;
  flaggedIssues?: StaffInspectionStatRaw;
  flagged?: StaffInspectionStatRaw;
};

export type StaffInspectionVehicleRaw = {
  id?: string | number;
  name?: string;
  label?: string;
  make?: string;
  model?: string;
  displayName?: string;
};

export type StaffInspectionStaffRaw = {
  id?: string | number;
  name?: string;
  label?: string;
};

export type StaffInspectionQueueItemRaw = {
  id?: string | number;
  referenceNumber?: string;
  statusKey?: string;
  status?: string;
  vehicle?: StaffInspectionVehicleRaw | string;
  assignedStaff?: StaffInspectionStaffRaw | string;
  assignee?: string;
  assigneeName?: string;
  serviceType?: string;
  inspectionType?: string;
  bay?: string;
  scheduledAt?: string;
  time?: string;
};

export type StaffInspectionListData = {
  dashboardSummary?: StaffInspectionDashboardSummaryRaw;
  inspections?: StaffInspectionQueueItemRaw[] | unknown;
  items?: StaffInspectionQueueItemRaw[] | unknown;
  queue?: StaffInspectionQueueItemRaw[] | unknown;
  total?: number;
};

export type StaffInspectionListResponse = ApiResponse<StaffInspectionListData>;

export type StaffInspectionSummaryResponse =
  ApiResponse<StaffInspectionDashboardSummaryRaw>;

export type StaffInspectionChecklistItemRaw = {
  key?: string;
  id?: string | number;
  label?: string;
  status?: string;
  state?: string;
  step?: string;
  stepKey?: string;
};

export type StaffInspectionStepRaw = {
  key?: string;
  id?: string;
  label?: string;
  status?: string;
  state?: string;
};

export type StaffInspectionFlaggedIssueRaw = {
  key?: string;
  itemKey?: string;
  tag?: string;
  label?: string;
  title?: string;
  notes?: string;
  note?: string;
  description?: string;
  photoUrls?: string[];
  imageUrls?: string[];
  photos?: StaffInspectionPhotoRaw[] | unknown;
};

export type StaffInspectionDetailRaw = {
  id?: string | number;
  referenceNumber?: string;
  reference?: string;
  vehicle?: StaffInspectionVehicleRaw | string;
  bay?: string;
  mileage?: string | number;
  odometerReading?: string | number;
  inspectionType?: string;
  type?: string;
  currentStep?: string;
  activeStep?: string;
  currentStepKey?: string;
  activeStepKey?: string;
  steps?: StaffInspectionStepRaw[] | unknown;
  inspectionSteps?: StaffInspectionStepRaw[] | unknown;
  progress?: { steps?: StaffInspectionStepRaw[] | unknown } | unknown;
  checklist?: StaffInspectionChecklistItemRaw[] | unknown;
  checklistItems?: StaffInspectionChecklistItemRaw[] | unknown;
  flaggedIssues?: StaffInspectionFlaggedIssueRaw[] | unknown;
  flaggedIssue?: StaffInspectionFlaggedIssueRaw;
  issues?: StaffInspectionFlaggedIssueRaw[] | unknown;
  statusKey?: string;
  status?: string;
  inspectionStatus?: string;
  fuelLevel?: string;
  notes?: string;
  photos?: StaffInspectionPhotoRaw[] | unknown;
  photoEvidence?: StaffInspectionPhotoRaw[] | unknown;
  evidencePhotos?: StaffInspectionPhotoRaw[] | unknown;
  evidence?: StaffInspectionPhotoRaw[] | unknown;
  images?: StaffInspectionPhotoRaw[] | unknown;
  imageUrls?: string[];
};

export type StaffInspectionPhotoRaw = {
  id?: string | number;
  url?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  src?: string;
  itemKey?: string;
  caption?: string;
  label?: string;
  photoUrl?: string;
  fileUrl?: string;
  path?: string;
  createdAt?: string;
  uploadedAt?: string;
  imageUrls?: string[];
};

export type StaffInspectionDetailResponse = ApiResponse<
  StaffInspectionDetailRaw | Record<string, unknown>
>;

export type StaffInspectionMutationResponse = ApiResponse<
  StaffInspectionDetailRaw | Record<string, unknown>
>;

export type StaffInspectionCreateResponse = ApiResponse<
  StaffInspectionDetailRaw | Record<string, unknown>
>;

export type StaffHealthReportTabRaw = {
  key?: string;
  label?: string;
};

export type StaffHealthReportCountsRaw = {
  all?: number;
  critical?: number;
  due_service?: number;
  healthy?: number;
  [key: string]: number | undefined;
};

export type StaffHealthReportFleetSummaryRaw = {
  label?: string;
  totalVehicles?: number;
  overviewLabel?: string;
  tabs?: StaffHealthReportTabRaw[];
  counts?: StaffHealthReportCountsRaw;
};

export type StaffHealthReportVehicleRaw = {
  id?: string;
  displayName?: string;
  make?: string;
  model?: string;
  year?: number;
  colour?: string;
  imageUrl?: string;
  healthPercent?: number;
  healthReportRef?: string;
  healthReportLabel?: string;
  statusLabel?: string;
  filterKey?: string;
  bay?: string;
  memberName?: string;
  memberId?: string;
  memberNumber?: string;
  memberCode?: string;
  mileage?: string;
  mileageRaw?: string;
  locationLine?: string;
  lastServiceDisplay?: string;
  lastServicedAt?: string;
  isOverdueService?: boolean;
  overdueDays?: string | number;
  overdueLabel?: string;
  serviceDueDisplay?: string;
  subtitle?: string;
  storageLocation?: string;
  overallConditionLabel?: string;
  criticalHealthCount?: number;
};

export type StaffHealthReportVehiclesData = {
  fleetHealthSummary?: StaffHealthReportFleetSummaryRaw;
  filterKey?: string;
  tabs?: StaffHealthReportTabRaw[];
  counts?: StaffHealthReportCountsRaw;
  vehicles?: StaffHealthReportVehicleRaw[];
  total?: number;
  limit?: number;
  offset?: number;
};

export type StaffHealthReportSystemItemRaw = {
  key?: string;
  label?: string;
  percentage?: number;
  note?: string;
};

export type StaffHealthReportIssueRaw = {
  id?: string;
  type?: string;
  severity?: string;
  title?: string;
  detail?: string;
  category?: string;
  urgency?: string;
  percentage?: number;
  actionLabel?: string;
};

export type StaffHealthReportServiceHistoryItemRaw = {
  id?: string;
  date?: string;
  title?: string;
  location?: string;
  detail?: string;
};

export type StaffHealthReportDetailRaw = StaffHealthReportVehicleRaw & {
  overallCondition?: {
    label?: string;
    healthPercent?: number;
    statusLabel?: string;
    isCritical?: boolean;
    isServiceOverdue?: boolean;
    overdueLabel?: string;
  };
  serviceDue?: {
    memberName?: string;
    serviceDueDisplay?: string;
    overdueDays?: string | number;
    label?: string;
  };
  systemBreakdown?: {
    label?: string;
    criticalCount?: number;
    items?: StaffHealthReportSystemItemRaw[];
  };
  flaggedIssues?: {
    label?: string;
    items?: StaffHealthReportIssueRaw[];
  };
  serviceHistory?: {
    label?: string;
    viewAllLabel?: string;
    items?: StaffHealthReportServiceHistoryItemRaw[];
  };
  currentShift?: {
    key?: string;
    label?: string;
    displayDate?: string;
    startTime?: string;
    endTime?: string;
    timeRemainingMinutes?: number;
    timeRemainingLabel?: string;
  };
};

export type StaffHealthReportVehiclesResponse =
  ApiResponse<StaffHealthReportVehiclesData>;

export type StaffHealthReportDetailResponse =
  ApiResponse<StaffHealthReportDetailRaw>;

export type StaffInspectionType =
  | "pre_service"
  | "storage_check_in"
  | "general";

export type StaffInspectionCreateRequest = {
  vehicleId: string;
  memberId: string;
  inspectionType: StaffInspectionType;
  scheduledAt: string;
  bay: string;
  assignedStaffId: string;
  odometerReading?: string;
  fuelLevel?: string;
};

export type StaffInspectionPhotoUploadPayload = {
  photo: File;
  itemKey?: string;
};

export type StaffInspectionDraftRequest = {
  currentStep?: string;
  checklist?: Array<{ key: string; status: string }>;
  odometerReading?: string;
  fuelLevel?: string;
  notes?: string;
};

export type StaffPhotoUploadTabRaw = {
  key?: string;
  label?: string;
  active?: boolean;
};

export type StaffPhotoUploadHeaderRaw = {
  dateLabel?: string;
  shiftLabel?: string;
  title?: string;
};

export type StaffPhotoUploadActiveJobRaw = {
  reference?: string;
  linkedJobReference?: string;
  vehicle?: string;
  vehicleName?: string;
  bay?: string;
  imageCode?: string;
  fileName?: string;
  caption?: string;
};

export type StaffPhotoUploadTodaySummaryRaw = {
  totalPhotos?: number;
  pendingUpload?: number;
  pendingUploadCount?: number;
  pendingSizeMb?: number | string;
  pendingTotalSize?: string;
};

export type StaffPhotoCaptureRaw = {
  id?: string | number;
  sectionLabel?: string;
  label?: string;
  capturedAt?: string;
  time?: string;
  status?: string;
  statusKey?: string;
  isIssueFlagged?: boolean;
  thumbnailUrl?: string;
  imageUrl?: string;
  caption?: string;
};

export type StaffPhotoCaptureDetailRaw = StaffPhotoCaptureRaw & {
  photoIndex?: string | number;
  index?: string | number;
  fileSize?: string | number;
  fileType?: string;
  mimeType?: string;
  linkedJobReference?: string;
  categoryTags?: string[];
  caption?: string;
  notes?: string;
};

export type StaffPhotoUploadListItemRaw = {
  id?: string | number;
  title?: string;
  sectionLabel?: string;
  vehicle?: string;
  vehicleName?: string;
  linkedJobReference?: string;
  capturedAt?: string;
  time?: string;
  fileSize?: string | number;
  status?: string;
  statusKey?: string;
  isIssueFlagged?: boolean;
};

export type StaffPhotoUploadSummaryData = {
  header?: StaffPhotoUploadHeaderRaw;
  tabs?: StaffPhotoUploadTabRaw[] | unknown;
  activeJob?: StaffPhotoUploadActiveJobRaw;
  todayCaptures?: StaffPhotoCaptureRaw[] | unknown;
  todaySummary?: StaffPhotoUploadTodaySummaryRaw;
  selectedPhoto?: StaffPhotoCaptureDetailRaw;
  recentUploads?: StaffPhotoUploadListItemRaw[] | unknown;
  uploads?: StaffPhotoUploadListItemRaw[] | unknown;
  sidebar?: {
    selectedPhoto?: StaffPhotoCaptureDetailRaw;
    photo?: StaffPhotoCaptureDetailRaw;
    recentUploads?: StaffPhotoUploadListItemRaw[] | unknown;
    uploads?: StaffPhotoUploadListItemRaw[] | unknown;
  };
};

export type StaffPhotoUploadListData = {
  uploads?: StaffPhotoUploadListItemRaw[];
  recentUploads?: StaffPhotoUploadListItemRaw[];
  items?: StaffPhotoUploadListItemRaw[];
  total?: number;
  limit?: number;
  offset?: number;
};

export type StaffPhotoUploadTodayData = {
  captures?: StaffPhotoCaptureRaw[];
  todayCaptures?: StaffPhotoCaptureRaw[];
  summary?: StaffPhotoUploadTodaySummaryRaw;
};

export type StaffPhotoUploadSummaryResponse =
  ApiResponse<StaffPhotoUploadSummaryData>;
export type StaffPhotoUploadListResponse =
  ApiResponse<StaffPhotoUploadListData>;
export type StaffPhotoUploadTodayResponse =
  ApiResponse<StaffPhotoUploadTodayData>;
export type StaffPhotoUploadDetailResponse =
  ApiResponse<StaffPhotoCaptureDetailRaw>;
export type StaffPhotoUploadMutationResponse =
  ApiResponse<StaffPhotoCaptureDetailRaw>;

export type StaffPhotoUploadCreateRequest = {
  sectionLabel: string;
  categoryTags: string[];
  caption?: string;
  linkedJobReference?: string;
};

export type StaffPhotoUploadUpdateRequest = {
  sectionLabel?: string;
  categoryTags?: string[];
  caption?: string;
  linkedJobReference?: string;
  isIssueFlagged?: boolean;
};

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

export type MemberChatInitiateRequest = {
  initialMessage?: string;
};

export type MemberChatConversationResponse = ApiResponse<ChatConversation>;
export type MemberChatMessagesResponse = ApiResponse<ChatMessagesData>;

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
  status: "published" | "confirmed" | "draft" | "past" | string;
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
  published?: number;
  drafts?: number;
  past?: number;
  attendanceRate?: number | string;
  avgAttendanceRate?: number | string;
  attendanceVsAvg?: number | string;
  upcomingTrend?: string;
  publishedTrend?: string;
  attendanceTrend?: string;
  [key: string]: unknown;
};

export type EventStatsResponse = ApiResponse<EventStatsData>;

export type CommunicationsStatsData = {
  sentBulletins?: number;
  totalDeliveries?: number;
  openRatePercent?: number | string;
  clickRatePercent?: number | string;
  draftCount?: number;
};

export type CommunicationsStatsResponse = ApiResponse<CommunicationsStatsData>;

export type CommunicationsBulletinRaw = {
  id?: string;
  title?: string;
  body?: string;
  type?: string;
  status?: string;
  category?: string;
  imageUrl?: string;
  authorName?: string;
  isPinned?: boolean;
  audienceSegments?: string[];
  channels?: string[];
  scheduledAt?: string;
  sentAt?: string;
  sentCount?: number;
  createdBy?: string;
  openRatePercent?: number | string;
  clickRatePercent?: number | string;
  createdAt?: string;
  updatedAt?: string;
};

export type CommunicationsBulletinsData = {
  items?: CommunicationsBulletinRaw[];
  total?: number;
  limit?: number;
  offset?: number;
};

export type CommunicationsBulletinsResponse =
  ApiResponse<CommunicationsBulletinsData>;

export type CommunicationsAudiencePreviewData = {
  ALL_MEMBERS?: number;
  VIP?: number;
  CONCOURS_ELIGIBLE?: number;
  NEW?: number;
};

export type CommunicationsAudiencePreviewResponse =
  ApiResponse<CommunicationsAudiencePreviewData>;

export type BulletinContentType = "bulletin" | "alert";
export type BulletinStatus = "draft" | "sent";
export type BulletinChannel = "app" | "email" | "push";
export type BulletinAudienceSegment =
  | "ALL_MEMBERS"
  | "VIP"
  | "CONCOURS_ELIGIBLE"
  | "NEW";

export type CreateBulletinRequest = {
  title: string;
  body: string;
  type: BulletinContentType;
  status: BulletinStatus;
  category?: string;
  imageUrl?: string;
  authorName?: string;
  isPinned?: boolean;
  audienceSegments: BulletinAudienceSegment[];
  channels: BulletinChannel[];
  scheduledAt?: string;
};

export type CreateBulletinResponse = ApiResponse<CommunicationsBulletinRaw>;

// Shape of a single RSVP entry returned by GET /api/v1/admin/events/:id
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
  vehicle?:
    | string
    | {
        id?: string | number;
        name?: string;
      };
};

// Full detail response returned by GET /api/v1/admin/events/:id
export type EventDetailData = EventResponse & {
  spotsRemaining?: number;
  isJoined?: boolean;
  myRsvp?: unknown;
  attendanceRate?: number;
  rsvpList?: EventRsvpRaw[];
  waitlistList?: EventRsvpRaw[];
  notes?: string;
};

export type EventDetailResponse = ApiResponse<EventDetailData>;

export type UpdateEventNotesRequest = {
  notes: string;
};

export type UpdateEventNotesResponse = ApiResponse<{ notes?: string }>;

export type WorkshopDashboardStatsData = {
  activeJobs: number;
  overdue: number;
  awaitingParts: number;
  avgTurnaroundDays: string | number;
  avg300: string | number;
  avgDelta: string | number;
  engineersOn: number;
  engineers: string[];
};

export type WorkshopDashboardStatsResponse =
  ApiResponse<WorkshopDashboardStatsData>;

export type WorkshopBayRaw = {
  id: string;
  source: string;
  bayNumber: string;
  vehicleName: string;
  memberName: string;
  serviceDescription: string;
  technicianName: string;
  status: string;
  statusBadge: string;
  dueAt: string;
  referenceNumber: string;
};

export type WorkshopDashboardBaysData = {
  bays: WorkshopBayRaw[];
  count: number;
};

export type WorkshopDashboardBaysResponse =
  ApiResponse<WorkshopDashboardBaysData>;

export type WorkshopQueueItemRaw = {
  id: string;
  source: string;
  scheduledAt: string;
  memberName: string;
  memberNumber: string;
  memberAvatarUrl: string;
  vehicleName: string;
  serviceType: string;
  engineer: string;
  est: number;
  category: string;
  status: string;
  referenceNumber: string;
};

export type WorkshopDashboardQueueData = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  items: WorkshopQueueItemRaw[];
};

export type WorkshopDashboardQueueResponse =
  ApiResponse<WorkshopDashboardQueueData>;

// ─── Admin Profile ───────────────────────────────────────────────────────────

export type AdminProfileOverviewStatRaw = {
  key?: string;
  label?: string;
  value?: number;
  subLabel?: string;
  unit?: string;
  received?: number;
  completed?: number;
};

export type AdminProfileOverviewData = {
  actionsToday?: AdminProfileOverviewStatRaw;
  membersManaged?: AdminProfileOverviewStatRaw;
  openTasks?: AdminProfileOverviewStatRaw;
  uptimeThisMonth?: AdminProfileOverviewStatRaw;
};

export type AdminProfileOverviewResponse = ApiResponse<AdminProfileOverviewData>;

export type AdminProfileData = {
  id?: string;
  staffId?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  mobileCountryCode?: string;
  location?: string;
  residence?: string;
  jobTitle?: string;
  role?: string;
  joined?: string;
  joinedLabel?: string;
  profileImageUrl?: string;
};

export type AdminProfileResponse = ApiResponse<AdminProfileData>;

export type AdminProfileUpdateRequest = {
  mobile?: string;
};

export type AdminProfileActivityItemRaw = {
  id?: string;
  type?: string;
  title?: string;
  description?: string;
  body?: string;
  tone?: string;
  createdAt?: string;
  timeLabel?: string;
};

export type AdminProfileActivityData = {
  items?: AdminProfileActivityItemRaw[];
  total?: number;
  limit?: number;
  offset?: number;
};

export type AdminProfileActivityResponse = ApiResponse<AdminProfileActivityData>;

export type AdminSessionRaw = {
  id?: string;
  userType?: string;
  userName?: string;
  deviceLabel?: string;
  browser?: string;
  platform?: string;
  location?: string;
  ipAddress?: string;
  isCurrent?: boolean;
  lastActiveAt?: string;
  timeLabel?: string;
  status?: string;
};

export type AdminSessionsData = {
  sessions?: AdminSessionRaw[];
};

export type AdminSessionsResponse = ApiResponse<AdminSessionsData>;

// ─── Admin Overview (full page) ───────────────────────────────────────────────

export type AdminOverviewGreeting = {
  text: string;
  firstName: string;
  timestamp: string;
};

export type AdminOverviewAlertItem = {
  id: string;
  severity: string;
  message: string;
  detail: string;
  sourceType: string;
  sourceId: string;
};

export type AdminOverviewTicker = {
  criticalCount: number;
  alerts: AdminOverviewAlertItem[];
};

export type AdminOverviewActiveMembers = {
  value: number;
  newToday: number;
  label: string;
};

export type AdminOverviewInStorage = {
  value: number;
  newThisWeek: number;
  label: string;
};

export type AdminOverviewOpenRequests = {
  value: number;
  urgent: number;
  label: string;
};

export type AdminOverviewTodayRevenue = {
  valueAed: number;
  displayValue: string;
  avgAed: number;
  transactionCount: number;
  changeVsLastWeekPercent: number;
  label: string;
};

export type AdminOverviewKpis = {
  activeMembers: AdminOverviewActiveMembers;
  inStorage: AdminOverviewInStorage;
  openRequests: AdminOverviewOpenRequests;
  todayRevenue: AdminOverviewTodayRevenue;
};

export type AdminOverviewPriorityItem = {
  id: string;
  type: string;
  tag: string;
  time: string;
  title: string;
  detail: string;
  memberId?: string;
  memberName?: string;
  attendeeCount?: number;
  capacity?: number;
  sourceType?: string;
  sourceId?: string;
  priority: string;
};

export type AdminOverviewTodayPriorities = {
  count: number;
  label: string;
  subtitle: string;
  items: AdminOverviewPriorityItem[];
};

export type AdminOverviewCriticalAlertItem = {
  id: string;
  severity: string;
  type: string;
  title: string;
  detail: string;
  vehicleId: string;
  bay: string;
};

export type AdminOverviewCriticalAlerts = {
  criticalCount: number;
  totalCount: number;
  items: AdminOverviewCriticalAlertItem[];
};

export type AdminOverviewConciergeQueueItem = {
  id: string;
  conversationId?: string;
  itemKind?: string;
  memberId?: string;
  memberName: string;
  memberNumber: string;
  memberAvatarUrl?: string;
  requestType: string;
  title: string;
  lastMessage?: string;
  lastMessageAt?: string;
  status?: string;
  urgency: string;
  unreadCount?: number;
  waitingMinutes: number;
  vehicleLabel: string;
};

export type AdminOverviewConciergeQueue = {
  openCount: number;
  urgentCount: number;
  unreadCount: number;
  items: AdminOverviewConciergeQueueItem[];
};

export type AdminOverviewRecentActivityItem = {
  id: string;
  time: string;
  actor: string;
  action: string;
  subject: string;
  sourceType: string;
};

export type AdminOverviewRecentActivity = {
  windowMinutes: number;
  count: number;
  items: AdminOverviewRecentActivityItem[];
};

export type AdminOverviewStaffMember = {
  id: string;
  name: string;
  jobTitle: string;
  status: string;
  profileImageUrl: string;
};

export type AdminOverviewStaffOnShift = {
  activeCount: number;
  members: AdminOverviewStaffMember[];
};

export type AdminOverviewScheduleItem = {
  time: string;
  title: string;
  subtitle: string;
  tag: string;
  vehicleLabel: string;
};

export type AdminOverviewTodaySchedule = {
  date: string;
  count: number;
  items: AdminOverviewScheduleItem[];
};

export type AdminOverviewJobStats = {
  pendingConfirm: number;
  signOffQueue: number;
  completedToday: number;
  shiftProgress: number;
};

export type AdminOverviewData = {
  greeting: AdminOverviewGreeting;
  ticker: AdminOverviewTicker;
  kpis: AdminOverviewKpis;
  todayPriorities: AdminOverviewTodayPriorities;
  criticalAlerts: AdminOverviewCriticalAlerts;
  conciergeQueue: AdminOverviewConciergeQueue;
  recentActivity: AdminOverviewRecentActivity;
  staffOnShift: AdminOverviewStaffOnShift;
  todaySchedule: AdminOverviewTodaySchedule;
  jobStats: AdminOverviewJobStats;
};

export type AdminOverviewResponse = ApiResponse<AdminOverviewData>;

export type StaffOperationalUpdateTagRaw = {
  label?: string;
  tone?: string;
};

export type StaffOperationalUpdateRaw = {
  id?: string | number;
  updateId?: string | number;
  author?: string;
  authorName?: string;
  authorInitial?: string;
  authorRole?: string;
  staffName?: string;
  status?: string;
  statusKey?: string;
  statusLabel?: string;
  updateType?: string;
  type?: string;
  time?: string;
  timeLabel?: string;
  createdAt?: string;
  postedAt?: string;
  body?: string;
  title?: string;
  message?: string;
  content?: string;
  tags?: StaffOperationalUpdateTagRaw[] | unknown;
  labels?: unknown;
  icon?: string;
  iconKey?: string;
  isFlagged?: boolean;
  flagIssue?: boolean;
  isAnnouncement?: boolean;
  isPinned?: boolean;
  isOwnPost?: boolean;
  isMine?: boolean;
  canPin?: boolean;
  linkedJobReference?: string;
  vehicleId?: string;
  memberId?: string;
  vehicle?: { name?: string; displayName?: string; make?: string; model?: string } | string;
  member?: { name?: string; label?: string } | string;
  filterTags?: string[];
};

export type StaffOperationalUpdatesHeaderRaw = {
  dateLabel?: string;
  shiftLabel?: string;
  date?: string;
  shift?: string;
};

export type StaffOperationalUpdateTabRaw = {
  id?: string;
  key?: string;
  label?: string;
};

export type StaffOperationalUpdateBroadcastRaw = {
  id?: string | number;
  author?: string;
  authorName?: string;
  role?: string;
  authorRole?: string;
  body?: string;
  message?: string;
  timeLabel?: string;
  postedAt?: string;
  isPinned?: boolean;
};

export type StaffOperationalUpdatesSummaryData = {
  header?: StaffOperationalUpdatesHeaderRaw;
  screen?: {
    header?: StaffOperationalUpdatesHeaderRaw;
    tabs?: StaffOperationalUpdateTabRaw[] | unknown;
    broadcast?: StaffOperationalUpdateBroadcastRaw;
    managementBroadcast?: StaffOperationalUpdateBroadcastRaw;
  };
  tabs?: StaffOperationalUpdateTabRaw[] | unknown;
  filterTabs?: StaffOperationalUpdateTabRaw[] | unknown;
  broadcast?: StaffOperationalUpdateBroadcastRaw;
  managementBroadcast?: StaffOperationalUpdateBroadcastRaw;
  feed?: StaffOperationalUpdateRaw[] | unknown;
  updates?: StaffOperationalUpdateRaw[] | unknown;
  items?: StaffOperationalUpdateRaw[] | unknown;
};

export type StaffOperationalUpdatePinnedNoticeRaw = {
  id?: string | number;
  title?: string;
  body?: string;
  message?: string;
  tone?: string;
  color?: string;
  isPinned?: boolean;
};

export type StaffOperationalUpdatesPinnedData = {
  notices?: StaffOperationalUpdatePinnedNoticeRaw[] | unknown;
  pinned?: StaffOperationalUpdatePinnedNoticeRaw[] | unknown;
  items?: StaffOperationalUpdatePinnedNoticeRaw[] | unknown;
};

export type StaffOperationalUpdateShiftLogRaw = {
  id?: string | number;
  time?: string;
  title?: string;
  highlight?: string;
  label?: string;
  body?: string;
  tone?: string;
};

export type StaffOperationalUpdatesShiftLogData = {
  staffName?: string;
  name?: string;
  entries?: StaffOperationalUpdateShiftLogRaw[] | unknown;
  items?: StaffOperationalUpdateShiftLogRaw[] | unknown;
  log?: StaffOperationalUpdateShiftLogRaw[] | unknown;
  footerNote?: string;
  footer?: string;
  priorityNote?: string;
};

export type StaffOperationalUpdatesFeedData = {
  feed?: StaffOperationalUpdateRaw[] | unknown;
  updates?: StaffOperationalUpdateRaw[] | unknown;
  items?: StaffOperationalUpdateRaw[] | unknown;
};

export type OperationalUpdateType =
  | "general"
  | "shift_note"
  | "flagged_issue"
  | "service_reminder"
  | "inspection"
  | "transport"
  | "detailing"
  | "workshop";

export type StaffOperationalUpdateCreateRequest = {
  body: string;
  title?: string;
  updateType: OperationalUpdateType;
  linkedJobReference?: string;
  vehicleId?: string;
  memberId?: string;
  flagIssue?: boolean;
};

export type StaffOperationalUpdatePinRequest = {
  isPinned: boolean;
};

export type StaffOperationalUpdatesSummaryResponse = ApiResponse<
  StaffOperationalUpdatesSummaryData | Record<string, unknown>
>;
export type StaffOperationalUpdatesFeedResponse = ApiResponse<
  StaffOperationalUpdatesFeedData | StaffOperationalUpdateRaw[] | Record<string, unknown>
>;
export type StaffOperationalUpdatesPinnedResponse = ApiResponse<
  StaffOperationalUpdatesPinnedData | StaffOperationalUpdatePinnedNoticeRaw[] | Record<string, unknown>
>;
export type StaffOperationalUpdatesShiftLogResponse = ApiResponse<
  StaffOperationalUpdatesShiftLogData | Record<string, unknown>
>;
export type StaffOperationalUpdateDetailResponse = ApiResponse<
  StaffOperationalUpdateRaw | Record<string, unknown>
>;
export type StaffOperationalUpdateMutationResponse = ApiResponse<
  StaffOperationalUpdateRaw | Record<string, unknown>
>;
export type AdminAnalyticsPeriod = {
  key?: string;
  from?: string;
  to?: string;
  label?: string;
  interval?: string;
};

export type AdminAnalyticsKpiRaw = {
  label?: string;
  value?: number;
  displayValue?: string;
  subtitle?: string;
  delta?: number;
  deltaLabel?: string;
};

export type AdminAnalyticsKpis = {
  growth?: AdminAnalyticsKpiRaw;
  retention?: AdminAnalyticsKpiRaw;
  nps?: AdminAnalyticsKpiRaw;
  engagement?: AdminAnalyticsKpiRaw;
};

export type AdminAnalyticsStatsData = {
  period?: AdminAnalyticsPeriod;
  kpis?: AdminAnalyticsKpis;
};

export type AdminAnalyticsStatsResponse = ApiResponse<AdminAnalyticsStatsData>;

export type AdminAnalyticsSeriesPoint = {
  x?: string;
  y?: number;
};

export type AdminAnalyticsMemberGrowthRaw = {
  header?: string;
  totalMembers?: number;
  displayValue?: string;
  subtitle?: string;
  newInPeriod?: number;
  legends?: {
    cumulative?: string;
    new?: string;
  };
  series?: {
    cumulative?: AdminAnalyticsSeriesPoint[];
    new?: AdminAnalyticsSeriesPoint[];
  };
};

export type AdminAnalyticsMemberAttendanceRaw = {
  label?: string;
  value?: number;
  displayValue?: string;
  delta?: number;
  deltaLabel?: string;
  bottomLeftLabel?: string;
  bottomRightLabel?: string;
  totalAttended?: number;
  series?: AdminAnalyticsSeriesPoint[];
};

export type AdminAnalyticsConciergeLoadRaw = {
  label?: string;
  value?: number;
  displayValue?: string;
  deltaLabel?: string;
  bottomLeftLabel?: string;
  bottomRightLabel?: string;
  series?: AdminAnalyticsSeriesPoint[];
};

export type AdminAnalyticsVehicleUtilRaw = {
  label?: string;
  value?: number;
  displayValue?: string;
  delta?: number;
  deltaLabel?: string;
  peakHour?: string;
  activeVehicles?: number;
  totalVehicles?: number;
  bottomLeftLabel?: string;
  bottomCenterLabel?: string;
  bottomRightLabel?: string;
  series?: AdminAnalyticsSeriesPoint[];
};

export type AdminAnalyticsDashboardData = {
  period?: AdminAnalyticsPeriod;
  memberGrowth?: AdminAnalyticsMemberGrowthRaw;
  memberAttendance?: AdminAnalyticsMemberAttendanceRaw;
  conciergeLoad?: AdminAnalyticsConciergeLoadRaw;
  vehicleUtil?: AdminAnalyticsVehicleUtilRaw;
};

export type AdminAnalyticsDashboardResponse =
  ApiResponse<AdminAnalyticsDashboardData>;
