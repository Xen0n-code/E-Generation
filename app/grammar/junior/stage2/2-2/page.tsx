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
    japanese: '彼は生徒です。',
    english: 'He is a student.',
    isThirdPerson: true
  },
  {
    id: 2,
    japanese: '私は東京出身です。',
    english: 'I am from Tokyo.',
    isThirdPerson: false
  },
  {
    id: 3,
    japanese: 'この本は新しいです。',
    english: 'This book is new.',
    isThirdPerson: true
  },
  {
    id: 4,
    japanese: 'あなたは忙しいです。',
    english: 'You are busy.',
    isThirdPerson: false
  },
  {
    id: 5,
    japanese: 'トムは背が高いです。',
    english: 'Tom is tall.',
    isThirdPerson: true
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
              <h2 className="text-3xl font-bold text-gray-800 mb-4">「3人称」ってなに？</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto rounded-full"></div>
            </div>

            <div className="space-y-8">
              {/* 解説 */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-blue-800 mb-4 flex items-center">
                  <span className="mr-3 text-3xl">👥</span>
                  人称について
                </h3>
                <p className="text-xl text-blue-700 mb-4 leading-relaxed">
                  英語には、「3人称」という言葉がよく出てくるので、この言葉を理解しよう！
                </p>

                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                    <p className="text-lg font-bold text-green-700 mb-2">1人称</p>
                    <p className="text-lg">
                      まず、自分のことを<span className="bg-yellow-200 px-2 py-1 rounded font-bold">「1人称」</span>といいます。
                    </p>
                    <p className="text-lg font-bold text-blue-600 mt-2">I（私は）</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                    <p className="text-lg font-bold text-blue-700 mb-2">2人称</p>
                    <p className="text-lg">
                      そして、相手のことを<span className="bg-yellow-200 px-2 py-1 rounded font-bold">「2人称」</span>といいます。
                    </p>
                    <p className="text-lg font-bold text-blue-600 mt-2">You（あなたは）</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
                    <p className="text-lg font-bold text-purple-700 mb-2">3人称</p>
                    <p className="text-lg">
                      自分と相手以外の人やもののことを、<span className="bg-yellow-200 px-2 py-1 rounded font-bold">「3人称」</span>といいます。
                    </p>
                    <p className="text-lg font-bold text-blue-600 mt-2">He（彼は）She（彼女は）など</p>
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

// ○×選択ボタン
const AnswerButton = ({
  isCorrect,
  label,
  selected,
  showResult,
  onClick
}: {
  isCorrect: boolean
  label: string
  selected: boolean
  showResult: boolean
  onClick: () => void
}) => {
  const getButtonStyle = () => {
    if (showResult) {
      if (isCorrect) {
        return 'bg-green-500 text-white border-green-500'
      } else if (selected && !isCorrect) {
        return 'bg-red-500 text-white border-red-500'
      }
      return 'bg-gray-200 text-gray-500 border-gray-300'
    }

    if (selected) {
      return 'bg-blue-500 text-white border-blue-500'
    }
    return 'bg-white text-gray-800 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
  }

  return (
    <motion.button
      className={`px-8 py-4 text-xl font-bold rounded-xl border-2 transition-all duration-300 min-w-[120px] ${getButtonStyle()}`}
      whileHover={!showResult ? { scale: 1.05 } : {}}
      whileTap={!showResult ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={showResult}
    >
      {label}
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

export default function Stage2Lesson2() {
  const { user, isLoading } = useUser()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null)
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

  const handleAnswerClick = (answer: boolean) => {
    if (showResult) return
    setSelectedAnswer(answer)
  }

  const handleSubmit = () => {
    if (selectedAnswer === null) return

    const isCorrect = selectedAnswer === question.isThirdPerson

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
          setSelectedAnswer(null)
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
          setSelectedAnswer(null)
          setShowResult(false)
        } else {
          // 初回終了、間違えた問題があるかチェック
          if (incorrectQuestions.length > 0 || !isCorrect) {
            const finalIncorrectQuestions = !isCorrect ? [...incorrectQuestions, currentQuestion] : incorrectQuestions
            if (finalIncorrectQuestions.length > 0) {
              setIncorrectQuestions(finalIncorrectQuestions)
              setIsRetryPhase(true)
              setRetryIndex(0)
              setSelectedAnswer(null)
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
                      <span className="text-lg font-bold text-gray-700">2-2: 「3人称」ってなに？</span>
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
                    この英文は3人称ですか？
                  </h2>
                  <div className="bg-gray-50 rounded-xl p-6 mb-6">
                    <p className="text-lg font-bold text-gray-600 mb-2">{question.japanese}</p>
                    <p className="text-2xl font-bold text-gray-800">{question.english}</p>
                  </div>
                </div>

                {/* 選択肢 */}
                <div className="flex justify-center gap-6 mb-8">
                  <AnswerButton
                    isCorrect={question.isThirdPerson}
                    label="○"
                    selected={selectedAnswer === true}
                    showResult={showResult}
                    onClick={() => handleAnswerClick(true)}
                  />
                  <AnswerButton
                    isCorrect={!question.isThirdPerson}
                    label="×"
                    selected={selectedAnswer === false}
                    showResult={showResult}
                    onClick={() => handleAnswerClick(false)}
                  />
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
                      {selectedAnswer === question.isThirdPerson ? (
                        <div className="text-green-600">
                          <div className="text-4xl mb-2">🎉</div>
                          <p className="text-xl font-bold">正解です！</p>
                          <p className="text-lg mt-2">
                            {question.isThirdPerson ?
                              'この英文は3人称です！' :
                              'この英文は3人称ではありません！'
                            }
                          </p>
                        </div>
                      ) : (
                        <div className="text-red-600">
                          <div className="text-4xl mb-2">😅</div>
                          <p className="text-xl font-bold">不正解です。</p>
                          <p className="text-lg mt-2">
                            {question.isThirdPerson ?
                              'この英文は3人称です。' :
                              'この英文は3人称ではありません。'
                            }
                          </p>
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
                        selectedAnswer !== null
                          ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg hover:shadow-xl'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      whileHover={selectedAnswer !== null ? { scale: 1.05 } : {}}
                      whileTap={selectedAnswer !== null ? { scale: 0.95 } : {}}
                      onClick={handleSubmit}
                      disabled={selectedAnswer === null}
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