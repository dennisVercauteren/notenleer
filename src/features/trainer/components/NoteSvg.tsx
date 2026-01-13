import React from 'react'
import { NoteStatus, NoteName } from '../types'
import { STAFF_CONFIG } from './StaffSvg'
import { getLedgerLinePositions } from '../utils/noteRanges'
import { NOTE_DISPLAY_NAMES } from '../utils/clefMapping'
import './NoteSvg.css'

interface NoteSvgProps {
  /** Staff position: 0 = middle line, positive = up, negative = down */
  staffPosition: number
  /** X position for the note */
  x: number
  /** Note status for coloring */
  status: NoteStatus
  /** Note name for label */
  noteName: NoteName
  /** Click handler */
  onClick?: () => void
  /** Whether this note is clickable */
  clickable?: boolean
  /** Whether to show the note label below */
  showLabel?: boolean
  /** Whether this is the active/current note */
  isActive?: boolean
}

// Note dimensions - larger for better visibility on iPad
const NOTE_RX = 10 // Horizontal radius
const NOTE_RY = 7.5 // Vertical radius
const NOTE_ROTATION = -18 // Slight tilt
const LEDGER_LINE_WIDTH = 28

export const NoteSvg: React.FC<NoteSvgProps> = ({
  staffPosition,
  x,
  status,
  noteName,
  onClick,
  clickable = false,
  showLabel = false,
  isActive = false,
}) => {
  const { lineSpacing, centerY, paddingTop, staffHeight } = STAFF_CONFIG
  
  // Calculate Y position from staff position
  const noteY = centerY - (staffPosition * lineSpacing / 2)
  
  // Fixed Y position for labels - below the staff, horizontally aligned
  const labelY = paddingTop + staffHeight + 24

  // Get ledger lines needed for this position
  const ledgerLinePositions = getLedgerLinePositions(staffPosition)

  // Determine color based on status
  let fillColor: string
  switch (status) {
    case 'correct':
      fillColor = 'var(--color-note-correct)'
      break
    case 'warning':
      fillColor = 'var(--color-note-warning)'
      break
    case 'error':
      fillColor = 'var(--color-note-error)'
      break
    case 'pending':
      fillColor = 'var(--color-note-pending, #ccc)'
      break
    default:
      fillColor = 'var(--color-note)'
  }

  const handleClick = () => {
    if (clickable && onClick) {
      onClick()
    }
  }

  const isCorrect = status === 'correct'

  return (
    <g 
      className={`note-group ${clickable ? 'note--clickable' : ''} ${isCorrect ? 'note-group--correct' : ''} ${isActive ? 'note--active' : ''}`}
      style={{ '--note-color': fillColor } as React.CSSProperties}
      onClick={handleClick}
    >
      {/* Ledger lines */}
      {ledgerLinePositions.map((pos) => {
        const ledgerY = centerY - (pos * lineSpacing / 2)
        return (
          <line
            key={pos}
            x1={x - LEDGER_LINE_WIDTH / 2}
            y1={ledgerY}
            x2={x + LEDGER_LINE_WIDTH / 2}
            y2={ledgerY}
            className="ledger-line"
          />
        )
      })}

      {/* Note head as ellipse */}
      <ellipse
        cx={x}
        cy={noteY}
        rx={NOTE_RX}
        ry={NOTE_RY}
        transform={`rotate(${NOTE_ROTATION} ${x} ${noteY})`}
        className="note-head"
      />

      {/* Label at fixed Y below staff, aligned under note */}
      {showLabel && (
        <text
          x={x}
          y={labelY}
          className="note-label-svg"
          textAnchor="middle"
          dominantBaseline="hanging"
        >
          {NOTE_DISPLAY_NAMES[noteName]}
        </text>
      )}
    </g>
  )
}
