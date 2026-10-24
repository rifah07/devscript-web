const LABEL = { DRAFT: 'draft', SCHEDULED: 'scheduled', PUBLISHED: 'published' } as const;

export function StatusChip({ status }: { status: keyof typeof LABEL }) {
  return <span className={`chip${status === 'PUBLISHED' ? ' live' : ''}`}>{LABEL[status]}</span>;
}
