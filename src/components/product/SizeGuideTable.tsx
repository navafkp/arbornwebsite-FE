import type { Size } from "@/lib/types";

const MEASUREMENTS: Record<Size, { bust: string; waist: string; length: string }> = {
  XS: { bust: '32"', waist: '26"', length: '38"' },
  S: { bust: '34"', waist: '28"', length: '39"' },
  M: { bust: '36"', waist: '30"', length: '40"' },
  L: { bust: '38"', waist: '32"', length: '41"' },
  XL: { bust: '40"', waist: '34"', length: '42"' },
  XXL: { bust: '42"', waist: '36"', length: '43"' },
  "3XL": { bust: '44"', waist: '38"', length: '44"' },
};

export default function SizeGuideTable({ sizes }: { sizes: Size[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[360px] text-left text-xs">
        <thead>
          <tr className="border-b border-black/10 text-[var(--muted)]">
            <th className="py-2 pr-4 font-medium">Size</th>
            <th className="py-2 pr-4 font-medium">Bust</th>
            <th className="py-2 pr-4 font-medium">Waist</th>
            <th className="py-2 font-medium">Length</th>
          </tr>
        </thead>
        <tbody>
          {sizes.map((size) => (
            <tr key={size} className="border-b border-black/5">
              <td className="py-2 pr-4 font-medium text-black">{size}</td>
              <td className="py-2 pr-4">{MEASUREMENTS[size].bust}</td>
              <td className="py-2 pr-4">{MEASUREMENTS[size].waist}</td>
              <td className="py-2">{MEASUREMENTS[size].length}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-[11px] text-[var(--muted)]">
        Measurements are body measurements in inches. For the best fit, compare with a similar garment you own.
      </p>
    </div>
  );
}
