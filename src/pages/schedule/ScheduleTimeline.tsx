import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { scheduleTree, ScheduleActivity, flattenTree, defaultExpandedIds, fmtDateLong, TRUST_CONFIG } from '../../data/scheduleData'

const RANGE_START = new Date('2026-08-15')
const RANGE_END = new Date('2026-09-10')
const DAY_PX = 30
const TODAY = new Date('2026-08-28')
const ROW_H = 44
const HEADER_H = 36
const COL_W = 280

function dayToX(iso: string | null | undefined): number | null {
  if (!iso) return null
  const off = Math.round((new Date(iso).getTime() - RANGE_START.getTime()) / 86400000)
  return off * DAY_PX
}

function todayX(): number {
  return Math.round((TODAY.getTime() - RANGE_START.getTime()) / 86400000) * DAY_PX
}

function totalWidth(): number {
  return Math.round((RANGE_END.getTime() - RANGE_START.getTime()) / 86400000) * DAY_PX
}

function headerDates(): { label: string; x: number }[] {
  const dates: { label: string; x: number }[] = []
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const cur = new Date(RANGE_START)
  while (cur <= RANGE_END) {
    const off = Math.round((cur.getTime() - RANGE_START.getTime()) / 86400000)
    dates.push({ label: `${cur.getDate()} ${months[cur.getMonth()]}`, x: off * DAY_PX })
    cur.setDate(cur.getDate() + 7)
  }
  return dates
}

interface Props {
  onSelectActivity: (id: string) => void
  discipline: string
  area: string
}

interface TooltipData {
  activity: ScheduleActivity
  screenX: number
  screenY: number
}

