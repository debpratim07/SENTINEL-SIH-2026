import type { SVGProps } from 'react';
import { cx, type NodeState } from './shared';
export interface FlowNodeProps extends SVGProps<SVGGElement> { state?: NodeState; x?: number; y?: number; radius?: number; shape?: 'circle' | 'square' }
/** SVG primitive: render inside an svg, or use Artwork. Coordinates use SVG units. */
export function FlowNode({ state = 'inactive', x = 0, y = 0, radius = 10, shape = 'circle', className, children, ...props }: FlowNodeProps) {
  return <g {...props} className={cx('if-node', className)} data-state={state} transform={`translate(${x} ${y})`} strokeLinecap="round" strokeLinejoin="round">
    {shape === 'circle' ? <circle className="if-node-shell" r={radius}/> : <rect className="if-node-shell" x={-radius} y={-radius} width={radius * 2} height={radius * 2} rx={radius * .4}/>}
    {state === 'complete' ? <path className="if-node-mark" d="m-4 0 3 3 5-6"/> : state === 'blocked' ? <path className="if-node-mark" d="M-4 0H4"/> : state === 'unresolved' ? <path className="if-node-mark" d="M0-4V0M0 4h.01"/> : state === 'active' ? <circle r="3" fill="currentColor" stroke="none"/> : null}
    {children}
  </g>;
}
