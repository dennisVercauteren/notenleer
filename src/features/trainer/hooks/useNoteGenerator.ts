import { useCallback } from 'react'
import { Note, Clef, Difficulty } from '../types'
import { generateRandomNote, generateNoteSequence } from '../utils/random'

interface UseNoteGeneratorOptions {
  difficulty: Difficulty
  clefRatio: number
}

interface UseNoteGeneratorReturn {
  generateNote: () => { note: Note; clef: Clef }
  generateSequence: (count: number) => Array<{ note: Note; clef: Clef }>
}

/**
 * Hook for generating random notes based on difficulty and clef ratio
 */
export function useNoteGenerator({
  difficulty,
  clefRatio,
}: UseNoteGeneratorOptions): UseNoteGeneratorReturn {
  const generateNote = useCallback(() => {
    return generateRandomNote(difficulty, clefRatio)
  }, [difficulty, clefRatio])

  const generateSequence = useCallback(
    (count: number) => {
      return generateNoteSequence(count, difficulty, clefRatio)
    },
    [difficulty, clefRatio]
  )

  return {
    generateNote,
    generateSequence,
  }
}
