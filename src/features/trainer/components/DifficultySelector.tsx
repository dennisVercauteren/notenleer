import React from 'react'
import { Difficulty } from '../types'
import './DifficultySelector.css'

interface DifficultySelectorProps {
  value: Difficulty
  onChange: (difficulty: Difficulty) => void
  disabled?: boolean
  isLevelUnlocked: (difficulty: Difficulty) => boolean
  getProgress: (difficulty: Difficulty) => number
  highScores: Record<Difficulty, number>
}

interface DifficultyOption {
  value: Difficulty
  label: string
  color: string
}

const UNLOCK_THRESHOLD = 50

const OPTIONS: DifficultyOption[] = [
  { value: 'easy', label: 'Makkelijk', color: '#16a34a' },
  { value: 'lessEasy', label: 'Minder Makkelijk', color: '#84cc16' },
  { value: 'medium', label: 'Gemiddeld', color: '#f59e0b' },
  { value: 'hard', label: 'Moeilijk', color: '#f97316' },
  { value: 'expert', label: 'Expert', color: '#dc2626' },
]

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  value,
  onChange,
  disabled = false,
  isLevelUnlocked,
  getProgress,
  highScores,
}) => {
  return (
    <div className="difficulty-selector" role="radiogroup" aria-label="Moeilijkheidsgraad">
      <span className="difficulty-selector__label">Niveau</span>
      <div className="difficulty-selector__options">
        {OPTIONS.map((option, index) => {
          const isUnlocked = isLevelUnlocked(option.value)
          const isSelected = value === option.value
          const score = highScores[option.value]
          const progress = getProgress(option.value)
          const isComplete = score >= UNLOCK_THRESHOLD

          return (
            <button
              key={option.value}
              className={`difficulty-btn ${isSelected ? 'difficulty-btn--selected' : ''} ${!isUnlocked ? 'difficulty-btn--locked' : ''} ${isComplete ? 'difficulty-btn--complete' : ''}`}
              style={{ '--btn-color': option.color } as React.CSSProperties}
              onClick={() => isUnlocked && onChange(option.value)}
              disabled={disabled || !isUnlocked}
              role="radio"
              aria-checked={isSelected}
              title={!isUnlocked ? 'Haal 50 punten op het vorige niveau' : `${score}/${UNLOCK_THRESHOLD} punten`}
            >
              <span className="difficulty-btn__number">{index + 1}</span>
              {!isUnlocked && <span className="difficulty-btn__lock">🔒</span>}
              {isComplete && <span className="difficulty-btn__star">⭐</span>}
              <span className="difficulty-btn__label">{option.label}</span>
              {isUnlocked && (
                <div className="difficulty-btn__progress">
                  <div 
                    className="difficulty-btn__progress-bar"
                    style={{ width: `${progress}%` }}
                  />
                  <span className="difficulty-btn__score">{score}/{UNLOCK_THRESHOLD}</span>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
