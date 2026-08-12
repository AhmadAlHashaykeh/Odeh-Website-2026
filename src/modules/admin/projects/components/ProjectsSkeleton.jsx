import { SkeletonLoader } from '../../ui';

export default function ProjectsSkeleton({ viewMode = 'table' }) {
  return (
    <SkeletonLoader
      variant="full"
      viewMode={viewMode === 'table' ? 'table' : 'project'}
      statsCount={6}
      filterCount={7}
    />
  );
}
