/**
 * Group public team members by CMS team categories (departments/sections).
 * Card border colours come from team ranks.
 * Falls back to "Other Team Members" when category is missing.
 */

const FALLBACK_CATEGORY = {
  id: 'other-team-members',
  name: 'Other Team Members',
  slug: 'other-team-members',
  borderColor: '#7a7f85',
  displayOrder: Number.MAX_SAFE_INTEGER,
  description: null,
};

const FALLBACK_RANK_COLOR = '#7a7f85';

function hexToRgba(hex, alpha) {
  const normalized = String(hex || '').replace('#', '').trim();
  const full =
    normalized.length === 3
      ? normalized
          .split('')
          .map((part) => part + part)
          .join('')
      : normalized;

  if (!/^[0-9a-fA-F]{6}$/.test(full)) {
    return `rgba(122, 127, 133, ${alpha})`;
  }

  const value = Number.parseInt(full, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function buildRoleStyleFromBorderColor(borderColor) {
  const accent = borderColor || FALLBACK_RANK_COLOR;
  return {
    borderColor: hexToRgba(accent, 0.55),
    borderColorHover: hexToRgba(accent, 0.92),
    shadowColor: hexToRgba(accent, 0.2),
    accentColor: accent,
  };
}

function resolveMemberCategory(member) {
  if (member?.category && typeof member.category === 'object' && member.category.id) {
    return {
      id: member.category.id,
      name: member.category.name,
      slug: member.category.slug,
      borderColor: member.category.borderColor || FALLBACK_CATEGORY.borderColor,
      displayOrder:
        typeof member.category.displayOrder === 'number'
          ? member.category.displayOrder
          : FALLBACK_CATEGORY.displayOrder,
      description: member.category.description ?? null,
    };
  }

  return { ...FALLBACK_CATEGORY };
}

function resolveMemberRankColor(member) {
  if (member?.rank && typeof member.rank === 'object' && member.rank.color) {
    return member.rank.color;
  }

  return FALLBACK_RANK_COLOR;
}

/**
 * Partition members into ordered category sections.
 * Empty categories are omitted. Uncategorized members go to Other Team Members.
 * Card colours are derived from each member's rank.
 */
export function groupTeamMembers(members = []) {
  const buckets = new Map();

  members.forEach((member) => {
    const category = resolveMemberCategory(member);
    const rankColor = resolveMemberRankColor(member);
    const roleStyle = buildRoleStyleFromBorderColor(rankColor);
    const key = category.id;

    if (!buckets.has(key)) {
      buckets.set(key, {
        key,
        title: category.name,
        description: category.description,
        accentColor: category.borderColor,
        displayOrder: category.displayOrder,
        members: [],
      });
    }

    buckets.get(key).members.push({
      ...member,
      groupKey: key,
      rankColor,
      roleStyle,
    });
  });

  return [...buckets.values()].sort((a, b) => {
    if (a.displayOrder !== b.displayOrder) return a.displayOrder - b.displayOrder;
    return a.title.localeCompare(b.title);
  });
}
