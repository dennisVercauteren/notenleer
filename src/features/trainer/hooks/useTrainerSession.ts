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
 * Check if difficulty shows labels from the start
 */
function showsLabelsFromStart(difficulty: Difficulty): boolean {
  return difficulty === 'easy' || difficulty === 'lessEasy'
}

/**
 * Check if difficulty shows labels after answering (for previous note)
 */
function showsLabelsAfterAnswer(difficulty: Difficulty): boolean {
  return difficulty === 'medium' || difficulty === 'hard'
}

/**
 * Check if difficulty has audio enabled
 */
function hasAudioEnabled(difficulty: Difficulty): boolean {
  return difficulty !== 'expert'
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
  const audioEnabled = hasAudioEnabled(difficulty)

  // Start a new session
  const startSession = useCallback(() => {
    const sequence = generateNoteSequence(totalNotes, difficulty, clefRatio)
    
    // Determine initial label visibility based on difficulty
    const labelsVisible = showsLabelsFromStart(difficulty)
    
    const notes: ExerciseNote[] = sequence.map((item, index) => ({
      note: item.note,
      clef: item.clef,
      status: index === 0 ? 'active' : 'pending',
      attempts: 0,
      showLabel: labelsVisible,
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

    // Play the first note (if audio enabled)
    if (audioEnabled && onNotePlay && notes.length > 0) {
      setTimeout(() => {
        onNotePlay(notes[0].note.midiNote)
      }, 500)
    }
  }, [difficulty, clefRatio, totalNotes, onNotePlay, audioEnabled])

  // Replay current note
  const replayCurrentNote = useCallback(() => {
    if (!state.isActive || state.isComplete) return
    if (!audioEnabled) return
    
    const currentNote = state.notes[state.currentNoteIndex]
    if (currentNote && onNotePlay) {
      onNotePlay(currentNote.note.midiNote)
    }
  }, [state, audioEnabled, onNotePlay])

  // Move to next note
  const moveToNextNote = useCallback(
    (newNotes: ExerciseNote[], newScore: number, revealPreviousLabel: boolean) => {
      const nextIndex = state.currentNoteIndex + 1

      // If medium/hard, reveal the label of the answered note
      if (revealPreviousLabel) {
        newNotes[state.currentNoteIndex] = {
          ...newNotes[state.currentNoteIndex],
          showLabel: true,
        }
      }

      if (nextIndex >= totalNotes) {
        // Session complete
        setState((prev) => ({
          ...prev,
          currentNoteIndex: nextIndex,
          score: newScore,
          isComplete: true,
          notes: newNotes,
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

        // Play next note (if audio enabled)
        if (audioEnabled && onNotePlay) {
          setTimeout(() => {
            onNotePlay(updatedNotes[nextIndex].note.midiNote)
          }, 400)
        }
      }
    },
    [state.currentNoteIndex, totalNotes, difficulty, onNotePlay, updateHighScore, audioEnabled]
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
      const revealLabel = showsLabelsAfterAnswer(difficulty)

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

        setTimeout(() => moveToNextNote(newNotes, newScore, revealLabel), 400)
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

          setTimeout(() => moveToNextNote(newNotes, newScore, revealLabel), 600)
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
    [state, moveToNextNote, difficulty]
  )

  return {
    state,
    startSession,
    submitAnswer,
    highScore,
    isNewHighScore,
    replayCurrentNote,
  }
}
