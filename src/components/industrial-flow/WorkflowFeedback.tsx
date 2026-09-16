import { AlertCircle } from 'lucide-react'
import { LoaderArtwork } from './PipelineLoader'
import { EmptyState } from './EmptyState'

export function WorkflowLoading({ children }: { children: React.ReactNode }) {
  return <div className="workflow-loading" role="status"><LoaderArtwork className="workflow-loader-art"/><span>{children}</span></div>
}

export function WorkflowEmpty({ title, children, kind = 'collection' }: { title: string; children?: React.ReactNode; kind?: 'collection' | 'review' | 'search' | 'activity' }) {
  return <div className="workflow-empty"><EmptyState kind={kind}/><h2>{title}</h2>{children && <p>{children}</p>}</div>
}

export function WorkflowError({ children, onRetry }: { children: React.ReactNode; onRetry?: () => void }) {
  return <div className="workflow-error" role="alert"><AlertCircle size={18} aria-hidden="true"/><div>{children}{onRetry && <button onClick={onRetry}>Try again</button>}</div></div>
}

// A static workflow map, never a claim that an event has completed a stage.
export function ExecutionFlow() {
  const stages = [['Capture', 'Original field evidence'], ['Review', 'Inspect the observation'], ['Human verification', 'Select an eligible L6'], ['Schedule truth', 'Persist the approved date'], ['Verified actuals', 'Read confirmed execution'], ['Auditable history', 'Trace connected actions']]
  return <ol className="execution-flow" aria-label="SENTINEL verification workflow">{stages.map(([title, detail], index) => <li key={title}><span className="execution-node" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><div><strong>{title}</strong><span>{detail}</span></div></li>)}</ol>
}
