import type { SVGProps } from 'react';
import { cx, type PathState } from './shared';
export interface FlowPathProps extends SVGProps<SVGPathElement> { state?: PathState }
export function FlowPath({ state = 'inactive', className, ...props }: FlowPathProps) {
  return <path {...props} className={cx('if-flow-path', className)} data-state={state}/>;
}
