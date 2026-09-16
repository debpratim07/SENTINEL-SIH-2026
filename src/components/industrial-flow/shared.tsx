import { useId, type CSSProperties, type SVGProps } from 'react';
export type NodeState = 'inactive' | 'active' | 'complete' | 'blocked' | 'unresolved';
export type PathState = 'inactive' | 'flowing' | 'complete' | 'blocked' | 'unresolved';
export type CSSVars = CSSProperties & { [key: `--${string}`]: string | number };
export interface IllustrationProps extends SVGProps<SVGSVGElement> { title?: string; animated?: boolean }
export function cx(...values: (string | undefined | false)[]) { return values.filter(Boolean).join(' '); }
export function Artwork({ title, children, className, viewBox = '0 0 320 160', animated: _animated, ...props }: IllustrationProps) {
  const id = useId();
  const label = props['aria-label'];
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} className={cx('if-illustration if-geometry', className)} role={title || label ? 'img' : undefined} aria-hidden={title || label ? undefined : true} aria-labelledby={title ? id : undefined} {...props}>
    {title && <title id={id}>{title}</title>}{children}
  </svg>;
}
