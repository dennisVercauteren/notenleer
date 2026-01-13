import React from 'react'
import { Clef } from '../types'
import './StaffSvg.css'

interface StaffSvgProps {
  clef: Clef
  children?: React.ReactNode
}

// Staff dimensions - larger for iPad
const STAFF_LINE_SPACING = 14 // pixels between lines
const STAFF_LINES = 5
const STAFF_HEIGHT = STAFF_LINE_SPACING * (STAFF_LINES - 1)
const STAFF_PADDING_TOP = 56
const STAFF_PADDING_BOTTOM = 56
const CLEF_WIDTH = 50
const MARGIN_LEFT = 20
const MARGIN_RIGHT = 20
const STAFF_WIDTH = 700

export const STAFF_CONFIG = {
  lineSpacing: STAFF_LINE_SPACING,
  lines: STAFF_LINES,
  staffHeight: STAFF_HEIGHT,
  paddingTop: STAFF_PADDING_TOP,
  paddingBottom: STAFF_PADDING_BOTTOM,
  clefWidth: CLEF_WIDTH,
  marginLeft: MARGIN_LEFT,
  marginRight: MARGIN_RIGHT,
  width: STAFF_WIDTH,
  centerY: STAFF_PADDING_TOP + STAFF_HEIGHT / 2,
  contentStartX: MARGIN_LEFT + CLEF_WIDTH,
}

// SMuFL codepoints for Bravura font
const CLEF_SYMBOLS = {
  sol: '\uE050', // gClef
  fa: '\uE062',  // fClef
}

const TOTAL_HEIGHT = STAFF_PADDING_TOP + STAFF_HEIGHT + STAFF_PADDING_BOTTOM

export const StaffSvg: React.FC<StaffSvgProps> = ({
  clef,
  children,
}) => {
  const staffStartY = STAFF_PADDING_TOP
  const staffLineStartX = MARGIN_LEFT
  const staffLineEndX = STAFF_WIDTH - MARGIN_RIGHT

  // Generate the 5 staff lines
  const staffLines = Array.from({ length: STAFF_LINES }, (_, i) => {
    const y = staffStartY + i * STAFF_LINE_SPACING
    return (
      <line
        key={i}
        x1={staffLineStartX}
        y1={y}
        x2={staffLineEndX}
        y2={y}
        className="staff-line"
      />
    )
  })

  // Clef position - G clef on G line (second line from bottom, index 3)
  // F clef on F line (second line from top, index 1)
  const clefY = clef === 'sol' 
    ? staffStartY + 3 * STAFF_LINE_SPACING // G line
    : staffStartY + 1 * STAFF_LINE_SPACING // F line

  return (
    <svg
      className="staff-svg"
      viewBox={`0 0 ${STAFF_WIDTH} ${TOTAL_HEIGHT}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={`Notenbalk met ${clef === 'sol' ? 'viool' : 'bas'}sleutel`}
    >
      {/* Staff lines */}
      <g className="staff-lines">{staffLines}</g>

      {/* Clef using Bravura font */}
      <text
        x={MARGIN_LEFT + 2}
        y={clefY}
        className="staff-clef"
        dominantBaseline="middle"
      >
        {CLEF_SYMBOLS[clef]}
      </text>

      {/* Notes and other children */}
      {children}
    </svg>
  )
}
