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
    japanese: '私はサッカーをします。',
    words: ['plays', 'play', 'soccer', 'I'],
    correctAnswer: 'I play soccer.'
  },
  {
    id: 2,
    japanese: '彼は本を読む。',
    words: ['books', 'read', 'He', 'reads'],
    correctAnswer: 'He reads books.'
  },
  {
    id: 3,
    japanese: '私の猫は魚を食べる。',
    words: ['fish', 'eats', 'My cat', 'eat'],
    correctAnswer: 'My cat eats fish.'
  },
  {
    id: 4,
    japanese: 'あなたは東京に住んでいる。',
    words: ['lives', 'in Tokyo', 'You', 'live'],
    correctAnswer: 'You live in Tokyo.'
  },
  {
    id: 5,
    japanese: '彼女は音楽が好き。',
    words: ['like', 'She', 'likes', 'music'],
    correctAnswer: 'She likes music.'
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
            className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] shadow-2xl overflow-y-auto"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">一般動詞の変化</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto rounded-full"></div>
            </div>

            <div className="space-y-8">
              {/* 解説 */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-blue-800 mb-4 flex items-center">
                  <span className="mr-3 text-3xl">⚡</span>
                  一般動詞の変化
                </h3>
                <p className="text-xl text-blue-700 mb-4 leading-relaxed">
                  3人称のときは、一般動詞が変化するから気をつけよう！
                </p>

                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-lg mb-3">
                      3人称のとき、一般動詞に<span className="bg-yellow-200 px-2 py-1 rounded font-bold">s</span>が付きます。
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-lg font-bold text-blue-600">He plays soccer.</p>
                      <p className="text-lg text-gray-600">（彼はサッカーをします。）</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                    <p className="text-lg">
                      この付けたsのことを<span className="bg-yellow-200 px-2 py-1 rounded font-bold">「3単現（3人称・単数・現在形）のs」</span>といいます。
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-4">
                    <h4 className="text-lg font-bold text-gray-800 mb-3">比較してみよう：</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-blue-600 font-semibold">I play tennis.</span>
                        <span className="text-gray-600">（私がテニスをする）</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                        <span className="text-blue-600 font-semibold">He play<span className="text-red-600 font-bold">s</span> tennis.</span>
                        <span className="text-gray-600">（彼がテニスをする）</span>
                      </div>
                    </div>
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
  onClick,
  disabled
}: {
  word: string
  isSelected: boolean
  onClick: () => void
  disabled: boolean
}) => {
  return (
    <motion.button
      className={`px-4 py-3 text-lg font-semibold rounded-xl border-2 transition-all duration-300 ${
        isSelected
          ? 'bg-blue-500 text-white border-blue-500'
          : 'bg-white text-gray-800 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={disabled}
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

export default function Stage2Lesson3() {
  const { user, isLoading } = useUser()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedWords, setSelectedWords] = useState<string[]>([])
  const [availableWords, setAvailableWords] = useState<string[]>([])
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

  // Fisher-Yates シャッフルアルゴリズム
  const shuffleArray = (array: string[]) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // 問題が変わったら単語をシャッフル
  useEffect(() => {
    const shuffled = shuffleArray(question.words)
    setAvailableWords(shuffled)
    setSelectedWords([])
  }, [currentQuestion, retryIndex, isRetryPhase])

  const handleWordClick = (word: string) => {
    if (showResult) return

    if (selectedWords.includes(word)) {
      // 選択解除
      setSelectedWords(prev => prev.filter(w => w !== word))
      setAvailableWords(prev => [...prev, word])
    } else {
      // 選択
      setSelectedWords(prev => [...prev, word])
      setAvailableWords(prev => prev.filter(w => w !== word))
    }
  }

  const handleSubmit = () => {
    const userAnswer = selectedWords.join(' ')
    const isCorrect = userAnswer === question.correctAnswer

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
          setShowResult(false)
        } else {
          // 初回終了、間違えた問題があるかチェック
          if (incorrectQuestions.length > 0 || !isCorrect) {
            const finalIncorrectQuestions = !isCorrect ? [...incorrectQuestions, currentQuestion] : incorrectQuestions
            if (finalIncorrectQuestions.length > 0) {
              setIncorrectQuestions(finalIncorrectQuestions)
              setIsRetryPhase(true)
              setRetryIndex(0)
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
    window.location.href = '/grammar/junior/stage2'
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
                  href="/grammar/junior/stage2"
                  className="px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors rounded-lg bg-white shadow-sm hover:shadow-md"
                >
                  ← ステージ2に戻る
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
                      <span className="text-lg font-bold text-gray-700">2-3: 一般動詞の変化</span>
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
                    単語を正しい順番に並べて英文を作ってください
                  </h2>
                  <div className="bg-gray-50 rounded-xl p-6 mb-6">
                    <p className="text-2xl font-bold text-gray-800">{question.japanese}</p>
                  </div>

                  <div className="text-sm text-gray-600 bg-yellow-50 rounded-lg p-3 mb-6 border border-yellow-200">
                    <p>⚠️ 注意: 3人称の場合は動詞にsを付けることを忘れずに！</p>
                  </div>
                </div>

                {/* 選択された単語 */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">作った英文：</h3>
                  <div className="bg-blue-50 rounded-xl p-4 min-h-[60px] border-2 border-blue-200">
                    {selectedWords.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedWords.map((word, index) => (
                          <span
                            key={index}
                            className="px-3 py-2 bg-gray-100 text-gray-800 rounded-lg font-medium cursor-pointer hover:bg-gray-200 border border-gray-300"
                            onClick={() => handleWordClick(word)}
                          >
                            {word}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 italic">単語をクリックして文を作ってください</p>
                    )}
                  </div>
                </div>

                {/* 利用可能な単語 */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">単語：</h3>
                  <div className="flex flex-wrap justify-center gap-3">
                    {availableWords.map((word, index) => (
                      <WordButton
                        key={`${word}-${index}`}
                        word={word}
                        isSelected={false}
                        onClick={() => handleWordClick(word)}
                        disabled={showResult}
                      />
                    ))}
                  </div>
                </div>

                {/* 結果表示 */}
                <AnimatePresence>
                  {showResult && (
                    <motion.div
                      className="text-center mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      {selectedWords.join(' ') === question.correctAnswer ? (
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
                        selectedWords.length > 0
                          ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg hover:shadow-xl'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      whileHover={selectedWords.length > 0 ? { scale: 1.05 } : {}}
                      whileTap={selectedWords.length > 0 ? { scale: 0.95 } : {}}
                      onClick={handleSubmit}
                      disabled={selectedWords.length === 0}
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