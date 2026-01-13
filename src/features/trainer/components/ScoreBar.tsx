import React from 'react'
import './ScoreBar.css'

interface ScoreBarProps {
  score: number
  currentNote: number
  totalNotes: number
}

export const ScoreBar: React.FC<ScoreBarProps> = ({
  score,
  currentNote,
  totalNotes,
}) => {
  return (
    <div className="score-bar" aria-live="polite">
      <span className="score-bar__progress">
        Vraag {currentNote}/{totalNotes}
      </span>
      <span className="score-bar__separator">•</span>
      <span className="score-bar__score">
        Score: <strong>{score}</strong>
      </span>
    </div>
  )
}
