/** Note names in Fixed Do notation */
export type NoteName = 'do' | 're' | 'mi' | 'fa' | 'sol' | 'la' | 'si'

/** Clef types */
export type Clef = 'sol' | 'fa'

/** Difficulty levels */
export type Difficulty = 'easy' | 'medium' | 'hard'

/** Note status during gameplay */
export type NoteStatus = 'neutral' | 'active' | 'pending' | 'warning' | 'error' | 'correct'

/** A note with its position and metadata */
export interface Note {
  /** The note name (do, re, mi, etc.) */
  name: NoteName
  /** The octave number (e.g., 4 for middle C) */
  octave: number
  /** Position on staff: 0 = middle line, positive = up, negative = down */
  staffPosition: number
  /** MIDI note number for audio playback */
  midiNote: number
}

/** A note in the exercise sequence */
export interface ExerciseNote {
  note: Note
  clef: Clef
  status: NoteStatus
  attempts: number
}

/** Game session state */
export interface SessionState {
  /** Current difficulty level */
  difficulty: Difficulty
  /** Ratio of sol clef (0 = all fa, 1 = all sol, 0.5 = 50/50) */
  clefRatio: number
  /** Total notes in session */
  totalNotes: number
  /** Current note index (0-based) */
  currentNoteIndex: number
  /** Current score */
  score: number
  /** Is session active? */
  isActive: boolean
  /** Is session complete? */
  isComplete: boolean
  /** All notes in the exercise */
  notes: ExerciseNote[]
}

/** Highscore entry */
export interface HighScore {
  easy: number
  medium: number
  hard: number
}

/** Settings for the trainer */
export interface TrainerSettings {
  difficulty: Difficulty
  clefRatio: number
}
