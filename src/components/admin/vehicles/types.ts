export type VehicleStatItem = {
  label: string;
  value: string;
  subtext: string;
  trend?: string;
  summaryKey?: string;
};

export type VehiclesStatsDisplay = {
  totalVehicles: VehicleStatItem;
  inStorage: VehicleStatItem;
  inService: VehicleStatItem;
  bayUtilization: VehicleStatItem;
};

export type BayStatus = "occupied" | "service" | "overdue" | "away" | "empty";

export type BaySlot = {
  bay: string;
  name: string;
  status: BayStatus;
};

export type BayMapDisplay = {
  level: string;
  levelLabel: string;
  bays: BaySlot[];
};

export type OperationStatus = "overdue" | "in-service" | "ready";

export type VehicleHealthItem = {
  label: string;
  value: number;
  note: string;
  tone: "pink" | "gold" | "teal";
};

export type VehicleDocumentLink = {
  label: string;
  url: string;
};

export type VehicleActivityHistoryItem = {
  id: string;
  label: string;
  value: string;
  meta: string;
  tone: "teal" | "gold" | "red";
};

export type VehicleDetailsScreenDisplay = {
  id: string;
  make: string;
  model: string;
  displayName: string;
  subtitle: string;
  statusLabel: string;
  statusKey: string;
  plate: string;
  vin: string;
  ownerInitial: string;
  ownerName: string;
  ownerInfoLabel: string;
  specifications: { label: string; value: string }[];
  bayCode: string;
  levelCode: string;
  bayTitle: string;
  storedStatus: string;
  inspectionStatus: string;
  bayDetails: { label: string; value: string }[];
  activityHistory: VehicleActivityHistoryItem[];
};

export type VehicleProfileDetail = {
  id: string;
  displayName: string;
  make: string;
  model: string;
  year: string;
  imageUrl: string;
  storageBay: string;
  ownerName: string;
  memberId: string;
  memberName: string;
  memberInitial: string;
  memberProfileImageUrl: string;
  mileage: string;
  status: string;
  statusLabel: string;
  statusKey: string;
  isOverdueService: boolean;
  ownershipType: string;
  isPriority: boolean;
  bay: string;
  plate: string;
  colour: string;
  chassisNo: string;
  lastActivity: string;
  lastServicedAt: string;
  fuelLevel: string;
  health: VehicleHealthItem[];
  documents: VehicleDocumentLink[];
};

export type VehicleOperationRow = {
  id: string;
  vehicleId: string;
  bay: string;
  initial: string;
  member: string;
  memberNo: string;
  profileImageUrl: string;
  make: string;
  model: string;
  status: OperationStatus;
  statusLabel: string;
  lastActivity: string;
};

export type AdminVehiclesPageData = {
  stats: VehiclesStatsDisplay;
  bayMap: BayMapDisplay;
  operations: VehicleOperationRow[];
  total: number;
  limit: number;
  offset: number;
};

export type VehicleSummaryKey =
  | "ready"
  | "in_service"
  | "in_storage"
  | "overdue_service";
