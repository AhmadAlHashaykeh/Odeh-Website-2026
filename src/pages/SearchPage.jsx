import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AboutPageShell } from '../components/AboutSection';
import {
  InternalPageHero,
  PageContainer,
  SectionHeading,
  EmptyState,
  SearchResultCard,
} from '../components/Utility';
import { getSearchResults } from '../data/searchIndex';
import { searchContent } from '../data/searchContent';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { useScrollReveal } from '../hooks/useScrollReveal';
import styles from './SearchPage.module.css';

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
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

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(queryParam);
  const debouncedQuery = useDebouncedValue(query, 200);
  const resultsRef = useScrollReveal(0.08);

  useEffect(() => {
    setQuery(queryParam);
  }, [queryParam]);

  const results = useMemo(
    () => getSearchResults(debouncedQuery.trim()),
    [debouncedQuery],
  );

  const hasQuery = debouncedQuery.trim().length > 0;
  const hasResults = results.length > 0;

  const updateQuery = useCallback(
    (value) => {
      setQuery(value);
      const trimmed = value.trim();
      if (trimmed) {
        setSearchParams({ q: trimmed }, { replace: true });
      } else {
        setSearchParams({}, { replace: true });
      }
    },
    [setSearchParams],
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`/search?q=${encodeURIComponent(trimmed)}`, { replace: true });
  };

  const handleClear = () => {
    setQuery('');
    setSearchParams({}, { replace: true });
  };

  const { meta, hero, empty } = searchContent;

  return (
    <AboutPageShell meta={meta}>
      <InternalPageHero {...hero} />

      <PageContainer ariaLabel="Search">
        <form className={styles.searchForm} onSubmit={handleSubmit} role="search">
          <label htmlFor="search-query" className={styles.srOnly}>
            Search query
          </label>
          <div className={styles.inputWrap}>
            <span className={styles.searchIcon} aria-hidden="true">
              <SearchIcon />
            </span>
            <input
              id="search-query"
              type="search"
              className={styles.searchInput}
              placeholder="Search projects, activities, careers, pages..."
              value={query}
              onChange={(event) => updateQuery(event.target.value)}
              autoComplete="off"
            />
            {query.length > 0 && (
              <button type="button" className={styles.clearBtn} onClick={handleClear} aria-label="Clear search">
                <ClearIcon />
              </button>
            )}
          </div>
        </form>

        {hasQuery && (
          <div ref={resultsRef} className={`${styles.results} reveal`}>
            {hasResults ? (
              <>
                <SectionHeading
                  title={`${results.length} result${results.length === 1 ? '' : 's'} for "${debouncedQuery.trim()}"`}
                  as="h2"
                />
                <ul className={styles.resultList}>
                  {results.map((item, index) => (
                    <li key={item.id}>
                      <SearchResultCard
                        item={item}
                        style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
                      />
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <EmptyState
                heading={empty.heading}
                primaryLabel={empty.primaryLabel}
                primaryTo={empty.primaryTo}
              />
            )}
          </div>
        )}
      </PageContainer>
    </AboutPageShell>
  );
}
