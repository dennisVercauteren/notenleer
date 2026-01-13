import { useState, useCallback } from 'react'
import {
  SessionState,
  ExerciseNote,
  Difficulty,
  NoteName,
} from '../types'
import { generateNoteSequence } from '../utils/random'
import { useHighScore } from './useHighScore'

const DEFAULT_TOTAL_NOTES = 10
const MAX_ATTEMPTS = 2

interface UseTrainerSessionOptions {
  difficulty: Difficulty
  clefRatio: number
  totalNotes?: number
  onNotePlay?: (midiNote: number) => void
}

interface UseTrainerSessionReturn {
  state: SessionState
  startSession: () => void
  resetSession: () => void
  submitAnswer: (answer: NoteName) => void
  highScore: number
  isNewHighScore: boolean
  replayCurrentNote: () => void
}

const initialState: SessionState = {
  difficulty: 'easy',
  clefRatio: 0.5,
  totalNotes: DEFAULT_TOTAL_NOTES,
  currentNoteIndex: 0,
  score: 0,
  isActive: false,
  isComplete: false,
  notes: [],
}

/**
 * Hook for managing the trainer session state
 */
export function useTrainerSession({
  difficulty,
  clefRatio,
  totalNotes = DEFAULT_TOTAL_NOTES,
  onNotePlay,
}: UseTrainerSessionOptions): UseTrainerSessionReturn {
  const { getHighScore, updateHighScore } = useHighScore()
  const [isNewHighScore, setIsNewHighScore] = useState(false)

  const [state, setState] = useState<SessionState>(initialState)

  const highScore = getHighScore(difficulty)

  // Reset session to initial state
  const resetSession = useCallback(() => {
    setState(initialState)
    setIsNewHighScore(false)
  }, [])

  // Start a new session
  const startSession = useCallback(() => {
    const sequence = generateNoteSequence(totalNotes, difficulty, clefRatio)
    
    const notes: ExerciseNote[] = sequence.map((item, index) => ({
      note: item.note,
      clef: item.clef,
      status: index === 0 ? 'active' : 'pending',
      attempts: 0,
    }))

    setState({
      difficulty,
      clefRatio,
      totalNotes,
      currentNoteIndex: 0,
      score: 0,
      isActive: true,
      isComplete: false,
      notes,
    })

    setIsNewHighScore(false)

    // Play the first note (for easy/medium)
    if (difficulty !== 'hard' && onNotePlay && notes.length > 0) {
      setTimeout(() => {
        onNotePlay(notes[0].note.midiNote)
      }, 500)
    }
  }, [difficulty, clefRatio, totalNotes, onNotePlay])

  // Replay current note
  const replayCurrentNote = useCallback(() => {
    if (!state.isActive || state.isComplete) return
    if (difficulty === 'hard') return
    
    const currentNote = state.notes[state.currentNoteIndex]
    if (currentNote && onNotePlay) {
      onNotePlay(currentNote.note.midiNote)
    }
  }, [state, difficulty, onNotePlay])

  // Move to next note
  const moveToNextNote = useCallback(
    (newNotes: ExerciseNote[], newScore: number) => {
      const nextIndex = state.currentNoteIndex + 1

      if (nextIndex >= totalNotes) {
        // Session complete
        const finalNotes = newNotes.map((n) => ({
          ...n,
          status: n.status as ExerciseNote['status'],
        }))

        setState((prev) => ({
          ...prev,
          currentNoteIndex: nextIndex,
          score: newScore,
          isComplete: true,
          notes: finalNotes,
        }))

        const isNew = updateHighScore(difficulty, newScore)
        setIsNewHighScore(isNew)
      } else {
        // Update notes: next becomes active
        const updatedNotes = newNotes.map((n, i) => ({
          ...n,
          status: i === nextIndex ? 'active' as const : n.status,
        }))

        setState((prev) => ({
          ...prev,
          currentNoteIndex: nextIndex,
          score: newScore,
          notes: updatedNotes,
        }))

        // Play next note (for easy/medium)
        if (difficulty !== 'hard' && onNotePlay) {
          setTimeout(() => {
            onNotePlay(updatedNotes[nextIndex].note.midiNote)
          }, 400)
        }
      }
    },
    [state.currentNoteIndex, totalNotes, difficulty, onNotePlay, updateHighScore]
  )

  // Submit an answer
  const submitAnswer = useCallback(
    (answer: NoteName) => {
      if (!state.isActive || state.isComplete) return

      const currentIndex = state.currentNoteIndex
      const currentNote = state.notes[currentIndex]
      if (!currentNote) return

      const isCorrect = answer === currentNote.note.name
      const newAttempts = currentNote.attempts + 1

      let newNotes = [...state.notes]
      let newScore = state.score

      if (isCorrect) {
        // Correct answer: +1 point
        newNotes[currentIndex] = {
          ...currentNote,
          status: 'correct',
          attempts: newAttempts,
        }
        newScore += 1

        setTimeout(() => moveToNextNote(newNotes, newScore), 400)
      } else {
        // Wrong answer
        if (newAttempts >= MAX_ATTEMPTS) {
          // Second wrong: -1 point
          newNotes[currentIndex] = {
            ...currentNote,
            status: 'error',
            attempts: newAttempts,
          }
          newScore -= 1

          setTimeout(() => moveToNextNote(newNotes, newScore), 600)
        } else {
          // First wrong: warning
          newNotes[currentIndex] = {
            ...currentNote,
            status: 'warning',
            attempts: newAttempts,
          }
        }
      }

      setState((prev) => ({
        ...prev,
        notes: newNotes,
        score: newScore,
      }))
    },
    [state, moveToNextNote]
  )

  return {
    state,
    startSession,
    resetSession,
    submitAnswer,
    highScore,
    isNewHighScore,
    replayCurrentNote,
  }
}
