import type { SVGProps } from 'react';
import { cx, type CSSVars } from './shared';
export interface FlowPulseProps extends SVGProps<SVGPathElement> { animated?: boolean; loop?: boolean; duration?: number; delay?: number }
export function FlowPulse({ animated = true, loop = false, duration = 480, delay = 0, className, style, ...props }: FlowPulseProps) {
  return <path {...props} pathLength={100} aria-hidden="true" className={cx('if-flow-pulse', className)} data-animate={animated} style={{ '--if-delay': `${delay}ms`, '--if-pulse-duration': `${duration}ms`, '--if-repeat': loop ? 'infinite' : 1, ...style } as CSSVars}/>;
}
