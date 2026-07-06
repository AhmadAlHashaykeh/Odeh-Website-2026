import { useEffect, useRef, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchContent } from '../../api/public/content';
import { usePublicSite } from '../../context/PublicSiteContext';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import SearchResultIcon from './SearchResultIcon';
import styles from './SearchOverlay.module.css';

const CLOSE_DURATION_MS = 280;

function SearchIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function EmptyIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
      <path d="M8 11h6" />
    </svg>
  );
}

export default function SearchOverlay({
  isOpen,
  isClosing,
  query,
  onQueryChange,
  onClose,
  onCloseStart,
}) {
  const navigate = useNavigate();
  const panelRef = useRef(null);
  const inputRef = useRef(null);
  const optionRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  const debouncedQuery = useDebouncedValue(query, 150);
  const { searchSettings } = usePublicSite();
  const suggestionsLimit = searchSettings.suggestionsLimit ?? 8;

  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (!trimmed) {
      setSuggestions([]);
      return undefined;
    }

    let cancelled = false;

    searchContent(trimmed, suggestionsLimit)
      .then((response) => {
        if (!cancelled) {
          setSuggestions(response.data ?? []);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSuggestions([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, suggestionsLimit]);

  const showSuggestions = debouncedQuery.trim().length > 0;
  const hasResults = suggestions.length > 0;

  const navigateToSearch = useCallback(
    (searchTerm) => {
      const trimmed = searchTerm.trim();
      if (!trimmed) return;
      onCloseStart();
      setTimeout(() => {
        navigate(`/search?q=${encodeURIComponent(trimmed)}`);
        onClose();
      }, CLOSE_DURATION_MS);
    },
    [navigate, onClose, onCloseStart],
  );

  const navigateToResult = useCallback(
    (item) => {
      onCloseStart();
      setTimeout(() => {
        navigate(item.path);
        onClose();
      }, CLOSE_DURATION_MS);
    },
    [navigate, onClose, onCloseStart],
  );

  const handleClose = useCallback(() => {
    onCloseStart();
    setTimeout(onClose, CLOSE_DURATION_MS);
  }, [onClose, onCloseStart]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      navigateToResult(suggestions[activeIndex]);
      return;
    }
    navigateToSearch(query);
  };

  const handleClear = () => {
    onQueryChange('');
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  const handleInputKeyDown = (e) => {
    if (!showSuggestions) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!hasResults) return;
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!hasResults) return;
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter' && activeIndex >= 0 && suggestions[activeIndex]) {
      e.preventDefault();
      navigateToResult(suggestions[activeIndex]);
    }
  };

  useEffect(() => {
    setActiveIndex(-1);
  }, [debouncedQuery]);

  useEffect(() => {
    if (activeIndex >= 0 && optionRefs.current[activeIndex]) {
      optionRefs.current[activeIndex].scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  useEffect(() => {
    if (isOpen && !isClosing && inputRef.current) {
      const timer = requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
      return () => cancelAnimationFrame(timer);
    }
  }, [isOpen, isClosing]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, handleClose]);

  useEffect(() => {
    if (!isOpen || isClosing) return;

    const panel = panelRef.current;
    if (!panel) return;

    const getFocusable = () =>
      Array.from(
        panel.querySelectorAll(
          'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => !el.disabled);

    const handleTab = (e) => {
      if (e.key !== 'Tab') return;

      const focusable = getFocusable();
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [isOpen, isClosing]);

  if (!isOpen) return null;

  const hasQuery = query.length > 0;
  const activeOptionId =
    activeIndex >= 0 && suggestions[activeIndex]
      ? `search-option-${suggestions[activeIndex].id}`
      : undefined;

  return (
    <div
      className={`${styles.overlay} ${isClosing ? styles.overlayClosing : ''}`}
      data-lenis-prevent
      onClick={handleClose}
      role="presentation"
    >
      <div
        ref={panelRef}
        className={`${styles.panel} ${isClosing ? styles.panelClosing : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        onClick={(e) => e.stopPropagation()}
      >
        <form className={styles.searchForm} onSubmit={handleSubmit}>
          <div className={styles.header}>
            <h2 className={styles.title}>Search</h2>
            <p className={styles.subtitle}>Search across projects, services and careers.</p>
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputWrap}>
              <button
                type="submit"
                className={styles.searchIconBtn}
                aria-label="Search"
                disabled={!query.trim()}
              >
                <SearchIcon />
              </button>
              <input
                ref={inputRef}
                type="search"
                className={styles.searchInput}
                placeholder="Search projects, services, careers..."
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                onKeyDown={handleInputKeyDown}
                aria-label="Search query"
                aria-autocomplete="list"
                aria-controls={showSuggestions ? 'search-suggestions' : undefined}
                aria-expanded={showSuggestions}
                aria-activedescendant={activeOptionId}
                autoComplete="off"
                role="combobox"
              />
              {hasQuery && (
                <button
                  type="button"
                  className={styles.clearBtn}
                  aria-label="Clear search"
                  onClick={handleClear}
                >
                  <ClearIcon />
                </button>
              )}
            </div>

            {showSuggestions && (
              <div
                id="search-suggestions"
                className={styles.dropdown}
                role="listbox"
                aria-label="Search suggestions"
              >
                {hasResults ? (
                  suggestions.map((item, index) => (
                    <button
                      key={item.id}
                      ref={(el) => {
                        optionRefs.current[index] = el;
                      }}
                      id={`search-option-${item.id}`}
                      type="button"
                      role="option"
                      aria-selected={activeIndex === index}
                      className={`${styles.resultItem} ${activeIndex === index ? styles.resultItemActive : ''}`}
                      style={{ animationDelay: `${index * 30}ms` }}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => navigateToResult(item)}
                    >
                      <span className={`${styles.resultIcon} ${styles[`resultIcon_${item.type}`]}`}>
                        <SearchResultIcon type={item.type} />
                      </span>
                      <span className={styles.resultText}>
                        <span className={styles.resultTitle}>{item.title}</span>
                        <span className={styles.resultSubtitle}>
                          {item.typeLabel} · {item.subtitle}
                        </span>
                      </span>
                      <span className={styles.resultArrow} aria-hidden="true">
                        <ArrowIcon />
                      </span>
                    </button>
                  ))
                ) : (
                  <div className={styles.emptyState} role="status">
                    <span className={styles.emptyIcon}>
                      <EmptyIcon />
                    </span>
                    <p className={styles.emptyTitle}>No matching results</p>
                    <p className={styles.emptyHint}>Try another keyword.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <p className={styles.hint}>Press Enter to search</p>
        </form>
      </div>
    </div>
  );
}
