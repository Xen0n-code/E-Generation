import { UserProgress, EikenLevel } from '@/types'
import { saveProgressToFirebase } from '@/services/firebaseStorage'

const STORAGE_KEY = 'e-generation-progress'

export const saveProgress = async (progress: UserProgress): Promise<void> => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    
    // Firebaseにも保存（ユーザーがログインしている場合）
    const userString = localStorage.getItem('e-generation-user')
    if (userString) {
      try {
        const userData = JSON.parse(userString)
        await saveProgressToFirebase(userData.username, progress)
      } catch (error) {
        console.error('Failed to save progress to Firebase:', error)
      }
    }
  }
}

export const loadProgress = (): UserProgress => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (error) {
        console.error('Failed to parse saved progress:', error)
      }
    }
  }
  
  return {
    completedStages: [],
    currentLevel: '5級',
    totalScore: 0,
    achievements: []
  }
}

export const updateStageCompletion = async (stageId: string, score: number): Promise<void> => {
  const progress = loadProgress()
  
  if (!progress.completedStages.includes(stageId)) {
    progress.completedStages.push(stageId)
  }
  
  progress.totalScore += score
  await saveProgress(progress)
}

export const isStageUnlocked = (level: EikenLevel, stageNumber: number): boolean => {
  const progress = loadProgress()
  
  // 全ての級のステージ1は常にアンロック状態
  if (stageNumber === 1) {
    return true
  }
  
  // ステージ2以降は前のステージがクリア済みの場合のみアンロック
  const previousStageId = `${level}-${stageNumber - 1}`
  return progress.completedStages.includes(previousStageId)
}

const getPreviousLevelLastStageId = (level: EikenLevel): string => {
  const levels: EikenLevel[] = ['5級', '4級', '3級', '準2級', '2級', '準1級', '1級']
  const currentIndex = levels.indexOf(level)
  
  if (currentIndex <= 0) return ''
  
  const previousLevel = levels[currentIndex - 1]
  return `${previousLevel}-2`
}

export const clearAllProgress = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY)
  }
}