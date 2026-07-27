import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import AdminIcon from '../../components/AdminIcons';
import styles from './OverflowMenu.module.css';

const MENU_GAP = 4;
const MENU_MIN_WIDTH = 200;

function getPortalContainer() {
  return document.querySelector('[data-admin-layout]') || document.body;
}

function getMenuPosition(triggerRect, menuWidth = MENU_MIN_WIDTH) {
  const spaceBelow = window.innerHeight - triggerRect.bottom;
  const spaceAbove = triggerRect.top;
  const estimatedHeight = 280;
  const openUp = spaceBelow < estimatedHeight + MENU_GAP && spaceAbove > spaceBelow;

  const left = Math.max(
    8,
    Math.min(triggerRect.right - menuWidth, window.innerWidth - menuWidth - 8),
  );

  const base = {
    position: 'fixed',
    left,
    width: menuWidth,
    zIndex: 'var(--admin-z-popover)',
  };

  if (openUp) {
    return {
      ...base,
      top: 'auto',
      bottom: window.innerHeight - triggerRect.top + MENU_GAP,
      maxHeight: Math.max(120, spaceAbove - MENU_GAP * 2),
    };
  }

  return {
    ...base,
    top: triggerRect.bottom + MENU_GAP,
    bottom: 'auto',
    maxHeight: Math.max(120, spaceBelow - MENU_GAP * 2),
  };
}

/**
 * Portaled overflow / kebab action menu.
 * Renders above clipped cards and stacking contexts (same portal pattern as Select).
 *
 * @param {Array<{ id: string, label: string, icon?: string, danger?: boolean, submenu?: Array }>} items
 */
export default function OverflowMenu({
  items = [],
  ariaLabel = 'More actions',
  onAction,
  triggerVariant = 'default',
  align = 'end',
}) {
  const menuId = useId();
  const [open, setOpen] = useState(false);
  const [submenuOpenId, setSubmenuOpenId] = useState(null);
  const [menuStyle, setMenuStyle] = useState({});
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  const closeMenu = useCallback(() => {
    setOpen(false);
    setSubmenuOpenId(null);
  }, []);

  const updateMenuPosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const width = Math.max(MENU_MIN_WIDTH, menuRef.current?.offsetWidth || MENU_MIN_WIDTH);
    const next = getMenuPosition(rect, width);
    if (align === 'start') {
      next.left = Math.max(8, Math.min(rect.left, window.innerWidth - width - 8));
    }
    setMenuStyle(next);
  }, [align]);

  const openMenu = useCallback(() => {
    if (triggerRef.current) {
      setMenuStyle(getMenuPosition(triggerRef.current.getBoundingClientRect()));
    }
    setOpen(true);
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    updateMenuPosition();
  }, [open, updateMenuPosition, submenuOpenId]);

  useEffect(() => {
    if (!open) return undefined;

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

  const handleSelect = (item, submenuItem) => {
    if (item.submenu && !submenuItem) {
      setSubmenuOpenId((prev) => (prev === item.id ? null : item.id));
      return;
    }

    closeMenu();
    onAction?.(submenuItem?.id ?? item.id, submenuItem ?? item);
  };

  const triggerClasses = [
    styles.trigger,
    triggerVariant === 'overlay' ? styles.triggerOverlay : '',
    triggerVariant === 'dark' ? styles.triggerDark : '',
  ]
    .filter(Boolean)
    .join(' ');

  const menu = open
    ? createPortal(
      <div
        ref={menuRef}
        id={menuId}
        role="menu"
        aria-label={ariaLabel}
        className={styles.menu}
        style={menuStyle}
      >
        {items.map((item) => (
          <div key={item.id} className={styles.menuGroup}>
            <button
              type="button"
              role="menuitem"
              className={[
                styles.menuItem,
                item.danger ? styles.danger : '',
                item.submenu ? styles.hasSubmenu : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => handleSelect(item)}
              aria-expanded={item.submenu ? submenuOpenId === item.id : undefined}
              aria-haspopup={item.submenu ? 'menu' : undefined}
            >
              {item.icon && <AdminIcon name={item.icon} size={15} />}
              {item.label}
              {item.submenu && (
                <AdminIcon name="chevronDown" size={12} className={styles.submenuChevron} />
              )}
            </button>

            {item.submenu && submenuOpenId === item.id && (
              <div className={styles.submenu} role="menu">
                {item.submenu.map((sub) => (
                  <button
                    key={sub.id}
                    type="button"
                    role="menuitem"
                    className={styles.submenuItem}
                    onClick={() => handleSelect(item, sub)}
                  >
                    {sub.icon && <AdminIcon name={sub.icon} size={14} />}
                    {sub.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>,
      getPortalContainer(),
    )
    : null;

  return (
    <div className={styles.wrap}>
      <button
        ref={triggerRef}
        type="button"
        className={triggerClasses}
        onClick={() => (open ? closeMenu() : openMenu())}
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={open ? menuId : undefined}
      >
        <AdminIcon name="more" size={16} />
      </button>
      {menu}
    </div>
  );
}
