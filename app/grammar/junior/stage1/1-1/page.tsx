'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUser } from '@/contexts/UserContext'
import LoginScreen from '@/components/LoginScreen'
import Header from '@/components/Header'
import Link from 'next/link'

// 問題データ
const QUESTIONS = [
  {
    id: 1,
    type: 'subject' as const,
    english: 'Tom plays soccer.',
    japanese: 'トムはサッカーをしています',
    words: ['Tom', 'plays', 'soccer.'],
    correctAnswer: 'Tom'
  },
  {
    id: 2,
    type: 'subject' as const,
    english: 'They watch TV.',
    japanese: '彼らはテレビを見ています',
    words: ['They', 'watch', 'TV.'],
    correctAnswer: 'They'
  },
  {
    id: 3,
    type: 'subject' as const,
    english: 'My cat sleeps on the bed.',
    japanese: '猫がベッドで寝ています',
    words: ['My cat', 'sleeps', 'on', 'the', 'bed.'],
    correctAnswer: 'My cat'
  },
  {
    id: 4,
    type: 'verb' as const,
    english: 'I like pizza.',
    japanese: '私はピザが好きです',
    words: ['I', 'like', 'pizza.'],
    correctAnswer: 'like'
  },
  {
    id: 5,
    type: 'verb' as const,
    english: 'She reads a book.',
    japanese: '彼女は本を読みます',
    words: ['She', 'reads', 'a', 'book.'],
    correctAnswer: 'reads'
  },
  {
    id: 6,
    type: 'verb' as const,
    english: 'We play tennis after school.',
    japanese: '私たちは放課後テニスをします',
    words: ['We', 'play', 'tennis', 'after', 'school.'],
    correctAnswer: 'play'
  }
]

