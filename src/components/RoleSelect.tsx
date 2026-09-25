const OPTIONS = [
  { value: "GUEST", label: "Book a stay" },
  { value: "HOST", label: "Host my place" },
  { value: "BOTH", label: "Both" },
] as const;

export function RoleSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: "GUEST" | "HOST" | "BOTH") => void;
}) {
  return (
    <div>
      <span className="mb-2 block text-[11px] text-[#A69F91]">
        Here to
      </span>
      <div className="flex gap-2">
        {OPTIONS.map((option) => {
          const isSelected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`flex-1 rounded-full border px-3 py-2.5 text-[13px] font-semibold ${
                isSelected
                  ? "border-accent bg-accent text-white"
                  : "border-border bg-white text-foreground"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
