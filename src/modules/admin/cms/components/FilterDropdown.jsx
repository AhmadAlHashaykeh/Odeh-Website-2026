import { Select } from '../../ui';

export default function FilterDropdown({
  label,
  value,
  onChange,
  options = [],
  icon = 'filter',
  ariaLabel,
}) {
  return (
    <Select
      label={label}
      value={value}
      onChange={onChange}
      options={options}
      icon={icon}
      ariaLabel={ariaLabel}
    />
  );
}
