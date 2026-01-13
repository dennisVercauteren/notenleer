import { useRef, useCallback, useEffect } from 'react'
import * as Tone from 'tone'

interface UseAudioOptions {
  enabled?: boolean
}

interface UseAudioReturn {
  playNote: (midiNote: number) => void
  isEnabled: boolean
  initAudio: () => Promise<void>
  isLoaded: boolean
}

/**
 * Convert MIDI note number to note name for Tone.js
 * MIDI 60 = C4
 */
function midiToNoteName(midiNote: number): string {
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
  const octave = Math.floor(midiNote / 12) - 1
  const noteIndex = midiNote % 12
  return `${noteNames[noteIndex]}${octave}`
}

// Salamander Grand Piano samples URL (free, high quality)
const PIANO_SAMPLES_BASE = 'https://tonejs.github.io/audio/salamander/'

// Map of notes to sample files (subset for faster loading)
const SAMPLE_MAP: Record<string, string> = {
  'A0': 'A0.mp3',
  'C1': 'C1.mp3',
  'D#1': 'Ds1.mp3',
  'F#1': 'Fs1.mp3',
  'A1': 'A1.mp3',
  'C2': 'C2.mp3',
  'D#2': 'Ds2.mp3',
  'F#2': 'Fs2.mp3',
  'A2': 'A2.mp3',
  'C3': 'C3.mp3',
  'D#3': 'Ds3.mp3',
  'F#3': 'Fs3.mp3',
  'A3': 'A3.mp3',
  'C4': 'C4.mp3',
  'D#4': 'Ds4.mp3',
  'F#4': 'Fs4.mp3',
  'A4': 'A4.mp3',
  'C5': 'C5.mp3',
  'D#5': 'Ds5.mp3',
  'F#5': 'Fs5.mp3',
  'A5': 'A5.mp3',
  'C6': 'C6.mp3',
  'D#6': 'Ds6.mp3',
  'F#6': 'Fs6.mp3',
  'A6': 'A6.mp3',
  'C7': 'C7.mp3',
  'D#7': 'Ds7.mp3',
  'F#7': 'Fs7.mp3',
  'A7': 'A7.mp3',
  'C8': 'C8.mp3',
}

/**
 * Hook for playing piano notes using Tone.js Sampler
 * Uses real Salamander Grand Piano samples for authentic acoustic sound
 */
export function useAudio({ enabled = true }: UseAudioOptions = {}): UseAudioReturn {
  const samplerRef = useRef<Tone.Sampler | null>(null)
  const reverbRef = useRef<Tone.Reverb | null>(null)
  const isInitializedRef = useRef(false)
  const isLoadedRef = useRef(false)

  // Initialize the sampler with piano samples
  const initAudio = useCallback(async () => {
    if (isInitializedRef.current || !enabled) return

    await Tone.start()
    isInitializedRef.current = true

    // Create a subtle reverb for room ambience
    reverbRef.current = new Tone.Reverb({
      decay: 1.5,
      wet: 0.15,
    }).toDestination()

    await reverbRef.current.generate()

    // Create sampler with piano samples
    const urls: Record<string, string> = {}
    for (const [note, file] of Object.entries(SAMPLE_MAP)) {
      urls[note] = file
    }

    samplerRef.current = new Tone.Sampler({
      urls,
      baseUrl: PIANO_SAMPLES_BASE,
      release: 1,
      onload: () => {
        isLoadedRef.current = true
        console.log('Piano samples loaded')
      },
    }).connect(reverbRef.current)

  }, [enabled])

  // Play a note
  const playNote = useCallback(
    (midiNote: number) => {
      if (!enabled || !samplerRef.current) return

      const noteName = midiToNoteName(midiNote)
      
      // Trigger the note with velocity variation for natural feel
      const velocity = 0.7 + Math.random() * 0.2
      samplerRef.current.triggerAttackRelease(noteName, '2n', Tone.now(), velocity)
    },
    [enabled]
  )

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (samplerRef.current) {
        samplerRef.current.dispose()
        samplerRef.current = null
      }
      if (reverbRef.current) {
        reverbRef.current.dispose()
        reverbRef.current = null
      }
      isInitializedRef.current = false
      isLoadedRef.current = false
    }
  }, [])

  return {
    playNote,
    isEnabled: enabled,
    initAudio,
    isLoaded: isLoadedRef.current,
  }
}
