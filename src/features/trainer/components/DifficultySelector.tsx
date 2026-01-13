import React from 'react'
import { Difficulty } from '../types'
import './DifficultySelector.css'

interface DifficultySelectorProps {
  value: Difficulty
  onChange: (difficulty: Difficulty) => void
  disabled?: boolean
}

interface DifficultyOption {
  value: Difficulty
  label: string
  emoji: string
  color: string
}

const OPTIONS: DifficultyOption[] = [
  {
    value: 'easy',
    label: 'Makkelijk',
    emoji: '🟢',
    color: 'var(--color-easy)',
  },
  {
    value: 'medium',
    label: 'Gemiddeld',
    emoji: '🟡',
    color: 'var(--color-medium)',
  },
  {
    value: 'hard',
    label: 'Moeilijk',
    emoji: '🔴',
    color: 'var(--color-hard)',
  },
]

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="difficulty-selector" role="radiogroup" aria-label="Moeilijkheidsgraad">
      <span className="difficulty-selector__label">Niveau</span>
      <div className="difficulty-selector__options">
        {OPTIONS.map((option) => (
          <button
            key={option.value}
            className={`difficulty-btn ${value === option.value ? 'difficulty-btn--selected' : ''}`}
            style={{ '--btn-color': option.color } as React.CSSProperties}
            onClick={() => onChange(option.value)}
            disabled={disabled}
            role="radio"
            aria-checked={value === option.value}
          >
            <span className="difficulty-btn__emoji">{option.emoji}</span>
            <span className="difficulty-btn__label">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
