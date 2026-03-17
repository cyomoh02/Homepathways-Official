interface AdSlotProps {
  variant: "horizontal" | "vertical";
  label?: string;
}

export default function AdSlot({ variant, label }: AdSlotProps) {
  if (variant === "horizontal") {
    return (
      <div className="my-8 flex items-center justify-center rounded-lg border border-dashed border-white/10 bg-white/[0.02] px-4 py-6">
        <span className="text-xs text-gray-600">
          {label || "Advertisement"}
        </span>
      </div>
    );
  }

  return (
    <div className="flex h-[600px] w-full items-center justify-center rounded-lg border border-dashed border-white/10 bg-white/[0.02]">
      <span className="text-xs text-gray-600">{label || "Advertisement"}</span>
    </div>
  );
}
