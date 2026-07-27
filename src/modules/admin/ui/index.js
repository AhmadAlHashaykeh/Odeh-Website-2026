/**
 * Admin UI System — single source of truth for admin components.
 *
 * @example
 * import { Button, Badge, EmptyState, Modal } from '../ui';
 */

// Components
export { default as Button } from './components/Button';
export { default as Input } from './components/Input';
export { default as Select, MultiSelect, SearchableSelect } from './components/Select';
export { default as OverflowMenu } from './components/OverflowMenu';
export { default as Badge } from './components/Badge';
export { default as Card, StatisticCard } from './components/Card';
export { default as Modal, ConfirmationModal, ModalActions } from './components/Modal';
export { default as Drawer, DrawerHeader, DrawerFooter } from './components/Drawer';
export { default as Table } from './components/Table';
export {
  TableWrap,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
  TableTitleCell,
} from './components/Table';
export { default as Form, FormSection, FormDivider, FormField, FormRow, FormActions } from './components/Form';
export { default as EmptyState } from './components/EmptyState';
export {
  default as Skeleton,
  SkeletonStats,
  SkeletonToolbar,
  SkeletonTable,
  SkeletonCards,
  SkeletonForm,
  SkeletonList,
  SkeletonLoader,
} from './components/Skeleton';

// Hooks
export { default as useModal } from './hooks/useModal';
export { default as useDrawer } from './hooks/useDrawer';