function ActivityBars({
  activity,
  onSelect,
}: {
  activity: ScheduleActivity
  onSelect: (id: string) => void
}) {
  if (activity.isGroup) return null

  const BAR_H = 13
  const PLAN_Y = (ROW_H - BAR_H * 2 - 5) / 2
  const ACT_Y = PLAN_Y + BAR_H + 5
  const TW = totalWidth()
  const tX = todayX()
  const planX1 = dayToX(activity.plannedStart)
  const planX2 = dayToX(activity.plannedFinish)

  return (
    <svg
      style={{ position: 'absolute', left: 0, top: 0, width: TW, height: ROW_H, cursor: 'pointer' }}
      onClick={() => onSelect(activity.id)}
      aria-hidden="true"
    >
      {/* Planned bar */}
      {planX1 !== null && planX2 !== null && (
        <rect
          x={planX1 + 2}
          y={PLAN_Y}
          width={Math.max(4, planX2 - planX1 - 4)}
          height={BAR_H}
          rx={3}
          fill="rgba(100,116,139,0.18)"
          stroke="rgba(100,116,139,0.28)"
          strokeWidth={1}
        />
      )}

      {/* Conflict markers — small pins only, no date labels (dates shown in tooltip) */}
      {activity.actualStartConflict && activity.actualStartConflict.length > 0 && (() => {
        const conflicts = activity.actualStartConflict!
        const lastCx = dayToX(conflicts[conflicts.length - 1])
        return (
          <>
            {conflicts.map((iso, i) => {
              const cx = dayToX(iso)
              if (cx === null) return null
              return (
                <g key={i}>
                  <line
                    x1={cx + 2} y1={ACT_Y - 3}
                    x2={cx + 2} y2={ACT_Y + BAR_H + 3}
                    stroke="#DC2626" strokeWidth={1.5} strokeDasharray="3,2" opacity={0.7}
                  />
                  <circle cx={cx + 2} cy={ACT_Y + BAR_H / 2} r={4.5} fill="#DC2626" opacity={0.80} />
                </g>
              )
            })}
            {/* Single restrained indicator after the last marker */}
            {lastCx !== null && (
              <text
                x={lastCx + 15} y={ACT_Y + BAR_H / 2 + 4}
                fontSize={9} fill="#DC2626" opacity={0.72}
                fontFamily="-apple-system, BlinkMacSystemFont, Inter, sans-serif"
              >
                Conflicting start
              </text>
            )}
          </>
        )
      })()}

      {/* Actual bars — non-conflict */}
      {!activity.actualStartConflict && activity.actualStart && (() => {
        const ax1 = dayToX(activity.actualStart)
        if (ax1 === null) return null

        if (activity.actualFinish) {
          /* Verified complete with known finish — solid bar */
          const ax2 = dayToX(activity.actualFinish)
          if (ax2 === null) return null
          return (
            <rect
              x={ax1 + 2} y={ACT_Y}
              width={Math.max(4, ax2 - ax1 - 4)}
              height={BAR_H} rx={3}
              fill="#F46F29" opacity={0.85}
            />
          )
        }

        /* B3: In Progress — verified Actual Start marker + dashed continuation.
           The dashed line must NOT look like a verified Actual Finish bar. */
        return (
          <>
            <circle cx={ax1 + 2} cy={ACT_Y + BAR_H / 2} r={7} fill="rgba(244,111,41,0.18)" />
            <circle cx={ax1 + 2} cy={ACT_Y + BAR_H / 2} r={3.5} fill="#F46F29" />
            {tX > ax1 + 8 && (
              <line
                x1={ax1 + 8} y1={ACT_Y + BAR_H / 2}
                x2={tX} y2={ACT_Y + BAR_H / 2}
                stroke="#F46F29" strokeWidth={1.5}
                strokeDasharray="4,3" opacity={0.35}
              />
            )}
            <text
              x={tX + 6} y={ACT_Y + BAR_H / 2 + 4}
              fontSize={9} fill="var(--c-subtle)" fontStyle="italic"
              fontFamily="-apple-system, BlinkMacSystemFont, Inter, sans-serif"
            >
              In Progress
            </text>
          </>
        )
      })()}

      {/* AI Suggested — no actual yet */}
      {activity.trust === 'ai-suggested' && !activity.actualStart && !activity.actualStartConflict
        && planX1 !== null && (
        <text
          x={planX1 + 4} y={ACT_Y + BAR_H / 2 + 4}
          fontSize={9} fill="#7C3AED" fontStyle="italic"
          fontFamily="-apple-system, BlinkMacSystemFont, Inter, sans-serif"
        >
          Needs Review
        </text>
      )}

      {/* Missing actual */}
      {activity.trust === 'missing' && !activity.actualStart && !activity.actualStartConflict
        && planX1 !== null && (
        <text
          x={planX1 + 4} y={ACT_Y + BAR_H / 2 + 4}
          fontSize={9} fill="var(--c-subtle)" fontStyle="italic"
          fontFamily="-apple-system, BlinkMacSystemFont, Inter, sans-serif"
        >
          No actual reported
        </text>
      )}
    </svg>
  )
}

