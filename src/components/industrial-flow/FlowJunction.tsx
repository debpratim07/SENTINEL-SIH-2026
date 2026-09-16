import type { SVGProps } from 'react';
import { cx, type NodeState } from './shared';
export interface FlowJunctionProps extends SVGProps<SVGRectElement> { state?: NodeState; x?: number; y?: number }
export function FlowJunction({ state = 'inactive', x = 0, y = 0, className, ...props }: FlowJunctionProps) {
  return <rect {...props} x={x - 5} y={y - 5} width={10} height={10} rx={2} className={cx('if-junction', className)} data-state={state}/>;
}
