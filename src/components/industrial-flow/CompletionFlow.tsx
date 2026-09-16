import { Artwork, cx, type IllustrationProps } from './shared';
import { FlowPath } from './FlowPath';
import { FlowNode } from './FlowNode';
export function CompletionFlow({ animated = true, className, ...props }: IllustrationProps) {
 return <Artwork {...props} className={cx('if-completion',className)} data-animate={animated}><path className="if-technical" d="M44 118h232M44 42h232" strokeDasharray="2 8"/><FlowPath d="M52 80H126Q140 80 140 66V60Q140 46 154 46H194Q208 46 208 60V66Q208 80 222 80H268"/><FlowPath className="if-completion-route" pathLength={100} state="complete" d="M52 80H126Q140 80 140 66V60Q140 46 154 46H194Q208 46 208 60V66Q208 80 222 80H268"/><FlowNode x={52} y={80} state="complete"/><FlowNode x={174} y={46} radius={5} state="complete"/><circle cx="268" cy="80" r="27" stroke="var(--if-success)" opacity=".13"/><FlowNode className="if-destination" x={268} y={80} radius={13} state="complete"/></Artwork>;
}
