import { Word, Question, EikenLevel, PASSING_SCORE, TOTAL_QUESTIONS } from '@/types'
import { getWordsForLevel } from '@/data/words'

export const generateQuestions = async (level: EikenLevel, stageNumber: number): Promise<Question[]> => {
  const levelWords = await getWordsForLevel(level)
  const startIndex = (stageNumber - 1) * TOTAL_QUESTIONS
  const stageWords = levelWords.slice(startIndex, startIndex + TOTAL_QUESTIONS)
  
  if (stageWords.length < TOTAL_QUESTIONS) {
    throw new Error(`Not enough words for stage ${stageNumber} of level ${level}. Found ${stageWords.length} words, need ${TOTAL_QUESTIONS}`)
  }

  return stageWords.map((word, index) => {
    const otherWords = levelWords.filter(w => w.id !== word.id)
    const randomOptions = getRandomItems(otherWords, 3).map(w => w.meaning)
    const correctAnswer = Math.floor(Math.random() * 4)
    const options = [...randomOptions]
    options.splice(correctAnswer, 0, word.meaning)

    return {
      id: `q-${word.id}`,
      word,
      options,
      correctAnswer
    }
  })
}

export const calculateScore = (answers: number[], questions: Question[]): number => {
  return answers.reduce((score, answer, index) => {
    return answer === questions[index].correctAnswer ? score + 1 : score
  }, 0)
}

export const isStageCleared = (score: number): boolean => {
  return score >= PASSING_SCORE
}

export const getRandomItems = <T>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

export const getStageCount = async (level: EikenLevel): Promise<number> => {
  const levelWords = await getWordsForLevel(level)
  return Math.floor(levelWords.length / TOTAL_QUESTIONS)
}

export const generateDistractionOptions = (correctWord: Word, allWords: Word[]): string[] => {
  const sameLevelWords = allWords.filter(w => 
    w.level === correctWord.level && 
    w.id !== correctWord.id
  )
  
  return getRandomItems(sameLevelWords, 3).map(w => w.meaning)
}

export const formatScore = (score: number, total: number = TOTAL_QUESTIONS): string => {
  return `${score}/${total}`
}

export const getScorePercentage = (score: number, total: number = TOTAL_QUESTIONS): number => {
  return Math.round((score / total) * 100)
}

export const getNextLevel = (currentLevel: EikenLevel): EikenLevel | null => {
  const levels: EikenLevel[] = ['5級', '4級', '3級', '準2級', '2級', '準1級', '1級']
  const currentIndex = levels.indexOf(currentLevel)
  return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : null
}

export const getPreviousLevel = (currentLevel: EikenLevel): EikenLevel | null => {
  const levels: EikenLevel[] = ['5級', '4級', '3級', '準2級', '2級', '準1級', '1級']
  const currentIndex = levels.indexOf(currentLevel)
  return currentIndex > 0 ? levels[currentIndex - 1] : null
}