function TooltipContent({ activity }: { activity: ScheduleActivity }) {
  function fmt(iso: string | null | undefined): string {
    if (!iso) return 'Not reported'
    return fmtDateLong(iso)
  }

  const trustCfg = TRUST_CONFIG[activity.trust]
  const varianceText =
    activity.startVarianceDays === null
      ? null
      : activity.startVarianceDays === 0
      ? 'On time'
      : `${activity.startVarianceDays > 0 ? '+' : ''}${activity.startVarianceDays}d`

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Activity name — always the exact hovered row */}
      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--c-text)', letterSpacing: '-0.01em' }}>
        {activity.label}
      </span>
      <span style={{ fontSize: 11, color: 'var(--c-muted)' }}>
        {activity.discipline} · {activity.area}
      </span>

      <div style={{ marginTop: 5, paddingTop: 6, borderTop: '1px solid var(--c-border)', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {activity.actualStartConflict ? (
          /* Conflict tooltip — both dates + source labels */
          <>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#DC2626' }}>
              ⚠ Conflicting Actual Start
            </span>
            {activity.actualStartConflict.map((iso, i) => (
              <div key={iso} style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                <span style={{ fontSize: 10, color: 'var(--c-subtle)' }}>Source {i + 1}</span>
                <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--c-text)' }}>
                  {fmtDateLong(iso)}
                </span>
              </div>
            ))}
            <p style={{ fontSize: 10, color: '#D97706', fontStyle: 'italic', marginTop: 2 }}>
              Requires resolution
            </p>
          </>
        ) : (
          /* Normal leaf tooltip — exact activity data */
          <>
            {[
              { label: 'Planned Start',  value: fmt(activity.plannedStart) },
              { label: 'Planned Finish', value: fmt(activity.plannedFinish) },
              { label: 'Actual Start',   value: fmt(activity.actualStart) },
              { label: 'Actual Finish',  value: fmt(activity.actualFinish) },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                <span style={{ fontSize: 10, color: 'var(--c-subtle)' }}>{label}</span>
                <span style={{
                  fontSize: 11, fontWeight: 500,
                  color: value === 'Not reported' ? 'var(--c-subtle)' : 'var(--c-text)',
                  fontStyle: value === 'Not reported' ? 'italic' : 'normal',
                }}>
                  {value}
                </span>
              </div>
            ))}
            {varianceText && (
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                <span style={{ fontSize: 10, color: 'var(--c-subtle)' }}>Variance</span>
                <span style={{
                  fontSize: 11, fontWeight: 600,
                  color: activity.startVarianceDays === 0 ? '#16A34A' :
                         (activity.startVarianceDays ?? 0) > 0 ? '#D97706' : '#16A34A',
                }}>
                  {varianceText}
                </span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
              <span style={{ fontSize: 10, color: 'var(--c-subtle)' }}>Trust</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: trustCfg.color }}>
                {trustCfg.label}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function ScheduleTimeline({ onSelectActivity, discipline, area }: Props) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(defaultExpandedIds)
  const [tooltip, setTooltip] = useState<TooltipData | null>(null)

  function toggle(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function filterTree(items: ScheduleActivity[]): ScheduleActivity[] {
    return items
      .map((item) => {
        const children = item.children ? filterTree(item.children) : undefined
        if (children && children.length > 0) return { ...item, children }
        if (!item.isGroup) {
          if (discipline && item.discipline !== discipline) return null
          if (area && item.area !== area) return null
          return item
        }
        return null
      })
      .filter(Boolean) as ScheduleActivity[]
  }

  const filtered = discipline || area ? filterTree(scheduleTree) : scheduleTree
  const rows = flattenTree(filtered, expandedIds, 0)
  const TW = totalWidth()

  return (
    /* B5: outer container clips; inner single scroll container handles all overflow */
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
      <div style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
        {/* B5: single wide container — both columns are siblings, scroll together */}
        <div style={{ display: 'flex', width: COL_W + TW, minWidth: COL_W + TW }}>

          {/* ── Left frozen activity column ── */}
          <div
            style={{
              width: COL_W,
              flexShrink: 0,
              position: 'sticky',
              left: 0,
              zIndex: 10,
              background: 'var(--c-page)',
              borderRight: '1px solid var(--c-border)',
            }}
          >
            {/* Header — sticky top AND left */}
            <div
              style={{
                height: HEADER_H,
                position: 'sticky',
                top: 0,
                zIndex: 11,
                background: 'var(--c-page)',
                borderBottom: '1px solid var(--c-border)',
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'var(--c-subtle)',
                  letterSpacing: '0.09em',
                }}
              >
                Activity
              </span>
            </div>

            {/* Activity rows */}
            {rows.map(({ activity, depth, hasChildren, isExpanded }) => (
              <div
                key={activity.id}
                onClick={() => {
                  if (hasChildren) toggle(activity.id)
                  else onSelectActivity(activity.id)
                }}
                style={{
                  height: ROW_H,
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: 12 + depth * 18,
                  paddingRight: 12,
                  gap: 6,
                  cursor: 'pointer',
                  borderBottom: '1px solid var(--c-border)',
                  background: activity.isGroup ? 'rgba(0,0,0,0.012)' : 'transparent',
                  transition: 'background 100ms',
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLDivElement).style.background = 'var(--c-brand-tint)'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLDivElement).style.background = activity.isGroup
                    ? 'rgba(0,0,0,0.012)'
                    : 'transparent'
                }}
              >
                {hasChildren ? (
                  isExpanded ? (
                    <ChevronDown size={11} strokeWidth={2.5} style={{ color: 'var(--c-subtle)', flexShrink: 0 }} />
                  ) : (
                    <ChevronRight size={11} strokeWidth={2.5} style={{ color: 'var(--c-subtle)', flexShrink: 0 }} />
                  )
                ) : (
                  <span style={{ width: 11, flexShrink: 0 }} />
                )}
                {/* B1: system sans-serif for activity names */}
                <span
                  className="truncate"
                  style={{
                    fontSize: activity.isGroup ? 11 : 12,
                    fontWeight: activity.isGroup ? 700 : 500,
                    color: 'var(--c-text)',
                    letterSpacing: activity.isGroup ? '0.02em' : 0,
                    fontFamily: 'var(--font-ui)',
                  }}
                >
                  {activity.label}
                </span>
              </div>
            ))}
          </div>

          {/* ── Right timeline column ── */}
          <div style={{ width: TW, flexShrink: 0, position: 'relative' }}>
            {/* Date header — sticky top */}
            <div
              style={{
                height: HEADER_H,
                position: 'sticky',
                top: 0,
                zIndex: 5,
                background: 'var(--c-page)',
                borderBottom: '1px solid var(--c-border)',
              }}
            >
              {headerDates()
                .filter((d) => Math.abs(d.x - todayX()) > 56)
                .map((d) => (
                  <div
                    key={d.x}
                    style={{
                      position: 'absolute',
                      left: d.x,
                      top: 0,
                      height: HEADER_H,
                      display: 'flex',
                      alignItems: 'center',
                      paddingLeft: 6,
                    }}
                  >
                    <span style={{ fontSize: 10, color: 'var(--c-subtle)' }}>{d.label}</span>
                  </div>
                ))}

              {/* Today rule in header */}
              <div
                style={{
                  position: 'absolute',
                  left: todayX(),
                  top: 0,
                  bottom: 0,
                  width: 1,
                  background: 'rgba(244,111,41,0.50)',
                  pointerEvents: 'none',
                }}
              />
              {/* B2: "Today · 28 Aug" label */}
              <div
                style={{
                  position: 'absolute',
                  left: todayX() + 5,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: 9,
                  fontWeight: 600,
                  color: 'rgba(244,111,41,0.80)',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                  letterSpacing: '0.02em',
                }}
              >
                Today · 28 Aug
              </div>
            </div>

            {/* Today rule through rows */}
            <div
              style={{
                position: 'absolute',
                left: todayX(),
                top: HEADER_H,
                bottom: 0,
                width: 1,
                background: 'rgba(244,111,41,0.13)',
                zIndex: 4,
                pointerEvents: 'none',
              }}
            />

            {/* Bar rows */}
            {rows.map(({ activity }) => (
              <div
                key={activity.id}
                style={{
                  height: ROW_H,
                  position: 'relative',
                  borderBottom: '1px solid var(--c-border)',
                  background: activity.isGroup ? 'rgba(0,0,0,0.01)' : 'transparent',
                }}
                onMouseEnter={activity.isGroup ? undefined : (e) => {
                  const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
                  setTooltip({ activity, screenX: rect.left + 8, screenY: rect.bottom + 4 })
                }}
                onMouseLeave={activity.isGroup ? undefined : () => setTooltip(null)}
              >
                <ActivityBars activity={activity} onSelect={onSelectActivity} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          style={{
            position: 'fixed',
            left: Math.min(tooltip.screenX, window.innerWidth - 290),
            top: tooltip.screenY,
            zIndex: 60,
            background: 'var(--c-card)',
            border: '1px solid var(--c-border)',
            borderRadius: 10,
            padding: '10px 14px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.14)',
            minWidth: 230,
            maxWidth: 300,
            pointerEvents: 'none',
          }}
        >
          <TooltipContent activity={tooltip.activity} />
        </div>
      )}
    </div>
  )
}
