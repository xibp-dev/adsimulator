interface Props {
  status: string;
}

const config: Record<string, { label: string; className: string }> = {
  ACTIVE:    { label: "Aktif",         className: "bg-green-100 text-green-700 border-green-200" },
  PAUSED:    { label: "Nonaktif",      className: "bg-gray-100 text-gray-500 border-gray-200" },
  DRAFT:     { label: "Draf",          className: "bg-gray-100 text-gray-500 border-gray-200" },
  IN_REVIEW: { label: "Dalam tinjauan", className: "bg-amber-100 text-amber-700 border-amber-200" },
};

export default function StatusBadge({ status }: Props) {
  const conf = config[status] ?? { label: status, className: "bg-gray-100 text-gray-500 border-gray-200" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${conf.className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        status === "ACTIVE" ? "bg-green-500" :
        status === "IN_REVIEW" ? "bg-amber-500" : "bg-gray-400"
      }`} />
      {conf.label}
    </span>
  );
}
