type VehicleDetailImageProps = {
  imageUrl?: string;
  name: string;
};

export function VehicleDetailImage({ imageUrl, name }: VehicleDetailImageProps) {
  if (!imageUrl) return null;

  return (
    <div className="relative aspect-[16/9] overflow-hidden border-b border-accent/10 bg-dark">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt={name}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
