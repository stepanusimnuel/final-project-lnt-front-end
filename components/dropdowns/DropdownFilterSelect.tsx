export default function DropdownFilterSelect({ label, options, values, onChange }: { label: string; options: string[]; values?: string[]; onChange: (val: string) => void }) {
  const vals = values || options;
  return (
    <select onChange={(e) => onChange(e.target.value)} className="p-2 px-4 bg-white dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
      <option value="">{label}</option>
      {options.map((opt, i) => (
        <option key={i} value={vals[i]}>
          {opt}
        </option>
      ))}
    </select>
  );
}
