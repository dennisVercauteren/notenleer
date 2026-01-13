import React, { useEffect, useRef } from 'react'
import { Difficulty, DIFFICULTY_ORDER } from '../types'
import './UnlockDialog.css'

interface UnlockDialogProps {
  isOpen: boolean
  onClose: () => void
  unlockedLevel: Difficulty
}

const LEVEL_NAMES: Record<Difficulty, string> = {
  easy: 'Makkelijk',
  lessEasy: 'Minder Makkelijk',
  medium: 'Gemiddeld',
  hard: 'Moeilijk',
  expert: 'Expert',
}

export const UnlockDialog: React.FC<UnlockDialogProps> = ({
  isOpen,
  onClose,
  unlockedLevel,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null)
  const levelIndex = DIFFICULTY_ORDER.indexOf(unlockedLevel)
  const nextLevel = DIFFICULTY_ORDER[levelIndex + 1]

  useEffect(() => {
    if (isOpen) {
      // Auto-close after 3 seconds
      const timer = setTimeout(onClose, 3000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !nextLevel) return null

  return (
    <div className="unlock-overlay" onClick={onClose}>
      <div 
        ref={dialogRef}
        className="unlock-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="unlock-title"
      >
        <div className="unlock-dialog__icon">🎉</div>
        <h2 id="unlock-title" className="unlock-dialog__title">
          Hoger Niveau!
        </h2>
        <p className="unlock-dialog__message">
          Je hebt <strong>{LEVEL_NAMES[nextLevel]}</strong> ontgrendeld!
        </p>
        <div className="unlock-dialog__stars">⭐⭐⭐</div>
        <button className="unlock-dialog__button" onClick={onClose}>
          Doorgaan
        </button>
      </div>
    </div>
  )
}
