import { describe, expect, it } from 'vitest';
import { buildRoleStyleFromBorderColor, groupTeamMembers } from './teamMemberGroups.js';

describe('groupTeamMembers', () => {
  it('groups by CMS category display order and uses category border colours', () => {
    const members = [
      {
        slug: 'a',
        title: 'Engineer',
        category: {
          id: 'struct',
          name: 'Structural Engineering',
          slug: 'structural-engineering',
          borderColor: '#00a8c9',
          displayOrder: 4,
        },
      },
      {
        slug: 'b',
        title: 'Founder & CEO',
        category: {
          id: 'exec',
          name: 'Founders & Executive Leadership',
          slug: 'founders-executive-leadership',
          borderColor: '#c9a66b',
          displayOrder: 1,
          description: 'Strategic leadership guiding the practice.',
        },
      },
      {
        slug: 'c',
        title: 'Unknown',
      },
    ];

    const groups = groupTeamMembers(members);

    expect(groups.map((group) => group.title)).toEqual([
      'Founders & Executive Leadership',
      'Structural Engineering',
      'Other Team Members',
    ]);
    expect(groups[0].members.map((m) => m.slug)).toEqual(['b']);
    expect(groups[1].members.map((m) => m.slug)).toEqual(['a']);
    expect(groups[2].members.map((m) => m.slug)).toEqual(['c']);
    expect(groups[0].accentColor).toBe('#c9a66b');
    expect(groups[0].members[0].roleStyle.accentColor).toBe('#c9a66b');
  });

  it('builds rgba role styles from hex colours', () => {
    const style = buildRoleStyleFromBorderColor('#c9a66b');
    expect(style.accentColor).toBe('#c9a66b');
    expect(style.borderColor).toContain('201, 166, 107');
  });
});
