import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  useId,
  useMemo,
} from 'react';
import { createPortal } from 'react-dom';
import AdminIcon from '../../components/AdminIcons';
import styles from './Select.module.css';

const MENU_MAX_HEIGHT = 240;
const MENU_GAP = 4;
const SELECT_MENU_Z_INDEX = 1100;

function getPortalContainer() {
  return document.querySelector('[data-admin-layout]') || document.body;
}

function normalizeOptions(options) {
  return options.map((option) => {
    if (typeof option === 'string') {
      return { value: option, label: option };
    }
    return option;
  });
}

function getMenuPosition(triggerRect) {
  const spaceBelow = window.innerHeight - triggerRect.bottom;
  const spaceAbove = triggerRect.top;
  const openUp = spaceBelow < MENU_MAX_HEIGHT + MENU_GAP && spaceAbove > spaceBelow;

  const base = {
    position: 'fixed',
    left: triggerRect.left,
    width: triggerRect.width,
    zIndex: SELECT_MENU_Z_INDEX,
  };

  if (openUp) {
    return {
      ...base,
      top: 'auto',
      bottom: window.innerHeight - triggerRect.top + MENU_GAP,
      maxHeight: Math.max(80, Math.min(MENU_MAX_HEIGHT, spaceAbove - MENU_GAP * 2)),
    };
  }

  return {
    ...base,
    top: triggerRect.bottom + MENU_GAP,
    bottom: 'auto',
    maxHeight: Math.max(80, Math.min(MENU_MAX_HEIGHT, spaceBelow - MENU_GAP * 2)),
  };
}

