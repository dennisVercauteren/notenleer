import { Clef, Note, Difficulty } from '../types'
import { getAvailableNotes } from './noteRanges'

/**
 * Select a random clef based on the clef ratio
 * @param clefRatio - 0 = all fa, 1 = all sol, 0.5 = 50/50
 */
export function selectRandomClef(clefRatio: number): Clef {
  return Math.random() < clefRatio ? 'sol' : 'fa'
}

/**
 * Select a random item from an array
 */
export function randomFromArray<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * Generate a random note for the given difficulty and clef ratio
 */
export function generateRandomNote(
  difficulty: Difficulty,
  clefRatio: number
): { note: Note; clef: Clef } {
  const clef = selectRandomClef(clefRatio)
  const availableNotes = getAvailableNotes(difficulty, clef)
  const note = randomFromArray(availableNotes)
  
  return { note, clef }
}

/**
 * Generate a sequence of random notes, avoiding immediate repetition
 */
export function generateNoteSequence(
  count: number,
  difficulty: Difficulty,
  clefRatio: number
): Array<{ note: Note; clef: Clef }> {
  const sequence: Array<{ note: Note; clef: Clef }> = []
  let lastNote: Note | null = null
  
  for (let i = 0; i < count; i++) {
    let attempt = 0
    let result: { note: Note; clef: Clef }
    
    do {
      result = generateRandomNote(difficulty, clefRatio)
      attempt++
      // Avoid same note twice in a row, but don't loop forever
    } while (
      lastNote &&
      result.note.midiNote === lastNote.midiNote &&
      attempt < 10
    )
    
    sequence.push(result)
    lastNote = result.note
  }
  
  return sequence
}

/**
 * Shuffle an array in place using Fisher-Yates algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}
