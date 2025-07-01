import { Word, EikenLevel } from '@/types'

const loadLevelData = async (level: EikenLevel): Promise<Word[]> => {
  try {
    console.log(`Loading ${level} data...`)
    
    switch (level) {
      case '5級': {
        const { words5 } = await import('./levels/5級')
        return words5
      }
      case '4級': {
        const { words4 } = await import('./levels/4級')
        return words4
      }
      case '3級':
        // 他の級のファイルが作成されるまで空配列を返す
        return []
      case '準2級':
        return []
      case '2級':
        return []
      case '準1級':
        return []
      case '1級':
        return []
      default:
        console.warn(`Unknown level: ${level}`)
        return []
    }
  } catch (error) {
    console.error(`Error loading ${level} data:`, error)
    return []
  }
}

let wordsCache: Record<EikenLevel, Word[]> = {
  '5級': [],
  '4級': [],
  '3級': [],
  '準2級': [],
  '2級': [],
  '準1級': [],
  '1級': []
}

export const getWordsForLevel = async (level: EikenLevel): Promise<Word[]> => {
  // キャッシュにデータがある場合は返す
  if (wordsCache[level].length > 0) {
    console.log(`Using cached data for ${level}: ${wordsCache[level].length} words`)
    return wordsCache[level]
  }

  // データを読み込み
  const words = await loadLevelData(level)
  wordsCache[level] = words
  console.log(`Loaded ${words.length} words for ${level}`)
  
  return words
}

export const loadWordsData = async (): Promise<Record<EikenLevel, Word[]>> => {
  // 各級のデータを読み込み
  for (const level of ['5級', '4級', '3級', '準2級', '2級', '準1級', '1級'] as EikenLevel[]) {
    if (wordsCache[level].length === 0) {
      await getWordsForLevel(level)
    }
  }
  
  return wordsCache
}

export const wordsData: Record<EikenLevel, Word[]> = wordsCache