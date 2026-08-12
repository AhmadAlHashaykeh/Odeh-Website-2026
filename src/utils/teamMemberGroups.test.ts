import { describe, expect, it } from 'vitest';
import { buildRoleStyleFromBorderColor, groupTeamMembers } from './teamMemberGroups.js';

describe('groupTeamMembers', () => {
  it('groups by department and colours cards from rank', () => {
    const members = [
      {
        slug: 'a',
        title: 'Structural Engineer',
        category: {
          id: 'struct',
          name: 'Structural Engineering',
          slug: 'structural-engineering',
          borderColor: '#3DCF6A',
          displayOrder: 3,
        },
        rank: {
          id: 'engineer',
          name: 'Engineer',
          slug: 'engineer',
          color: '#3DCF6A',
        },
      },
      {
        slug: 'b',
        title: 'Founder & CEO',
        category: {
          id: 'board',
          name: 'Board of Directors',
          slug: 'board-of-directors',
          borderColor: '#1B4F9C',
          displayOrder: 1,
        },
        rank: {
          id: 'exec',
          name: 'Founder & Executive',
          slug: 'founder-executive',
          color: '#1B4F9C',
        },
      },
      {
        slug: 'c',
        title: 'Unknown',
      },
    ];

    const groups = groupTeamMembers(members);

    expect(groups.map((group) => group.title)).toEqual([
      'Board of Directors',
      'Structural Engineering',
      'Team Members',
    ]);
    expect(groups[0].members.map((m: { slug: string }) => m.slug)).toEqual(['b']);
    expect(groups[1].members.map((m: { slug: string }) => m.slug)).toEqual(['a']);
    expect(groups[2].members.map((m: { slug: string }) => m.slug)).toEqual(['c']);
    expect(groups[0].accentColor).toBe('#1B4F9C');
    expect(groups[0].members[0].roleStyle.accentColor).toBe('#1B4F9C');
    expect(groups[1].members[0].roleStyle.accentColor).toBe('#3DCF6A');
  });

  it('builds rgba role styles from hex colours', () => {
    const style = buildRoleStyleFromBorderColor('#c9a66b');
    expect(style.accentColor).toBe('#c9a66b');
    expect(style.borderColor).toContain('201, 166, 107');
  });
});
