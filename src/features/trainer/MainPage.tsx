import React, { useState, useCallback } from 'react'
import { Difficulty, NoteName } from './types'
import { AnswerButtons } from './components/AnswerButtons'
import { ScoreBar } from './components/ScoreBar'
import { ExerciseStaff } from './components/ExerciseStaff'
import { SettingsDrawer } from './components/SettingsDrawer'
import { useTrainerSession } from './hooks/useTrainerSession'
import { useAudio } from './hooks/useAudio'
import { useHighScore } from './hooks/useHighScore'
import './MainPage.css'

export const MainPage: React.FC = () => {
  const { highScores } = useHighScore()
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [clefRatio, setClefRatio] = useState(1.0) // Default 100% sol
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  // Audio setup
  const audioEnabled = difficulty !== 'hard'
  const { playNote, initAudio } = useAudio({ enabled: audioEnabled })

  // Handle note play with audio init
  const handleNotePlay = useCallback(async (midiNote: number) => {
    await initAudio()
    playNote(midiNote)
  }, [initAudio, playNote])

  // Session management
  const {
    state,
    startSession,
    resetSession,
    submitAnswer,
    isNewHighScore,
    replayCurrentNote,
  } = useTrainerSession({
    difficulty,
    clefRatio,
    onNotePlay: handleNotePlay,
  })

  // Get current note
  const currentNote = state.notes[state.currentNoteIndex]

  // Start game
  const handleStart = useCallback(async () => {
    await initAudio()
    startSession()
  }, [initAudio, startSession])

  // Handle answer
  const handleAnswer = useCallback((answer: NoteName) => {
    submitAnswer(answer)
  }, [submitAnswer])

  // Handle note click for replay
  const handleNoteClick = useCallback((index: number) => {
    if (index === state.currentNoteIndex && audioEnabled) {
      replayCurrentNote()
    }
  }, [state.currentNoteIndex, audioEnabled, replayCurrentNote])

  // Handle settings open - resets session if active
  const handleSettingsOpen = useCallback(() => {
    if (state.isActive && !state.isComplete) {
      resetSession()
    }
    setIsSettingsOpen(true)
  }, [state.isActive, state.isComplete, resetSession])

  // Handle settings close
  const handleSettingsClose = useCallback(() => {
    setIsSettingsOpen(false)
  }, [])

  // Determine if buttons should be disabled
  const buttonsDisabled =
    !state.isActive ||
    state.isComplete ||
    !currentNote ||
    currentNote.status === 'correct' ||
    currentNote.status === 'error'

  return (
    <main className="trainer-layout no-select">
      {/* Header with settings */}
      <header className="trainer-header">
        {state.isActive && !state.isComplete && (
          <ScoreBar
            score={state.score}
            currentNote={state.currentNoteIndex + 1}
            totalNotes={state.totalNotes}
          />
        )}
        <button
          className="settings-button"
          onClick={handleSettingsOpen}
          aria-label="Instellingen openen"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        </button>
      </header>

      {/* Staff area */}
      <section className="trainer-staff">
        {state.isActive ? (
          <ExerciseStaff
            notes={state.notes}
            difficulty={difficulty}
            onNoteClick={handleNoteClick}
            currentIndex={state.currentNoteIndex}
          />
        ) : (
          <div className="trainer-placeholder">
            <div className="placeholder-content">
              <h1 className="placeholder-title">Notenleer</h1>
              <p className="placeholder-subtitle">Leer noten lezen op de notenbalk</p>
            </div>
          </div>
        )}
      </section>

      {/* Controls */}
      <section className="trainer-controls">
        {state.isComplete ? (
          <div className="complete-panel">
            <p className="complete-message">
              {isNewHighScore ? 'Nieuwe hoogste score!' : 'Goed gedaan!'}
            </p>
            <p className="complete-score">
              Score: <strong>{state.score}</strong> / {state.totalNotes}
            </p>
            <button className="primary-button" onClick={handleStart}>
              Opnieuw spelen
            </button>
          </div>
        ) : state.isActive ? (
          <AnswerButtons onAnswer={handleAnswer} disabled={buttonsDisabled} />
        ) : (
          <div className="start-panel">
            <div className="highscores-display">
              <span className="highscore-item">
                <small>Makkelijk</small>
                <strong className="highscore-value--easy">{highScores.easy}</strong>
              </span>
              <span className="highscore-item">
                <small>Gemiddeld</small>
                <strong className="highscore-value--medium">{highScores.medium}</strong>
              </span>
              <span className="highscore-item">
                <small>Moeilijk</small>
                <strong className="highscore-value--hard">{highScores.hard}</strong>
              </span>
            </div>
            <button className="primary-button" onClick={handleStart}>
              Start oefening
            </button>
          </div>
        )}
      </section>

      {/* Settings drawer */}
      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={handleSettingsClose}
        difficulty={difficulty}
        clefRatio={clefRatio}
        onDifficultyChange={setDifficulty}
        onClefRatioChange={setClefRatio}
      />
    </main>
  )
}