export default function Select({
  label,
  value,
  defaultValue,
  onChange,
  options = [],
  icon,
  ariaLabel,
  disabled = false,
  variant = 'default',
  size = 'md',
  className = '',
  id,
  name,
}) {
  const listId = useId();
  const triggerId = id || `${listId}-trigger`;
  const isControlled = value !== undefined;
  const normalizedOptions = useMemo(() => normalizeOptions(options), [options]);

  const [internalValue, setInternalValue] = useState(
    () => defaultValue ?? normalizedOptions[0]?.value ?? '',
  );
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [menuStyle, setMenuStyle] = useState({});

  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const selectedValue = isControlled ? value : internalValue;

  const selectedOption = normalizedOptions.find((opt) => opt.value === selectedValue)
    ?? normalizedOptions[0];

  const selectedIndex = normalizedOptions.findIndex((opt) => opt.value === selectedValue);

  const setSelectedValue = useCallback((nextValue) => {
    if (!isControlled) {
      setInternalValue(nextValue);
    }
    onChange?.(nextValue);
  }, [isControlled, onChange]);

  const closeMenu = useCallback(() => {
    setOpen(false);
    setHighlightedIndex(-1);
  }, []);

  const openMenu = useCallback(() => {
    if (disabled) return;
    if (triggerRef.current) {
      setMenuStyle(getMenuPosition(triggerRef.current.getBoundingClientRect()));
    }
    setOpen(true);
    setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
  }, [disabled, selectedIndex]);

  const updateMenuPosition = useCallback(() => {
    if (!triggerRef.current) return;
    setMenuStyle(getMenuPosition(triggerRef.current.getBoundingClientRect()));
  }, []);

  const selectOption = useCallback((option) => {
    setSelectedValue(option.value);
    closeMenu();
    triggerRef.current?.focus();
  }, [closeMenu, setSelectedValue]);

  useLayoutEffect(() => {
    if (!open) return;
    updateMenuPosition();
  }, [open, updateMenuPosition]);

  useEffect(() => {
    if (!open) return undefined;

    updateMenuPosition();

    const handleScrollOrResize = () => updateMenuPosition();
    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('scroll', handleScrollOrResize, true);

    return () => {
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, true);
    };
  }, [open, updateMenuPosition]);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      const target = event.target;
      if (
        triggerRef.current?.contains(target)
        || menuRef.current?.contains(target)
      ) {
        return;
      }
      closeMenu();
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu();
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, closeMenu]);

  useEffect(() => {
    if (!open || highlightedIndex < 0) return;
    const optionEl = menuRef.current?.querySelector(`[data-index="${highlightedIndex}"]`);
    optionEl?.scrollIntoView({ block: 'nearest' });
  }, [open, highlightedIndex]);

  const handleTriggerKeyDown = (event) => {
    if (disabled) return;

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp':
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!open) {
          openMenu();
        } else if (event.key === 'ArrowDown') {
          setHighlightedIndex((prev) => Math.min(prev + 1, normalizedOptions.length - 1));
        } else if (event.key === 'ArrowUp') {
          setHighlightedIndex((prev) => Math.max(prev - 1, 0));
        } else if (highlightedIndex >= 0) {
          selectOption(normalizedOptions[highlightedIndex]);
        }
        break;
      case 'Home':
        if (open) {
          event.preventDefault();
          setHighlightedIndex(0);
        }
        break;
      case 'End':
        if (open) {
          event.preventDefault();
          setHighlightedIndex(normalizedOptions.length - 1);
        }
        break;
      case 'Tab':
        closeMenu();
        break;
      default:
        break;
    }
  };

  const handleMenuKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setHighlightedIndex((prev) => Math.min(prev + 1, normalizedOptions.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setHighlightedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (highlightedIndex >= 0) {
          selectOption(normalizedOptions[highlightedIndex]);
        }
        break;
      case 'Home':
        event.preventDefault();
        setHighlightedIndex(0);
        break;
      case 'End':
        event.preventDefault();
        setHighlightedIndex(normalizedOptions.length - 1);
        break;
      case 'Tab':
        closeMenu();
        break;
      default:
        break;
    }
  };

  const isFilter = variant === 'filter';
  const isSm = size === 'sm';

  const wrapClasses = [
    styles.wrap,
    isFilter ? styles.filter : '',
    !icon ? styles.noIcon : '',
    isSm ? styles.sm : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const triggerClasses = [
    styles.trigger,
    open ? styles.triggerOpen : '',
    disabled ? styles.triggerDisabled : '',
  ]
    .filter(Boolean)
    .join(' ');

  const menu = open && normalizedOptions.length > 0
    ? createPortal(
      <div
        ref={menuRef}
        id={`${listId}-listbox`}
        role="listbox"
        aria-labelledby={label ? undefined : triggerId}
        aria-label={!label ? (ariaLabel || 'Select option') : undefined}
        className={styles.menu}
        style={menuStyle}
        onKeyDown={handleMenuKeyDown}
      >
        {normalizedOptions.map((option, index) => {
          const isSelected = option.value === selectedValue;
          const isHighlighted = index === highlightedIndex;

          return (
            <button
              key={option.value}
              type="button"
              role="option"
              data-index={index}
              aria-selected={isSelected}
              className={[
                styles.menuItem,
                isSelected ? styles.menuItemSelected : '',
                isHighlighted ? styles.menuItemHighlighted : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onMouseEnter={() => setHighlightedIndex(index)}
              onClick={() => selectOption(option)}
            >
              {option.label}
            </button>
          );
        })}
      </div>,
      getPortalContainer(),
    )
    : null;

  return (
    <div className={wrapClasses}>
      {label && (
        <label htmlFor={triggerId} className={styles.label}>
          {label}
        </label>
      )}

      {name && (
        <input type="hidden" name={name} value={selectedValue ?? ''} />
      )}

      <div className={styles.selectWrap}>
        {icon && <AdminIcon name={icon} size={14} className={styles.icon} />}
        <button
          ref={triggerRef}
          id={triggerId}
          type="button"
          className={triggerClasses}
          onClick={() => (open ? closeMenu() : openMenu())}
          onKeyDown={handleTriggerKeyDown}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={`${listId}-listbox`}
          aria-label={ariaLabel || label}
        >
          <span className={styles.triggerValue}>
            {selectedOption?.label ?? 'Select...'}
          </span>
        </button>
        <AdminIcon
          name="chevronDown"
          size={14}
          className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
        />
      </div>

      {menu}
    </div>
  );
}

/** Visual-only multi-select display */
export function MultiSelect({
  label,
  values = [],
  placeholder = 'Select items...',
  onRemove,
  className = '',
}) {
  return (
    <div className={`${styles.wrap} ${className}`}>
      {label && <span className={styles.label}>{label}</span>}
      <div className={styles.multi} role="listbox" aria-label={label}>
        {values.length === 0 ? (
          <span className={styles.multiPlaceholder}>{placeholder}</span>
        ) : (
          values.map((item) => (
            <span key={item.value} className={styles.multiTag} role="option">
              {item.label}
              {onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(item.value)}
                  aria-label={`Remove ${item.label}`}
                  className={styles.multiTagRemove}
                >
                  <AdminIcon name="close" size={12} />
                </button>
              )}
            </span>
          ))
        )}
      </div>
    </div>
  );
}

/** Visual-only searchable select */
export function SearchableSelect({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Search...',
  className = '',
}) {
  const normalizedOptions = normalizeOptions(options);
  const selected = normalizedOptions.find((o) => o.value === value);

  return (
    <div className={`${styles.wrap} ${styles.searchable} ${className}`}>
      {label && <span className={styles.label}>{label}</span>}
      <div className={styles.selectWrap}>
        <AdminIcon name="search" size={14} className={styles.icon} />
        <input
          type="text"
          className={styles.searchInput}
          value={selected?.label || ''}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          aria-label={label || placeholder}
          readOnly
        />
        <AdminIcon name="chevronDown" size={14} className={styles.chevron} />
      </div>
      <div className={styles.menuStatic} role="listbox">
        {normalizedOptions.map((option) => (
          <div
            key={option.value}
            className={`${styles.menuItem} ${option.value === value ? styles.menuItemSelected : ''}`}
            role="option"
            aria-selected={option.value === value}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
}

Select.Multi = MultiSelect;
Select.Searchable = SearchableSelect;
Select.Filter = function FilterSelect(props) {
  return <Select {...props} variant="filter" />;
};
