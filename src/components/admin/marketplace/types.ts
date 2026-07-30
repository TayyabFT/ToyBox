export type MarketplaceTab = "vehicles" | "offers";

export type MarketplaceVehicleStatusTone =
  | "available"
  | "reserved"
  | "sold"
  | "other";

export type MarketplaceOfferStatusTone =
  | "pending"
  | "payment"
  | "rejected"
  | "purchased"
  | "countered"
  | "other";

export type MarketplaceVehicleHealthItem = {
  category: string;
  percentage: number;
  note?: string;
};

export type MarketplaceVehicleItem = {
  id: string;
  title: string;
  description: string;
  make: string;
  model: string;
  variant: string;
  year?: number;
  color: string;
  mileageLabel: string;
  mileage: number;
  vin: string;
  transmission: string;
  fuelType: string;
  engine: string;
  power: string;
  drive: string;
  zeroToHundred: string;
  topSpeed: string;
  plate: string;
  purchasedAt: string;
  storageBay: string;
  health: MarketplaceVehicleHealthItem[];
  images: string[];
  imageUrl: string;
  specifications: Record<string, unknown>;
  price: number;
  discount: number;
  finalPrice: number;
  priceLabel: string;
  discountLabel: string;
  finalPriceLabel: string;
  status: string;
  statusLabel: string;
  statusTone: MarketplaceVehicleStatusTone;
  createdAt: string;
};

export type MarketplaceOfferItem = {
  id: string;
  status: string;
  statusLabel: string;
  statusTone: MarketplaceOfferStatusTone;
  offerPrice: number;
  offerPriceLabel: string;
  counterOfferPrice: number;
  counterOfferPriceLabel?: string;
  remarks: string;
  memberName: string;
  memberEmail: string;
  memberTier: string;
  memberId: string;
  vehicleId: string;
  vehicleTitle: string;
  vehicleSubtitle: string;
  vehiclePriceLabel: string;
  vehicleImageUrl: string;
  vehicleStatusLabel: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear?: number;
  vehicleColor: string;
  vehicleMileageLabel: string;
  createdAt: string;
  updatedAt: string;
  canApprove: boolean;
  canReject: boolean;
  canCounter: boolean;
  canApprovePayment: boolean;
  canRejectPayment: boolean;
};
