const StatusBadge = ({ status }) => {
  const map = {
    pending: 'badge-pending',
    selected: 'badge-selected',
    rejected: 'badge-rejected',
    completed: 'badge-completed',
  };
  return (
    <span className={map[status] || 'bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full'}>
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );
};

export default StatusBadge;
