import React from 'react'
import { ExerciseNote, Difficulty } from '../types'
import { StaffSvg, STAFF_CONFIG } from './StaffSvg'
import { NoteSvg } from './NoteSvg'
import './ExerciseStaff.css'

interface ExerciseStaffProps {
  notes: ExerciseNote[]
  difficulty: Difficulty
  onNoteClick?: (index: number) => void
  currentIndex: number
}

/**
 * Check if audio is enabled for this difficulty
 */
function hasAudioEnabled(difficulty: Difficulty): boolean {
  return difficulty !== 'expert'
}

export const ExerciseStaff: React.FC<ExerciseStaffProps> = ({
  notes,
  difficulty,
  onNoteClick,
  currentIndex,
}) => {
  const audioEnabled = hasAudioEnabled(difficulty)

  // Calculate note positions - distribute evenly across staff
  const staffWidth = STAFF_CONFIG.width
  const notesStartX = STAFF_CONFIG.contentStartX + 30
  const notesEndX = staffWidth - STAFF_CONFIG.marginRight - 30
  const noteSpacing = (notesEndX - notesStartX) / Math.max(notes.length - 1, 1)

  // Use the clef of the current note for display
  const currentClef = notes[currentIndex]?.clef || 'sol'

  return (
    <div className="exercise-staff">
      <StaffSvg clef={currentClef}>
        {notes.map((exerciseNote, index) => {
          const x = notes.length === 1 
            ? (notesStartX + notesEndX) / 2 
            : notesStartX + index * noteSpacing

          const isCurrentNote = index === currentIndex

          return (
            <NoteSvg
              key={index}
              staffPosition={exerciseNote.note.staffPosition}
              x={x}
              status={exerciseNote.status}
              noteName={exerciseNote.note.name}
              onClick={() => onNoteClick?.(index)}
              clickable={audioEnabled && isCurrentNote}
              showLabel={exerciseNote.showLabel}
              isActive={isCurrentNote}
            />
          )
        })}
      </StaffSvg>
    </div>
  )
}
