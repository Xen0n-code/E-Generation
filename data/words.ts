import { Word, EikenLevel } from '@/types'

const loadLevelDataFromTxt = async (level: EikenLevel): Promise<Word[]> => {
  try {
    console.log(`Loading ${level} data from txt file...`)
    
    const response = await fetch(`/data/${level}.txt`)
    if (!response.ok) {
      throw new Error(`Failed to fetch ${level}.txt: ${response.statusText}`)
    }
    
    const text = await response.text()
    const lines = text.trim().split('\n')
    
    const words: Word[] = lines.map((line, index) => {
      const [word, meaning] = line.split(',')
      if (!word || !meaning) {
        console.warn(`Invalid line format in ${level}.txt: ${line}`)
        return null
      }
      
      return {
        id: `${level}-${index + 1}`,
        word: word.trim(),
        meaning: meaning.trim(),
        pronunciation: "",
        example: "",
        level: level,
        category: "名詞"
      }
    }).filter(Boolean) as Word[]
    
    console.log(`Successfully loaded ${words.length} words from ${level}.txt`)
    return words
    
  } catch (error) {
    console.error(`Error loading ${level} data from txt:`, error)
    // フォールバック: 既存のtsファイルを試す
    return await loadLevelDataFromTs(level)
  }
}

const loadLevelDataFromTs = async (level: EikenLevel): Promise<Word[]> => {
  console.log(`Fallback: No ts files available, returning empty array for ${level}`)
  return []
}

const loadLevelData = async (level: EikenLevel): Promise<Word[]> => {
  return await loadLevelDataFromTxt(level)
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