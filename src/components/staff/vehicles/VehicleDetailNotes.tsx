type VehicleDetailNotesProps = {
  notes: string[];
};

export function VehicleDetailNotes({ notes }: VehicleDetailNotesProps) {
  if (notes.length === 0) return null;

  return (
    <div className="border-t border-accent/10 px-5 py-5 sm:px-6 sm:py-6">
      <div className="space-y-3">
        <h3 className="font-copperplate text-[11px] text-foreground">Notes</h3>
        <div className="space-y-2">
          {notes.map((note, index) => (
            <p
              key={`${index}-${note.slice(0, 24)}`}
              className="font-roboto rounded-xl border border-accent/12 bg-[#11100C] px-4 py-3 text-sm leading-relaxed text-foreground"
            >
              {note}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
