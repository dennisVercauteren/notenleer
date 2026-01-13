import { Note, NoteName, Difficulty, Clef } from '../types'

/**
 * Note mapping: staffPosition -> [noteName, octave]
 * Position 0 = center line of the staff (B4 for treble, D3 for bass)
 * Positive = up, Negative = down
 */

/** Map of note names to their semitone offset within an octave */
const NOTE_SEMITONES: Record<NoteName, number> = {
  do: 0,  // C
  re: 2,  // D
  mi: 4,  // E
  fa: 5,  // F
  sol: 7, // G
  la: 9,  // A
  si: 11, // B
}

/** Sequence of notes in an octave */
const NOTE_SEQUENCE: NoteName[] = ['do', 're', 'mi', 'fa', 'sol', 'la', 'si']

/**
 * Get note name from position within the 7-note cycle
 * Position 0 = do, 1 = re, etc.
 */
function getNoteNameFromIndex(index: number): NoteName {
  // Handle negative indices by wrapping around
  const normalized = ((index % 7) + 7) % 7
  return NOTE_SEQUENCE[normalized]
}

/**
 * Calculate MIDI note number
 * Middle C (C4/do4) = MIDI 60
 */
function calculateMidiNote(noteName: NoteName, octave: number): number {
  return 12 + (octave * 12) + NOTE_SEMITONES[noteName]
}

/**
 * Generate a note from staff position for treble clef (sol)
 * In treble clef:
 * - Position 0 (middle line) = B4 (si4)
 * - Position -4 (bottom line) = E4 (mi4)
 * - Position 4 (top line) = F5 (fa5)
 */
function trebleClefNote(position: number): Note {
  // Treble clef position 0 = B4 (si4)
  // B is index 6 in NOTE_SEQUENCE, octave 4
  // Each position step is a half step on the staff
  const baseNoteIndex = 6 // si
  const baseOctave = 4
  
  const noteIndex = baseNoteIndex + position
  const octaveOffset = Math.floor(noteIndex / 7)
  const noteName = getNoteNameFromIndex(noteIndex)
  const octave = baseOctave + octaveOffset
  
  return {
    name: noteName,
    octave,
    staffPosition: position,
    midiNote: calculateMidiNote(noteName, octave),
  }
}

/**
 * Generate a note from staff position for bass clef (fa)
 * In bass clef:
 * - Position 0 (middle line) = D3 (re3)
 * - Position -4 (bottom line) = G2 (sol2)
 * - Position 4 (top line) = A3 (la3)
 */
function bassClefNote(position: number): Note {
  // Bass clef position 0 = D3 (re3)
  // D is index 1 in NOTE_SEQUENCE, octave 3
  const baseNoteIndex = 1 // re
  const baseOctave = 3
  
  const noteIndex = baseNoteIndex + position
  const octaveOffset = Math.floor(noteIndex / 7)
  const noteName = getNoteNameFromIndex(noteIndex)
  const octave = baseOctave + octaveOffset
  
  return {
    name: noteName,
    octave,
    staffPosition: position,
    midiNote: calculateMidiNote(noteName, octave),
  }
}

/**
 * Get a note from a staff position for a given clef
 */
export function getNote(position: number, clef: Clef): Note {
  return clef === 'sol' ? trebleClefNote(position) : bassClefNote(position)
}

/**
 * Get available staff positions for a difficulty level
 * 
 * Easy: Only within staff (positions -4 to 4)
 * Medium: Within staff + 1-2 ledger lines (positions -7 to 7)
 * Hard: Extended range with multiple ledger lines (positions -10 to 10)
 */
export function getPositionRange(difficulty: Difficulty): { min: number; max: number } {
  switch (difficulty) {
    case 'easy':
      // Notes within the 5 lines and 4 spaces of the staff
      return { min: -4, max: 4 }
    case 'medium':
      // Include 1-2 ledger lines above and below
      return { min: -7, max: 7 }
    case 'hard':
      // Extended range with multiple ledger lines
      return { min: -10, max: 10 }
  }
}

/**
 * Get all available notes for a difficulty and clef
 */
export function getAvailableNotes(difficulty: Difficulty, clef: Clef): Note[] {
  const { min, max } = getPositionRange(difficulty)
  const notes: Note[] = []
  
  for (let pos = min; pos <= max; pos++) {
    notes.push(getNote(pos, clef))
  }
  
  return notes
}

/**
 * Check if a position needs ledger lines
 * Returns the number of ledger lines needed (0 if within staff)
 */
export function getLedgerLineCount(position: number): number {
  // Staff spans positions -4 to 4 (lines at -4, -2, 0, 2, 4)
  if (position >= -4 && position <= 4) {
    return 0
  }
  
  if (position > 4) {
    // Above staff: first ledger line at position 6
    return Math.ceil((position - 4) / 2)
  } else {
    // Below staff: first ledger line at position -6
    return Math.ceil((-4 - position) / 2)
  }
}

/**
 * Get positions of ledger lines for a note
 */
export function getLedgerLinePositions(position: number): number[] {
  const positions: number[] = []
  
  if (position > 4) {
    // Above staff
    for (let p = 6; p <= position; p += 2) {
      positions.push(p)
    }
    // Also add ledger line if note is on a space above the last line
    if (position > 4 && position % 2 === 1) {
      // Note is on a space, don't need extra ledger line
    }
  } else if (position < -4) {
    // Below staff
    for (let p = -6; p >= position; p -= 2) {
      positions.push(p)
    }
  }
  
  return positions
}
