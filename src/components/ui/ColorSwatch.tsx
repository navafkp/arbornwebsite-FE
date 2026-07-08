import { cn } from "@/lib/utils";

interface ColorSwatchProps {
  hex: string;
  name: string;
  selected?: boolean;
  size?: "sm" | "md";
  onClick?: () => void;
}

export default function ColorSwatch({
  hex,
  name,
  selected,
  size = "sm",
  onClick,
}: ColorSwatchProps) {
  const dimension = size === "sm" ? "h-4 w-4" : "h-8 w-8";

  const Comp = onClick ? "button" : "span";

  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      title={name}
      aria-label={name}
      aria-pressed={onClick ? selected : undefined}
      className={cn(
        "rounded-full ring-1 ring-offset-2 ring-offset-white transition",
        dimension,
        selected ? "ring-accent" : "ring-black/10",
        onClick && "cursor-pointer hover:ring-black/40",
      )}
      style={{ backgroundColor: hex }}
    />
  );
}