// 解説モーダル
const ExplanationModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* 背景ブラー */}
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* モーダルコンテンツ */}
          <motion.div
            className="relative bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">主語と動詞</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto rounded-full"></div>
            </div>

            <div className="space-y-8">
              {/* 主語の説明 */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-blue-800 mb-4 flex items-center">
                  <span className="mr-3 text-3xl">👤</span>
                  主語とは？
                </h3>
                <p className="text-xl text-blue-700 mb-4 leading-relaxed">
                  「主語」っていうのは文章の主人公のこと！
                </p>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-lg">
                      <span className="font-bold text-blue-600">「犬が走る」</span> → 主語は<span className="bg-yellow-200 px-2 py-1 rounded font-bold">「犬」</span>
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-lg">
                      <span className="font-bold text-blue-600">「ぼくはリンゴを食べる」</span> → 主語は<span className="bg-yellow-200 px-2 py-1 rounded font-bold">「ぼく」</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* 動詞の説明 */}
              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-green-800 mb-4 flex items-center">
                  <span className="mr-3 text-3xl">⚡</span>
                  動詞とは？
                </h3>
                <p className="text-xl text-green-700 mb-4 leading-relaxed">
                  主語の動きや状態を表す言葉！
                </p>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-lg">
                      <span className="font-bold text-green-600">「犬が走る」</span> → 動詞は<span className="bg-yellow-200 px-2 py-1 rounded font-bold">「走る」</span>
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-lg">
                      <span className="font-bold text-green-600">「ぼくはリンゴを食べる」</span> → 動詞は<span className="bg-yellow-200 px-2 py-1 rounded font-bold">「食べる」</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 閉じるボタン */}
            <div className="flex justify-end mt-8">
              <button
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                onClick={onClose}
              >
                閉じる
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// 単語選択ボタン
const WordButton = ({ 
  word, 
  isSelected, 
  isCorrect, 
  isIncorrect, 
  onClick 
}: {
  word: string
  isSelected: boolean
  isCorrect: boolean
  isIncorrect: boolean
  onClick: () => void
}) => {
  const getButtonStyle = () => {
    if (isCorrect) return 'bg-green-500 text-white border-green-500'
    if (isIncorrect) return 'bg-red-500 text-white border-red-500'
    if (isSelected) return 'bg-blue-500 text-white border-blue-500'
    return 'bg-white text-gray-800 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
  }

  return (
    <motion.button
      className={`px-4 py-3 text-lg font-semibold rounded-xl border-2 transition-all duration-300 ${getButtonStyle()}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={isCorrect || isIncorrect}
    >
      {word}
    </motion.button>
  )
}

// クリア画面コンポーネント
const ClearScreen = ({ score, totalQuestions, onBackToStage }: {
  score: number
  totalQuestions: number
  onBackToStage: () => void
}) => {
  return (
    <motion.div
      className="text-center py-16"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
    >
      <div className="text-8xl mb-6">🎉</div>
      <h1 className="text-4xl font-bold text-gray-800 mb-4">クリア！</h1>
      <p className="text-xl text-gray-600 mb-8">お疲れさまでした！</p>
      <motion.button
        className="px-8 py-3 bg-blue-600 text-white font-bold text-xl rounded-xl hover:bg-blue-700 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBackToStage}
      >
        ステージ選択に戻る
      </motion.button>
    </motion.div>
  )
}

export default function Stage1Lesson1() {
  const { user, isLoading } = useUser()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedWord, setSelectedWord] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [showExplanation, setShowExplanation] = useState(true)
  const [answeredQuestions, setAnsweredQuestions] = useState<{ [key: number]: boolean }>({})
  const [incorrectQuestions, setIncorrectQuestions] = useState<number[]>([])
  const [isRetryPhase, setIsRetryPhase] = useState(false)
  const [retryIndex, setRetryIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [finalScore, setFinalScore] = useState(0)

  // 現在の問題を取得
  const getCurrentQuestion = () => {
    if (isRetryPhase && incorrectQuestions.length > 0) {
      return QUESTIONS[incorrectQuestions[retryIndex]]
    }
    return QUESTIONS[currentQuestion]
  }

  const question = getCurrentQuestion()

  const handleWordClick = (word: string) => {
    if (showResult) return
    setSelectedWord(word)
  }

  const handleSubmit = () => {
    if (!selectedWord) return
    
    const isCorrect = selectedWord === question.correctAnswer
    
    if (isRetryPhase) {
      // 再出題フェーズの場合
      const questionIndex = incorrectQuestions[retryIndex]
      if (isCorrect) {
        setAnsweredQuestions(prev => ({ ...prev, [questionIndex]: true }))
        setFinalScore(prev => prev + 1)
      }
      
      setShowResult(true)

      setTimeout(() => {
        if (retryIndex < incorrectQuestions.length - 1) {
          // 次の間違えた問題へ
          setRetryIndex(retryIndex + 1)
          setSelectedWord(null)
          setShowResult(false)
        } else {
          // 再出題完了
          setIsComplete(true)
        }
      }, 2000)
    } else {
      // 初回フェーズの場合
      if (isCorrect) {
        setAnsweredQuestions(prev => ({ ...prev, [currentQuestion]: true }))
        setFinalScore(prev => prev + 1)
      } else {
        setAnsweredQuestions(prev => ({ ...prev, [currentQuestion]: false }))
        setIncorrectQuestions(prev => [...prev, currentQuestion])
      }
      
      setShowResult(true)

      setTimeout(() => {
        if (currentQuestion < QUESTIONS.length - 1) {
          setCurrentQuestion(currentQuestion + 1)
          setSelectedWord(null)
          setShowResult(false)
        } else {
          // 初回終了、間違えた問題があるかチェック
          if (incorrectQuestions.length > 0 || !isCorrect) {
            const finalIncorrectQuestions = !isCorrect ? [...incorrectQuestions, currentQuestion] : incorrectQuestions
            if (finalIncorrectQuestions.length > 0) {
              setIncorrectQuestions(finalIncorrectQuestions)
              setIsRetryPhase(true)
              setRetryIndex(0)
              setSelectedWord(null)
              setShowResult(false)
            } else {
              setIsComplete(true)
            }
          } else {
            setIsComplete(true)
          }
        }
      }, 2000)
    }
  }

  const handleBackToStage = () => {
    window.location.href = '/grammar/junior/stage1'
  }

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

  if (!user) {
    return <LoginScreen />
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
        <div className="max-w-4xl mx-auto">
          {isComplete ? (
            <ClearScreen 
              score={finalScore} 
              totalQuestions={QUESTIONS.length} 
              onBackToStage={handleBackToStage} 
            />
          ) : (
            <>
              {/* ヘッダー */}
              <motion.header 
                className="flex items-center justify-between mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Link 
                  href="/grammar/junior/stage1"
                  className="px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors rounded-lg bg-white shadow-sm hover:shadow-md"
                >
                  ← ステージ1に戻る
                </Link>
                
                <button
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors"
                  onClick={() => setShowExplanation(true)}
                >
                  解説を見る
                </button>
              </motion.header>

              {/* プログレス */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="bg-white rounded-xl shadow-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-700">1-1: 主語と動詞</span>
                      {isRetryPhase && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                          間違えた問題
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-600">
                      {isRetryPhase 
                        ? `${retryIndex + 1} / ${incorrectQuestions.length}` 
                        : `${currentQuestion + 1} / ${QUESTIONS.length}`
                      }
                    </span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-3">
                    <motion.div
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ 
                        width: isRetryPhase 
                          ? `${((retryIndex + 1) / incorrectQuestions.length) * 100}%`
                          : `${((currentQuestion + 1) / QUESTIONS.length) * 100}%`
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </motion.div>

              {/* 問題 */}
              <motion.div
                className="bg-white rounded-2xl shadow-xl p-8 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                key={isRetryPhase ? `retry-${retryIndex}` : currentQuestion}
              >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {question.type === 'subject' ? '主語を選んでください' : '動詞を選んでください'}
              </h2>
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <p className="text-2xl font-bold text-gray-800 mb-2">{question.english}</p>
                <p className="text-lg text-gray-600">（{question.japanese}）</p>
              </div>
            </div>

            {/* 単語選択 */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {question.words.map((word, index) => (
                <WordButton
                  key={index}
                  word={word}
                  isSelected={selectedWord === word}
                  isCorrect={showResult && word === question.correctAnswer}
                  isIncorrect={showResult && selectedWord === word && word !== question.correctAnswer}
                  onClick={() => handleWordClick(word)}
                />
              ))}
            </div>

            {/* 結果表示 */}
            <AnimatePresence>
              {showResult && (
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {selectedWord === question.correctAnswer ? (
                    <div className="text-green-600">
                      <div className="text-4xl mb-2">🎉</div>
                      <p className="text-xl font-bold">正解です！</p>
                    </div>
                  ) : (
                    <div className="text-red-600">
                      <div className="text-4xl mb-2">😅</div>
                      <p className="text-xl font-bold">不正解です。正解は「{question.correctAnswer}」でした。</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* 回答ボタン */}
            {!showResult && (
              <div className="text-center">
                <motion.button
                  className={`px-8 py-3 text-xl font-bold rounded-xl transition-all duration-300 ${
                    selectedWord 
                      ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg hover:shadow-xl' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  whileHover={selectedWord ? { scale: 1.05 } : {}}
                  whileTap={selectedWord ? { scale: 0.95 } : {}}
                  onClick={handleSubmit}
                  disabled={!selectedWord}
                >
                  回答する
                </motion.button>
              </div>
            )}
              </motion.div>
            </>
          )}
        </div>
      </div>

      {/* 解説モーダル */}
      <ExplanationModal 
        isOpen={showExplanation} 
        onClose={() => setShowExplanation(false)} 
      />
    </>
  )
}