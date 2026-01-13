import React from 'react'
import { Difficulty } from '../types'
import './DifficultySelector.css'

interface DifficultySelectorProps {
  value: Difficulty
  onChange: (difficulty: Difficulty) => void
  disabled?: boolean
  isLevelUnlocked: (difficulty: Difficulty) => boolean
  highScores: Record<Difficulty, number>
}

interface DifficultyOption {
  value: Difficulty
  label: string
  description: string
  color: string
}

const OPTIONS: DifficultyOption[] = [
  {
    value: 'easy',
    label: 'Makkelijk',
    description: 'Met labels, binnen notenbalk, met geluid',
    color: 'var(--color-easy)',
  },
  {
    value: 'lessEasy',
    label: 'Minder Makkelijk',
    description: 'Met labels, ook hulplijntjes, met geluid',
    color: '#84cc16',
  },
  {
    value: 'medium',
    label: 'Gemiddeld',
    description: 'Label na antwoord, binnen notenbalk, met geluid',
    color: 'var(--color-medium)',
  },
  {
    value: 'hard',
    label: 'Moeilijk',
    description: 'Label na antwoord, ook hulplijntjes, met geluid',
    color: '#f97316',
  },
  {
    value: 'expert',
    label: 'Expert',
    description: 'Geen labels, ook hulplijntjes, zonder geluid',
    color: 'var(--color-hard)',
  },
]

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  value,
  onChange,
  disabled = false,
  isLevelUnlocked,
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
          const isPerfect = score >= 10

          return (
            <button
              key={option.value}
              className={`difficulty-btn ${isSelected ? 'difficulty-btn--selected' : ''} ${!isUnlocked ? 'difficulty-btn--locked' : ''} ${isPerfect ? 'difficulty-btn--perfect' : ''}`}
              style={{ '--btn-color': option.color } as React.CSSProperties}
              onClick={() => isUnlocked && onChange(option.value)}
              disabled={disabled || !isUnlocked}
              role="radio"
              aria-checked={isSelected}
              title={!isUnlocked ? 'Haal eerst 10/10 op het vorige niveau' : option.description}
            >
              <div className="difficulty-btn__header">
                <span className="difficulty-btn__number">{index + 1}</span>
                {!isUnlocked && <span className="difficulty-btn__lock">🔒</span>}
                {isPerfect && <span className="difficulty-btn__star">⭐</span>}
              </div>
              <span className="difficulty-btn__label">{option.label}</span>
              {isUnlocked && (
                <span className="difficulty-btn__score">{score}/10</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
