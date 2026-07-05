import AdminIcon from '../../components/AdminIcons';
import { Input } from '../../ui';

export default function SearchField({
  value,
  onChange,
  placeholder = 'Search...',
  ariaLabel = 'Search',
}) {
  return (
    <Input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={ariaLabel}
      icon={<AdminIcon name="search" size={16} />}
      className=""
    />
  );
}
