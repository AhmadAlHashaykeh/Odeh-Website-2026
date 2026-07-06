import { fetchTotalCount } from '../../../api/utils';

export async function buildCountStatistics(listFn, cards) {
  const results = await Promise.all(
    cards.map(async (card) => {
      try {
        const value = await fetchTotalCount(listFn, card.params || {});
        return { ...card, value };
      } catch {
        return { ...card, value: 0 };
      }
    }),
  );

  return results.map(({ id, label, value, helper }) => ({
    id,
    label,
    value,
    helper,
  }));
}
