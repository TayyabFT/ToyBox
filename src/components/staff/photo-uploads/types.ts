export type PhotoUploadFilter =
  | "all"
  | "today"
  | "pending-upload"
  | "inspection"
  | "service";

export type ServiceTypeTab =
  | "pre-service"
  | "detailing"
  | "transport"
  | "damage-report"
  | "sign-off";

export type CaptureMode =
  | "photo"
  | "video"
  | "burst"
  | "zoom"
  | "flash"
  | "scan";

export type CaptureStatus = "uploaded" | "pending" | "flagged";

export type TodayCapture = {
  id: string;
  label: string;
  time: string;
  status: CaptureStatus;
  thumbnailUrl?: string;
};

export type UploadState = "synced" | "flagged" | "pending" | "approved";

export type RecentUpload = {
  id: string;
  title: string;
  meta: string;
  state: UploadState;
};

export type SelectedPhoto = {
  id: string;
  reference: string;
  index: string;
  title: string;
  status: "flagged" | "approved" | "pending";
  time: string;
  size: string;
  fileId: string;
  categoryTags: string[];
  caption: string;
  isIssueFlagged?: boolean;
  imageUrl?: string;
};

export type PhotoUploadHeader = {
  dateLabel: string;
  shiftLabel: string;
};

export type CameraContext = {
  caption: string;
  linkedJobReference?: string;
  sectionLabel?: string;
};

export type PendingSummary = {
  totalPhotos: number;
  pendingCount: number;
  totalSizeMb: string;
};

export type PhotoUploadTab = {
  id: PhotoUploadFilter;
  label: string;
};

export type SelectedPhotoDraft = {
  sectionLabel: string;
  categoryTags: string[];
  caption: string;
  linkedJobReference: string;
  isIssueFlagged: boolean;
};

export type LocalPendingCapture = {
  id: string;
  file: File;
  previewUrl: string;
  label: string;
  sectionLabel: string;
  categoryTags: string[];
  linkedJobReference?: string;
};
