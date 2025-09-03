'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { EikenLevel, EIKEN_LEVELS } from '@/types'
import { getStageCount } from '@/utils/gameLogic'
import { isStageUnlocked, loadProgress } from '@/utils/storage'
import { useUser } from '@/contexts/UserContext'
import LoginScreen from '@/components/LoginScreen'
import Header from '@/components/Header'
import Link from 'next/link'

type Mode = 'select' | 'word' | 'grammar'
type GrammarLevel = 'junior' | 'senior'

export default function HomePage() {
  const { user, isLoading } = useUser()
  const [mode, setMode] = useState<Mode>('select')
  const [selectedLevel, setSelectedLevel] = useState<EikenLevel>('5級')
  const [progress, setProgress] = useState(loadProgress())
  const [stageCount, setStageCount] = useState(0)
  const [grammarLevel, setGrammarLevel] = useState<GrammarLevel>('junior')

  // 最後に選択した級を保存・復元
  useEffect(() => {
    const savedLevel = localStorage.getItem('selected-level')
    if (savedLevel && ['5級', '4級', '3級', '準2級', '2級', '準1級', '1級'].includes(savedLevel)) {
      setSelectedLevel(savedLevel as EikenLevel)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('selected-level', selectedLevel)
  }, [selectedLevel])

  useEffect(() => {
    setProgress(loadProgress())
  }, [])

  useEffect(() => {
    const loadStageCount = async () => {
      try {
        console.log(`Loading stage count for ${selectedLevel}`)
        const count = await getStageCount(selectedLevel)
        console.log(`Stage count for ${selectedLevel}: ${count}`)
        setStageCount(count)
      } catch (error) {
        console.error(`Failed to load stage count for ${selectedLevel}:`, error)
        setStageCount(0)
      }
    }
    loadStageCount()
  }, [selectedLevel])

  // ログイン状態確認中の場合
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  // ログインしていない場合はログイン画面を表示
  if (!user) {
    return <LoginScreen />
  }

  // モード選択画面
  const ModeSelector = () => (
    <div className="max-w-4xl mx-auto">
      <motion.header 
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
          E-Generation
        </h1>
        <p className="text-lg text-gray-600">
          学習モードを選択してください
        </p>
      </motion.header>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <motion.button
          onClick={() => setMode('word')}
          className="p-8 rounded-xl border-2 border-gray-200 hover:border-blue-300 bg-white hover:bg-blue-50 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="text-4xl mb-4">📚</div>
          <h3 className="text-2xl font-semibold mb-2">単語モード</h3>
          <p className="text-gray-600">英検各級の英単語をマスターしよう</p>
        </motion.button>

        <motion.button
          onClick={() => setMode('grammar')}
          className="p-8 rounded-xl border-2 border-gray-200 hover:border-green-300 bg-white hover:bg-green-50 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-2xl font-semibold mb-2">文法モード</h3>
          <p className="text-gray-600">中学・高校文法を段階的に学習</p>
        </motion.button>
      </motion.div>
    </div>
  )

  // 文法レベル選択画面
  const GrammarLevelSelector = () => (
    <div className="max-w-4xl mx-auto">
      <motion.header 
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <button 
          onClick={() => setMode('select')}
          className="mb-4 px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          ← モード選択に戻る
        </button>
        <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 mb-4">
          文法モード
        </h1>
        <p className="text-lg text-gray-600">
          学習レベルを選択してください
        </p>
      </motion.header>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Link href="/grammar/junior">
            <motion.button
            className="p-8 rounded-xl border-2 border-gray-200 hover:border-green-300 bg-white hover:bg-green-50 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="text-4xl mb-4">🏫</div>
            <h3 className="text-2xl font-semibold mb-2">中学文法</h3>
            <p className="text-gray-600">基礎から応用まで20ステージ</p>
          </motion.button>
        </Link>

        <motion.button
          onClick={() => {
            setGrammarLevel('senior')
            // TODO: 高校文法ページに遷移
          }}
          className="p-8 rounded-xl border-2 border-gray-200 hover:border-purple-300 bg-white hover:bg-purple-50 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="text-4xl mb-4">🎓</div>
          <h3 className="text-2xl font-semibold mb-2">高校文法</h3>
          <p className="text-gray-600">より高度な文法事項を学習</p>
        </motion.button>
      </motion.div>
    </div>
  )

  return (
    <>
      <Header />
      <div className="min-h-screen p-4">
        {mode === 'select' && <ModeSelector />}
        {mode === 'grammar' && <GrammarLevelSelector />}
        {mode === 'word' && (
          <div className="max-w-4xl mx-auto">
            <motion.header 
              className="text-center mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <button 
                onClick={() => setMode('select')}
                className="mb-4 px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors"
              >
                ← モード選択に戻る
              </button>
              <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
                単語モード
              </h1>
              <p className="text-lg text-gray-600">
                英検各級の英単語をマスターしよう
              </p>
            </motion.header>

        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold text-center mb-6">英検レベルを選択</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {EIKEN_LEVELS.map((level, index) => (
              <motion.button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  selectedLevel === level
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-blue-300 bg-white hover:bg-blue-50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="text-lg font-semibold">{level}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="glass rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-2xl font-semibold mb-6 text-center">
            {selectedLevel} ステージ一覧 (ステージ数: {stageCount})
          </h3>
          {stageCount === 0 ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">ステージを読み込み中...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: stageCount }, (_, i) => {
              const stageNumber = i + 1
              const stageId = `${selectedLevel}-${stageNumber}`
              const isUnlocked = isStageUnlocked(selectedLevel, stageNumber)
              const isCompleted = progress.completedStages.includes(stageId)

              return (
                <motion.div
                  key={stageId}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                    isUnlocked
                      ? isCompleted
                        ? 'border-green-300 bg-green-50'
                        : 'border-blue-300 bg-blue-50 hover:border-blue-400'
                      : 'border-gray-200 bg-gray-100'
                  }`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold mb-2">
                        ステージ {stageNumber}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {selectedLevel} レベルの単語 10問
                      </p>
                      {isCompleted && (
                        <div className="flex items-center mt-2">
                          <span className="text-green-600 text-sm font-medium">
                            ✓ クリア済み
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      {isUnlocked ? (
                        <Link href={`/quiz/${encodeURIComponent(selectedLevel)}/${stageNumber}`}>
                          <motion.button
                            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                              isCompleted
                                ? 'bg-green-500 hover:bg-green-600 text-white'
                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {isCompleted ? '再挑戦' : 'スタート'}
                          </motion.button>
                        </Link>
                      ) : (
                        <div className="px-6 py-3 rounded-lg bg-gray-300 text-gray-500 font-medium">
                          🔒 ロック中
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
              })}
            </div>
          )}
        </motion.div>

        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="glass rounded-xl p-6 inline-block">
            <h4 className="text-lg font-semibold mb-2">進捗状況</h4>
            <p className="text-gray-600">
              クリア済みステージ: {progress.completedStages.length}
            </p>
            <p className="text-gray-600">
              総獲得スコア: {progress.totalScore}
            </p>
          </div>
        </motion.div>
        </div>
        )}
      </div>
    </>
  )
}