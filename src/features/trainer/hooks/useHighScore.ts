import { useState, useCallback, useEffect } from 'react'
import { Difficulty, HighScore, DIFFICULTY_ORDER } from '../types'

const STORAGE_KEY = 'notenleer-highscores'
const PERFECT_SCORE = 10

/**
 * Default highscores for all difficulty levels
 */
const DEFAULT_HIGHSCORES: HighScore = {
  easy: 0,
  lessEasy: 0,
  medium: 0,
  hard: 0,
  expert: 0,
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
  isLevelUnlocked: (difficulty: Difficulty) => boolean
  getUnlockedLevels: () => Difficulty[]
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

  // Check if a level is unlocked
  // A level is unlocked if the previous level has a perfect score (10/10)
  const isLevelUnlocked = useCallback(
    (difficulty: Difficulty): boolean => {
      const levelIndex = DIFFICULTY_ORDER.indexOf(difficulty)
      
      // First level is always unlocked
      if (levelIndex === 0) return true
      
      // Check if previous level has perfect score
      const previousLevel = DIFFICULTY_ORDER[levelIndex - 1]
      return highScores[previousLevel] >= PERFECT_SCORE
    },
    [highScores]
  )

  // Get list of unlocked levels
  const getUnlockedLevels = useCallback((): Difficulty[] => {
    return DIFFICULTY_ORDER.filter(level => isLevelUnlocked(level))
  }, [isLevelUnlocked])

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
    isLevelUnlocked,
    getUnlockedLevels,
  }
}
