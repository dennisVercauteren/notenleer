import React, { useEffect, useRef } from 'react'
import { Difficulty } from '../types'
import { DifficultySelector } from './DifficultySelector'
import { ClefSlider } from './ClefSlider'
import './SettingsDrawer.css'

interface SettingsDrawerProps {
  isOpen: boolean
  onClose: () => void
  difficulty: Difficulty
  clefRatio: number
  onDifficultyChange: (difficulty: Difficulty) => void
  onClefRatioChange: (ratio: number) => void
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  isOpen,
  onClose,
  difficulty,
  clefRatio,
  onDifficultyChange,
  onClefRatioChange,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null)

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      // Prevent body scroll when drawer is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  // Focus trap
  useEffect(() => {
    if (isOpen && drawerRef.current) {
      const firstButton = drawerRef.current.querySelector('button')
      firstButton?.focus()
    }
  }, [isOpen])

  if (!isOpen) {
    return null
  }

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div 
        ref={drawerRef}
        className="settings-drawer" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Instellingen"
      >
        <header className="settings-drawer__header">
          <h2 className="settings-drawer__title">Instellingen</h2>
          <button
            className="settings-drawer__close"
            onClick={onClose}
            aria-label="Instellingen sluiten"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="settings-drawer__content">
          <div className="settings-drawer__section">
            <DifficultySelector
              value={difficulty}
              onChange={onDifficultyChange}
            />
          </div>

          <div className="settings-drawer__section">
            <ClefSlider
              value={clefRatio}
              onChange={onClefRatioChange}
            />
          </div>
        </div>

        <footer className="settings-drawer__footer">
          <button className="settings-drawer__done" onClick={onClose}>
            Gereed
          </button>
        </footer>
      </div>
    </div>
  )
}
