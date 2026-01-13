import React from 'react'
import { NoteName } from '../types'
import { ALL_NOTE_NAMES, NOTE_DISPLAY_NAMES } from '../utils/clefMapping'
import './AnswerButtons.css'

interface AnswerButtonsProps {
  onAnswer: (note: NoteName) => void
  disabled?: boolean
}

export const AnswerButtons: React.FC<AnswerButtonsProps> = ({
  onAnswer,
  disabled = false,
}) => {
  return (
    <div className="answer-buttons" role="group" aria-label="Kies een noot">
      {ALL_NOTE_NAMES.map((note) => (
        <button
          key={note}
          className="answer-button"
          onClick={() => onAnswer(note)}
          disabled={disabled}
          aria-label={`Antwoord: ${NOTE_DISPLAY_NAMES[note]}`}
        >
          {NOTE_DISPLAY_NAMES[note]}
        </button>
      ))}
    </div>
  )
}
