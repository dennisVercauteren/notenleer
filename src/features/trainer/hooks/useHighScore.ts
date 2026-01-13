import { useState, useCallback, useEffect } from 'react'
import { Difficulty, HighScore, DIFFICULTY_ORDER } from '../types'

const STORAGE_KEY = 'notenleer-highscores'
const UNLOCK_THRESHOLD = 50 // 50 points cumulative to unlock next level

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
  addScore: (difficulty: Difficulty, score: number) => boolean
  resetHighScores: () => void
  isLevelUnlocked: (difficulty: Difficulty) => boolean
  getUnlockedLevels: () => Difficulty[]
  getProgress: (difficulty: Difficulty) => number
}

/**
 * Hook for managing cumulative scores with localStorage persistence
 * Players need 50 points total on a level to unlock the next
 */
export function useHighScore(): UseHighScoreReturn {
  const [highScores, setHighScores] = useState<HighScore>(DEFAULT_HIGHSCORES)

  // Load highscores on mount
  useEffect(() => {
    setHighScores(loadHighScores())
  }, [])

  // Get cumulative score for a specific difficulty
  const getHighScore = useCallback(
    (difficulty: Difficulty): number => {
      return highScores[difficulty]
    },
    [highScores]
  )

  // Add score to cumulative total
  // Returns true if this caused a level unlock
  const addScore = useCallback(
    (difficulty: Difficulty, score: number): boolean => {
      if (score <= 0) return false
      
      const previousTotal = highScores[difficulty]
      const newTotal = previousTotal + score
      const wasUnlocked = previousTotal >= UNLOCK_THRESHOLD
      const isNowUnlocked = newTotal >= UNLOCK_THRESHOLD
      
      const newScores = {
        ...highScores,
        [difficulty]: newTotal,
      }
      setHighScores(newScores)
      saveHighScores(newScores)
      
      // Return true if this score caused a new unlock
      return !wasUnlocked && isNowUnlocked
    },
    [highScores]
  )

  // Get progress towards unlock (0-100%)
  const getProgress = useCallback(
    (difficulty: Difficulty): number => {
      const score = highScores[difficulty]
      return Math.min(100, Math.round((score / UNLOCK_THRESHOLD) * 100))
    },
    [highScores]
  )

  // Check if a level is unlocked
  // A level is unlocked if the previous level has 50+ points
  const isLevelUnlocked = useCallback(
    (difficulty: Difficulty): boolean => {
      const levelIndex = DIFFICULTY_ORDER.indexOf(difficulty)
      
      // First level is always unlocked
      if (levelIndex === 0) return true
      
      // Check if previous level has reached threshold
      const previousLevel = DIFFICULTY_ORDER[levelIndex - 1]
      return highScores[previousLevel] >= UNLOCK_THRESHOLD
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
    addScore,
    resetHighScores,
    isLevelUnlocked,
    getUnlockedLevels,
    getProgress,
  }
}
