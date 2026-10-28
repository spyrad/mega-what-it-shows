<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  import { problemsOf, type Problem } from '#lib/kb/problems';

  // `tickets`: where each problem is filed now, as a link.
  let { ticket, tickets = {} }: { ticket: number; tickets?: Partial<Record<Problem, string>> } = $props();

  const rows = $derived(reports as Report[]);
  const groups = $derived(problemsOf(rows, ticket, tenantOf, notes.oneDayMove));
  const total = $derived(groups.reduce((n, g) => n + g.reports.length, 0));
  const twice = $derived(rows.length - new Set(rows.map((r) => r.id)).size);
  const channels = (g: { channels: Record<string, number> }) =>
    Object.entries(g.channels)
      .sort((a, b) => b[1] - a[1])
      .map(([c, n]) => `${c} ×${n}`)
      .join(' · ');
  const issueNo = (href: string) => `#${href.split('/').pop()}`;
</script>

<p class="sum">
  <strong>{total}</strong> reports merged into #{ticket} ·
  <strong>{groups.length}</strong>
  {groups.length === 1 ? 'problem' : 'problems'}
  {#if twice}<span class="note">· {twice} export rows were the same report twice, counted once</span>{/if}
</p>

<table>
  <thead>
    <tr><th>problem</th><th>reports</th><th>channels</th><th>tenants</th><th>seen</th><th>ticket</th></tr>
  </thead>
  <tbody>
    {#each groups as g (g.problem)}
      <tr>
        <td><code>{g.problem}</code></td>
        <td>{g.reports.length}</td>
        <td class="note">{channels(g)}</td>
        <td>{g.tenants}</td>
        <td>{g.firstSeen} → {g.lastSeen}</td>
        <td>
          {#if tickets[g.problem]}<a href={tickets[g.problem]}>{issueNo(tickets[g.problem]!)}</a>{:else}<span class="open">no ticket</span>{/if}
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  .sum { font-size: 1.1rem; }
  .note { color: var(--muted); font-size: 0.85em; }
  .open { color: var(--warn); font-weight: 600; }
</style>
