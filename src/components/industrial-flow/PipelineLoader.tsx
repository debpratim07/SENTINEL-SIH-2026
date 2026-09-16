import type { HTMLAttributes } from 'react';
import { Artwork, cx } from './shared';
import { FlowNode } from './FlowNode';
import { FlowPath } from './FlowPath';
import { FlowPulse } from './FlowPulse';
export interface PipelineLoaderProps extends HTMLAttributes<HTMLSpanElement> { size?: 'sm' | 'md' | 'lg'; label?: string; animated?: boolean }
export function LoaderArtwork({ animated = true, ...props }: import('./shared').IllustrationProps) {
 return <Artwork {...props} viewBox="0 0 120 48"><FlowPath d="M16 24H42Q48 24 48 18V16Q48 10 54 10H66Q72 10 72 16V18Q72 24 78 24H104"/><FlowPulse d="M16 24H42Q48 24 48 18V16Q48 10 54 10H66Q72 10 72 16V18Q72 24 78 24H104" animated={animated} loop duration={2200}/><FlowNode x={16} y={24} radius={6} state="active"/><FlowNode x={60} y={10} radius={4}/><FlowNode x={104} y={24} radius={6}/></Artwork>;
}
export function PipelineLoader({ size = 'md', label = 'Loading', animated = true, className, style, ...props }: PipelineLoaderProps) {
 return <span {...props} role="status" className={cx('if-loader', className)} style={{ width: {sm:64,md:96,lg:144}[size], maxWidth:'100%', ...style }}><LoaderArtwork animated={animated}/><span className="if-sr-only">{label}</span></span>;
}
