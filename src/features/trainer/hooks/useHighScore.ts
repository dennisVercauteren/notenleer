import { useState, useCallback, useEffect } from 'react'
import { Difficulty, HighScore } from '../types'

const STORAGE_KEY = 'notenleer-highscores'

/**
 * Default highscores for all difficulty levels
 */
const DEFAULT_HIGHSCORES: HighScore = {
  easy: 0,
  medium: 0,
  hard: 0,
}

/**
 * Load highscores from localStorage
 */
function loadHighScores(): HighScore {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return {
        ...DEFAULT_HIGHSCORES,
        ...parsed,
      }
    }
  } catch (error) {
    console.error('Failed to load highscores:', error)
  }
  return DEFAULT_HIGHSCORES
}

/**
 * Save highscores to localStorage
 */
function saveHighScores(scores: HighScore): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores))
  } catch (error) {
    console.error('Failed to save highscores:', error)
  }
}

interface UseHighScoreReturn {
  highScores: HighScore
  getHighScore: (difficulty: Difficulty) => number
  updateHighScore: (difficulty: Difficulty, score: number) => boolean
  resetHighScores: () => void
}

/**
 * Hook for managing highscores with localStorage persistence
 */
export function useHighScore(): UseHighScoreReturn {
  const [highScores, setHighScores] = useState<HighScore>(DEFAULT_HIGHSCORES)

  // Load highscores on mount
  useEffect(() => {
    setHighScores(loadHighScores())
  }, [])

  // Get highscore for a specific difficulty
  const getHighScore = useCallback(
    (difficulty: Difficulty): number => {
      return highScores[difficulty]
    },
    [highScores]
  )

  // Update highscore if new score is higher
  // Returns true if highscore was updated
  const updateHighScore = useCallback(
    (difficulty: Difficulty, score: number): boolean => {
      const currentHigh = highScores[difficulty]
      if (score > currentHigh) {
        const newScores = {
          ...highScores,
          [difficulty]: score,
        }
        setHighScores(newScores)
        saveHighScores(newScores)
        return true
      }
      return false
    },
    [highScores]
  )

  // Reset all highscores
  const resetHighScores = useCallback(() => {
    setHighScores(DEFAULT_HIGHSCORES)
    saveHighScores(DEFAULT_HIGHSCORES)
  }, [])

  return {
    highScores,
    getHighScore,
    updateHighScore,
    resetHighScores,
  }
}
