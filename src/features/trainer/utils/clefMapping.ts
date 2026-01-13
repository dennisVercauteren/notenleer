import { NoteName } from '../types'

/**
 * Dutch display names for notes
 */
export const NOTE_DISPLAY_NAMES: Record<NoteName, string> = {
  do: 'Do',
  re: 'Re',
  mi: 'Mi',
  fa: 'Fa',
  sol: 'Sol',
  la: 'La',
  si: 'Si',
}

/**
 * All note names in order for answer buttons
 */
export const ALL_NOTE_NAMES: NoteName[] = ['do', 're', 'mi', 'fa', 'sol', 'la', 'si']

/**
 * Map note name to English letter (for display/reference)
 */
export const NOTE_TO_LETTER: Record<NoteName, string> = {
  do: 'C',
  re: 'D',
  mi: 'E',
  fa: 'F',
  sol: 'G',
  la: 'A',
  si: 'B',
}

/**
 * Get the full note display (e.g., "Do₄" for middle C)
 */
export function getFullNoteDisplay(name: NoteName, octave: number): string {
  const subscripts = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉']
  const subscript = subscripts[octave] || octave.toString()
  return `${NOTE_DISPLAY_NAMES[name]}${subscript}`
}
