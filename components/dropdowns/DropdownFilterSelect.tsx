export default function DropdownFilterSelect({ label, options, values, onChange }: { label?: string; options: string[]; values?: string[]; onChange: (val: string) => void }) {
  const vals = values || options;
  return (
    <>
      <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <select
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 px-4 bg-white dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        <option value="">Semua</option>
        {options.map((opt, i) => (
          <option key={i} value={vals[i]}>
            {opt}
          </option>
        ))}
      </select>
    </>
  );
}
