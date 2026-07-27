import { OverflowMenu } from '../../ui';

export default function SeoOverflowMenu({ items, ariaLabel = 'More actions' }) {
  return (
    <OverflowMenu
      items={items}
      ariaLabel={ariaLabel}
      onAction={(_id, item) => item?.onClick?.()}
    />
  );
}
