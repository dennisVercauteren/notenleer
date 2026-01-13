import React, { useState, useCallback, useEffect } from 'react'
import { Difficulty, NoteName } from './types'
import { DifficultySelector } from './components/DifficultySelector'
import { ClefSlider } from './components/ClefSlider'
import { AnswerButtons } from './components/AnswerButtons'
import { ScoreBar } from './components/ScoreBar'
import { ExerciseStaff } from './components/ExerciseStaff'
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
  const { highScores, isLevelUnlocked, getUnlockedLevels } = useHighScore()
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [clefRatio, setClefRatio] = useState(0.5)

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

  // Session management
  const {
    state,
    startSession,
    submitAnswer,
    isNewHighScore,
    replayCurrentNote,
  } = useTrainerSession({
    difficulty,
    clefRatio,
    onNotePlay: handleNotePlay,
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
              Kies je niveau en klik op "Start" om te beginnen
            </p>
            <p className="staff-placeholder__hint">
              🔒 Haal 10/10 om het volgende niveau te ontgrendelen
            </p>
          </div>
        )}
      </section>

      {/* Controls */}
      <section className="controls-section">
        {state.isComplete ? (
          <div className="complete-panel">
            <h2 className="complete-title">
              {isNewHighScore ? '🎉 Nieuwe Hoogste Score!' : 'Goed gedaan!'}
            </h2>
            <p className="complete-score">
              Score: <strong>{state.score}</strong> / {state.totalNotes}
            </p>
            {state.score >= 10 && (
              <p className="complete-unlock">🔓 Volgend niveau ontgrendeld!</p>
            )}
            <button className="start-button" onClick={handleRestart}>
              Opnieuw Spelen
            </button>
          </div>
        ) : state.isActive ? (
          <AnswerButtons onAnswer={handleAnswer} disabled={buttonsDisabled} />
        ) : (
          <div className="start-panel">
            <button className="start-button" onClick={handleStart}>
              Start Oefening
            </button>
          </div>
        )}
      </section>
    </main>
  )
}
