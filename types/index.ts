export interface Word {
  id: string
  word: string
  meaning: string
  pronunciation?: string
  example?: string
  level: EikenLevel
  category?: string
}

export interface Question {
  id: string
  word: Word
  options: string[]
  correctAnswer: number
}

export interface Stage {
  id: string
  level: EikenLevel
  stageNumber: number
  words: Word[]
  isUnlocked: boolean
  isCompleted: boolean
  score?: number
}

export interface GameSession {
  stageId: string
  questions: Question[]
  currentQuestionIndex: number
  answers: number[]
  score: number
  startTime: Date
  endTime?: Date
}

export interface UserProgress {
  completedStages: string[]
  currentLevel: EikenLevel
  totalScore: number
  achievements: Achievement[]
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt?: Date
}

export type EikenLevel = '5級' | '4級' | '3級' | '準2級' | '2級' | '準1級' | '1級'

export const EIKEN_LEVELS: EikenLevel[] = ['5級', '4級', '3級', '準2級', '2級', '準1級', '1級']

export const PASSING_SCORE = 6
export const TOTAL_QUESTIONS = 10