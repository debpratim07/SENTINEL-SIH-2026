import { Artwork, type IllustrationProps } from './shared';
export type EmptyStateKind = 'collection' | 'review' | 'success' | 'search' | 'activity';
export interface EmptyStateProps extends IllustrationProps { kind: EmptyStateKind }
const shapes: Record<EmptyStateKind, React.ReactNode> = {
 collection: <><path d="M52 60l28-14 28 14v35L80 109 52 95Z"/><path d="m52 60 28 14 28-14M80 74v35M67 53l28 14"/><path d="M36 80H22m116 0h-14" strokeDasharray="2 5"/></>,
 review: <><rect x="55" y="43" width="50" height="66" rx="8"/><rect x="70" y="38" width="20" height="10" rx="4" fill="var(--if-surface)"/><path d="M67 66h26M67 78h18M67 90h22M37 78h8m70 0h8"/></>,
 success: <><path d="M34 78h20m52 0h20"/><circle cx="80" cy="78" r="24"/><path d="m69 78 8 8 15-17" stroke="var(--if-success)"/><circle cx="30" cy="78" r="4"/><circle cx="130" cy="78" r="4"/></>,
 search: <><circle cx="72" cy="69" r="23"/><path d="m89 86 24 24M62 69h20M29 69h10m66 0h15"/><path d="M72 34V24" strokeDasharray="2 5"/></>,
 activity: <><circle cx="80" cy="78" r="29" strokeDasharray="3 6"/><path d="M80 58v20h17M30 78h12m76 0h12"/><circle cx="80" cy="78" r="3" fill="var(--if-line)"/></>,
};
export function EmptyState({kind,...props}: EmptyStateProps) {
 return <Artwork {...props} viewBox="0 0 160 144"><path d="M42 122h76" className="if-technical"/><g stroke="var(--if-line)" strokeWidth="2" fill="none">{shapes[kind]}</g></Artwork>;
}
