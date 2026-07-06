export function isClosingSoon(closingDate, withinDays = 14) {
  if (!closingDate) {
    return false;
  }

  const closing = new Date(closingDate);
  if (Number.isNaN(closing.getTime())) {
    return false;
  }

  const now = new Date();
  const diffMs = closing.getTime() - now.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  return diffDays >= 0 && diffDays <= withinDays;
}
