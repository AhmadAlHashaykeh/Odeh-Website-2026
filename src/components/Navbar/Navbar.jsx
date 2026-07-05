import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navLinks } from '../../data/navigation';
import { useSmoothScroll } from '../../context/SmoothScrollContext';
import SearchOverlay from '../SearchOverlay/SearchOverlay';
import AboutDropdownIcon from './AboutDropdownIcons';
import styles from './Navbar.module.css';

function AboutDropdownItemContent({ item }) {
  return (
    <>
      <span className={styles.dropdownIcon} aria-hidden="true">
        <AboutDropdownIcon name={item.icon} />
      </span>
      <span className={styles.dropdownText}>
        <span className={styles.dropdownTitle}>{item.label}</span>
        <span className={styles.dropdownDesc}>{item.description}</span>
      </span>
    </>
  );
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function MenuIcon({ open }) {
  return open ? (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  ) : (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function ChevronIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export default function Navbar() {
  const location = useLocation();
  const { setScrollLocked, subscribeScroll } = useSmoothScroll();
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchClosing, setSearchClosing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const searchBtnRef = useRef(null);

  useEffect(() => {
    return subscribeScroll((scrollY) => setScrolled(scrollY > 60));
  }, [subscribeScroll]);

  useEffect(() => {
    setMobileOpen(false);
    setMobileDropdownOpen(false);
    setDropdownOpen(false);
    setSearchOpen(false);
    setSearchClosing(false);
  }, [location.pathname]);

  const finishSearchClose = useCallback(() => {
    setSearchOpen(false);
    setSearchClosing(false);
    setSearchQuery('');
    searchBtnRef.current?.focus();
  }, []);

  const startSearchClose = useCallback(() => {
    setSearchClosing(true);
  }, []);

  useEffect(() => {
    const locked = mobileOpen || searchOpen;
    document.body.style.overflow = locked ? 'hidden' : '';
    setScrollLocked(locked);
    return () => {
      document.body.style.overflow = '';
      setScrollLocked(false);
    };
  }, [mobileOpen, searchOpen, setScrollLocked]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        setDropdownOpen(false);
        if (searchOpen) startSearchClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [searchOpen, startSearchClose]);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
        <div className={`container ${styles.navbarInner}`}>
          <Link to="/" className={styles.logo} aria-label="ODEH & PARTNERS DESIGN Home">
            <img src="/odeh-logo2.png" alt="ODEH & PARTNERS DESIGN" />
          </Link>

          <nav className={styles.navDesktop} aria-label="Main navigation">
            {navLinks.map((link) =>
              link.dropdown ? (
                <div
                  key={link.label}
                  className={styles.navItem}
                  ref={dropdownRef}
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <button
                    type="button"
                    className={`${styles.navLink} ${isActive('/about') ? styles.active : ''}`}
                    aria-expanded={dropdownOpen}
                    aria-haspopup="true"
                    onClick={() => setDropdownOpen((prev) => !prev)}
                  >
                    {link.label}
                    <ChevronIcon
                      className={`${styles.chevron} ${dropdownOpen ? styles.chevronOpen : ''}`}
                    />
                  </button>
                  <div
                    className={`${styles.dropdown} ${dropdownOpen ? styles.dropdownOpen : ''}`}
                    role="menu"
                  >
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={styles.dropdownLink}
                        role="menuitem"
                      >
                        <AboutDropdownItemContent item={item} />
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`${styles.navLink} ${isActive(link.path) ? styles.active : ''}`}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          <div className={styles.navActions}>
            <button
              ref={searchBtnRef}
              type="button"
              className={styles.searchBtn}
              aria-label="Open search"
              aria-expanded={searchOpen}
              aria-haspopup="dialog"
              onClick={() => {
                setSearchClosing(false);
                setSearchOpen(true);
              }}
            >
              <SearchIcon />
            </button>
            <button
              type="button"
              className={styles.menuBtn}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              onClick={() => {
                setMobileOpen((prev) => {
                  if (prev) setMobileDropdownOpen(false);
                  return !prev;
                });
              }}
            >
              <MenuIcon open={mobileOpen} />
            </button>
          </div>
        </div>
      </header>

      <SearchOverlay
        isOpen={searchOpen}
        isClosing={searchClosing}
        query={searchQuery}
        onQueryChange={setSearchQuery}
        onCloseStart={startSearchClose}
        onClose={finishSearchClose}
      />

      {mobileOpen && (
        <div className={styles.mobileMenu} data-lenis-prevent>
          <ul className={styles.mobileNavList}>
            {navLinks.map((link) =>
              link.dropdown ? (
                <li key={link.label}>
                  <button
                    type="button"
                    className={styles.mobileDropdownToggle}
                    aria-expanded={mobileDropdownOpen}
                    onClick={() => setMobileDropdownOpen((prev) => !prev)}
                  >
                    {link.label}
                    <ChevronIcon
                      className={`${styles.chevron} ${mobileDropdownOpen ? styles.chevronOpen : ''}`}
                    />
                  </button>
                  <div
                    className={`${styles.mobileDropdown} ${mobileDropdownOpen ? styles.mobileDropdownOpen : ''}`}
                  >
                    {link.dropdown.map((item) => (
                      <Link key={item.path} to={item.path} className={styles.mobileDropdownLink}>
                        <AboutDropdownItemContent item={item} />
                      </Link>
                    ))}
                  </div>
                </li>
              ) : (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`${styles.mobileNavLink} ${isActive(link.path) ? styles.active : ''}`}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </>
  );
}
