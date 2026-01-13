import React, { useState, useCallback, useEffect } from 'react'
import { Difficulty, NoteName } from './types'
import { DifficultySelector } from './components/DifficultySelector'
import { ClefSlider } from './components/ClefSlider'
import { AnswerButtons } from './components/AnswerButtons'
import { ScoreBar } from './components/ScoreBar'
import { ExerciseStaff } from './components/ExerciseStaff'
import { UnlockDialog } from './components/UnlockDialog'
import { useTrainerSession } from './hooks/useTrainerSession'
import { useAudio } from './hooks/useAudio'
import { useHighScore } from './hooks/useHighScore'
import './MainPage.css'

/**
 * Check if audio is enabled for this difficulty
 */
function hasAudioEnabled(difficulty: Difficulty): boolean {
  return difficulty !== 'expert'
}

export const MainPage: React.FC = () => {
  const { highScores, isLevelUnlocked, getUnlockedLevels, addScore, getProgress } = useHighScore()
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [clefRatio, setClefRatio] = useState(0.5)
  const [showUnlockDialog, setShowUnlockDialog] = useState(false)

  // Ensure selected difficulty is unlocked
  useEffect(() => {
    const unlockedLevels = getUnlockedLevels()
    if (!unlockedLevels.includes(difficulty)) {
      setDifficulty(unlockedLevels[unlockedLevels.length - 1] || 'easy')
    }
  }, [difficulty, getUnlockedLevels])

  // Audio setup
  const audioEnabled = hasAudioEnabled(difficulty)
  const { playNote, initAudio } = useAudio({ enabled: audioEnabled })

  // Handle note play with audio init
  const handleNotePlay = useCallback(async (midiNote: number) => {
    if (!audioEnabled) return
    await initAudio()
    playNote(midiNote)
  }, [initAudio, playNote, audioEnabled])

  // Handle score addition and check for level unlock
  const handleScoreAdd = useCallback((score: number): boolean => {
    const didUnlock = addScore(difficulty, score)
    if (didUnlock) {
      setShowUnlockDialog(true)
    }
    return didUnlock
  }, [addScore, difficulty])

  // Session management
  const {
    state,
    startSession,
    submitAnswer,
    replayCurrentNote,
    levelUnlocked,
  } = useTrainerSession({
    difficulty,
    clefRatio,
    onNotePlay: handleNotePlay,
    onScoreAdd: handleScoreAdd,
  })

  // Start game
  const handleStart = useCallback(async () => {
    if (audioEnabled) {
      await initAudio()
    }
    startSession()
  }, [initAudio, startSession, audioEnabled])

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

  // Restart
  const handleRestart = useCallback(async () => {
    if (audioEnabled) {
      await initAudio()
    }
    startSession()
  }, [initAudio, startSession, audioEnabled])

  // Close unlock dialog
  const handleCloseUnlockDialog = useCallback(() => {
    setShowUnlockDialog(false)
  }, [])

  // Determine if buttons should be disabled
  const currentNote = state.notes[state.currentNoteIndex]
  const buttonsDisabled =
    !state.isActive ||
    state.isComplete ||
    !currentNote ||
    currentNote.status === 'correct' ||
    currentNote.status === 'error'

  return (
    <main className="main-page">
      {/* Header */}
      <header className="main-header">
        <h1 className="main-title">
          <span className="main-title__icon">🎵</span>
          Notenleer
        </h1>
      </header>

      {/* Settings Panel */}
      <section className="settings-panel">
        <div className="settings-row">
          <div className="settings-group settings-group--difficulty">
            <DifficultySelector 
              value={difficulty} 
              onChange={setDifficulty}
              disabled={state.isActive && !state.isComplete}
              isLevelUnlocked={isLevelUnlocked}
              getProgress={getProgress}
              highScores={highScores}
            />
          </div>

          <div className="settings-group settings-group--clef">
            <ClefSlider 
              value={clefRatio} 
              onChange={setClefRatio}
              disabled={state.isActive && !state.isComplete}
            />
          </div>
        </div>
      </section>

      {/* Score Display */}
      {state.isActive && (
        <section className="score-section">
          <ScoreBar
            score={state.score}
            currentNote={Math.min(state.currentNoteIndex + 1, state.totalNotes)}
            totalNotes={state.totalNotes}
          />
        </section>
      )}

      {/* Staff with Notes */}
      <section className="staff-section">
        {state.isActive ? (
          <ExerciseStaff
            notes={state.notes}
            difficulty={difficulty}
            onNoteClick={handleNoteClick}
            currentIndex={state.currentNoteIndex}
          />
        ) : (
          <div className="staff-placeholder">
            <p className="staff-placeholder__text">
              Kies je niveau en klik op "Start"
            </p>
            <p className="staff-placeholder__hint">
              🎯 Verzamel 50 punten om het volgende niveau te ontgrendelen
            </p>
          </div>
        )}
      </section>

      {/* Controls */}
      <section className="controls-section">
        {state.isComplete ? (
          <div className="complete-panel">
            <p className="complete-score">
              +<strong>{state.score}</strong> punten
            </p>
            <button className="start-button" onClick={handleRestart}>
              Opnieuw
            </button>
          </div>
        ) : state.isActive ? (
          <AnswerButtons onAnswer={handleAnswer} disabled={buttonsDisabled} />
        ) : (
          <button className="start-button" onClick={handleStart}>
            Start
          </button>
        )}
      </section>

      {/* Unlock Dialog */}
      <UnlockDialog
        isOpen={showUnlockDialog || levelUnlocked}
        onClose={handleCloseUnlockDialog}
        unlockedLevel={difficulty}
      />
    </main>
  )
}
