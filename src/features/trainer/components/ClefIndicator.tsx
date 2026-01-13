import React from 'react'
import { Clef } from '../types'
import './ClefIndicator.css'

interface ClefIndicatorProps {
  clef: Clef
  size?: number
}

/**
 * SVG Treble Clef (G Clef / Vioolsleutel)
 * Positioned so the curl wraps around the G line (second line from bottom)
 */
const TrebleClef: React.FC<{ size: number }> = ({ size }) => {
  const scale = size / 100
  return (
    <g transform={`scale(${scale}) translate(-15, -50)`}>
      <path
        d="M30 80 
           C30 95, 20 105, 15 95
           C10 85, 15 70, 25 60
           C35 50, 40 35, 38 20
           C36 5, 28 -5, 25 -5
           C20 -5, 15 5, 18 20
           C20 30, 25 35, 30 30
           C35 25, 35 15, 30 10
           C25 5, 20 10, 22 18
           M30 30
           C35 40, 38 55, 35 70
           C32 85, 25 95, 20 90
           C15 85, 20 75, 28 70"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  )
}

/**
 * SVG Bass Clef (F Clef / Bassleutel)
 * Positioned so the curl and dots indicate the F line (second line from top)
 */
const BassClef: React.FC<{ size: number }> = ({ size }) => {
  const scale = size / 100
  return (
    <g transform={`scale(${scale}) translate(-10, -25)`}>
      {/* Main curve */}
      <path
        d="M15 0
           C30 0, 40 10, 40 25
           C40 45, 25 55, 10 50
           C0 47, -2 38, 5 32
           C10 28, 18 30, 18 38"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Two dots */}
      <circle cx="48" cy="15" r="4" fill="currentColor" />
      <circle cx="48" cy="35" r="4" fill="currentColor" />
    </g>
  )
}

export const ClefIndicator: React.FC<ClefIndicatorProps> = ({
  clef,
  size = 70,
}) => {
  return (
    <g className="clef-indicator" aria-label={clef === 'sol' ? 'Vioolsleutel' : 'Bassleutel'}>
      {clef === 'sol' ? <TrebleClef size={size} /> : <BassClef size={size} />}
    </g>
  )
}
