'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUser } from '@/contexts/UserContext'
import LoginScreen from '@/components/LoginScreen'
import Header from '@/components/Header'
import Link from 'next/link'

// 問題データ - 単数・複数のbe動詞選択
const QUESTIONS = [
  {
    id: 1,
    japanese: '私の弟は家にいます。',
    english: 'My brother __ at home.',
    options: ['is', 'are'],
    correctAnswer: 'is',
    explanation: 'My brother（私の弟）は一人なので単数です。単数なので「is」を使います。'
  },
  {
    id: 2,
    japanese: 'トムと私は友達です。',
    english: 'Tom and I __ good friends.',
    options: ['is', 'are'],
    correctAnswer: 'are',
    explanation: 'Tom and I（トムと私）は二人なので複数です。複数なので「are」を使います。'
  },
  {
    id: 3,
    japanese: '私の弟たちは家にいます。',
    english: 'My brothers __ at home.',
    options: ['is', 'are'],
    correctAnswer: 'are',
    explanation: 'My brothers（私の弟たち）は複数です。複数なので「are」を使います。'
  },
  {
    id: 4,
    japanese: '先生は優しいです。',
    english: 'The teacher __ kind.',
    options: ['is', 'are'],
    correctAnswer: 'is',
    explanation: 'The teacher（その先生）は一人なので単数です。単数なので「is」を使います。'
  },
  {
    id: 5,
    japanese: '私たちはバスに乗っています。',
    english: 'We __ on the bus.',
    options: ['is', 'are'],
    correctAnswer: 'are',
    explanation: 'We（私たち）は複数です。複数なので「are」を使います。'
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
            className="relative bg-white rounded-2xl p-8 max-w-3xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">単数と複数のbe動詞</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto rounded-full"></div>
            </div>

            <div className="space-y-8">
              {/* 基本ルールの説明 */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-blue-800 mb-4 flex items-center">
                  <span className="mr-3 text-3xl">📊</span>
                  基本ルール
                </h3>
                <p className="text-xl text-blue-700 mb-4 leading-relaxed">
                  1人や1つのときは<span className="bg-yellow-200 px-2 py-1 rounded font-bold">is</span>を使うと学びましたが、2人や2つ以上の時はisは使えません。
                  主語が複数の時は、<span className="bg-yellow-200 px-2 py-1 rounded font-bold">are</span>を使います。
                </p>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">（1人（１つ）のことを「単数」といい、2人（２つ）以上のことを「複数」といいます。）</p>
                </div>
              </div>

              {/* 具体例 */}
              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-green-800 mb-4 flex items-center">
                  <span className="mr-3 text-3xl">🔍</span>
                  具体例で確認
                </h3>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-lg font-bold text-green-600 mb-2">単数（1つ・1人）の場合：</p>
                    <p className="text-gray-700 mb-1">The cat <span className="bg-yellow-200 px-2 py-1 rounded font-bold">is</span> cute. （その猫は可愛い）</p>
                    <p className="text-sm text-gray-500">→ 猫が1匹なので単数、だから「is」</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-lg font-bold text-green-600 mb-2">複数（2つ以上・2人以上）の場合：</p>
                    <p className="text-gray-700 mb-1">The cats <span className="bg-yellow-200 px-2 py-1 rounded font-bold">are</span> cute. （その猫たちは可愛い）</p>
                    <p className="text-sm text-gray-500">→ 猫が複数匹なので複数、だから「are」</p>
                  </div>
                </div>
              </div>

              {/* 見分け方のコツ */}
              <div className="bg-yellow-50 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-yellow-800 mb-4 flex items-center">
                  <span className="mr-3 text-3xl">💡</span>
                  見分け方のコツ
                </h3>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-lg font-bold text-yellow-700 mb-2">複数を表すサイン：</p>
                    <ul className="text-gray-700 space-y-1">
                      <li>• 名詞に「s」が付く（cats, dogs, books など）</li>
                      <li>• 「and」で繋がっている（Tom and I など）</li>
                      <li>• We（私たち）、They（彼ら・彼女ら・それら）</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-lg font-bold text-yellow-700 mb-2">単数の場合：</p>
                    <ul className="text-gray-700 space-y-1">
                      <li>• 一人の人（my brother, the teacher など）</li>
                      <li>• 一つの物（the cat, this pen など）</li>
                      <li>• He（彼）、She（彼女）、It（それ）</li>
                    </ul>
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

// 選択肢ボタン
const OptionButton = ({ 
  option, 
  isSelected, 
  onClick,
  isCorrect,
  showResult
}: {
  option: string
  isSelected: boolean
  onClick: () => void
  isCorrect?: boolean
  showResult: boolean
}) => {
  let buttonClass = 'px-8 py-4 text-xl font-semibold rounded-xl border-2 transition-all duration-300 '
  
  if (showResult) {
    if (isSelected && isCorrect) {
      buttonClass += 'bg-green-500 text-white border-green-500'
    } else if (isSelected && !isCorrect) {
      buttonClass += 'bg-red-500 text-white border-red-500'
    } else if (!isSelected && isCorrect) {
      buttonClass += 'bg-green-100 text-green-700 border-green-300'
    } else {
      buttonClass += 'bg-gray-100 text-gray-400 border-gray-200'
    }
  } else {
    buttonClass += isSelected 
      ? 'bg-blue-500 text-white border-blue-500' 
      : 'bg-white text-gray-800 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
  }

  return (
    <motion.button
      className={buttonClass}
      whileHover={!showResult ? { scale: 1.05 } : {}}
      whileTap={!showResult ? { scale: 0.95 } : {}}
      onClick={!showResult ? onClick : undefined}
      disabled={showResult}
    >
      {option}
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
      <h1 className="text-4xl font-bold text-gray-800 mb-4">ステージ1クリア！</h1>
      <p className="text-xl text-gray-600 mb-4">正解率: {Math.round((score / totalQuestions) * 100)}%</p>
      <p className="text-2xl font-bold text-blue-600 mb-2">You are amazing!</p>
      <p className="text-lg text-gray-600 mb-8">（あなたは素晴らしいです！）</p>
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

export default function Stage1Lesson5() {
  const { user, isLoading } = useUser()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
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

  // 問題が変わったときに選択をリセット
  useEffect(() => {
    setSelectedAnswer(null)
  }, [currentQuestion, retryIndex, isRetryPhase])

  const handleOptionClick = (option: string) => {
    if (showResult) return
    setSelectedAnswer(option)
  }

  const handleSubmit = () => {
    if (!selectedAnswer) return
    
    const isCorrect = selectedAnswer === question.correctAnswer
    
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
      }, 3000)
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
      }, 3000)
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
                      <span className="text-lg font-bold text-gray-700">1-5: 単数と複数のbe動詞</span>
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
                    isかareか選びましょう
                  </h2>
                  <div className="bg-blue-50 rounded-xl p-4 mb-6">
                    <p className="text-xl font-bold text-blue-800">{question.japanese}</p>
                  </div>
                </div>

                {/* 英文と空欄 */}
                <div className="text-center mb-8">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <p className="text-2xl font-bold text-gray-800">
                      {question.english.split('__').map((part, index) => (
                        <span key={index}>
                          {part}
                          {index < question.english.split('__').length - 1 && (
                            <span className="inline-block mx-2 px-4 py-1 bg-yellow-200 rounded min-w-[80px] text-center">
                              {selectedAnswer || '___'}
                            </span>
                          )}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>

                {/* 選択肢 */}
                <div className="mb-8">
                  <div className="flex justify-center gap-6">
                    {question.options.map((option) => (
                      <OptionButton
                        key={option}
                        option={option}
                        isSelected={selectedAnswer === option}
                        onClick={() => handleOptionClick(option)}
                        isCorrect={option === question.correctAnswer}
                        showResult={showResult}
                      />
                    ))}
                  </div>
                </div>

                {/* 結果表示 */}
                <AnimatePresence>
                  {showResult && (
                    <motion.div
                      className="text-center mb-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      {selectedAnswer === question.correctAnswer ? (
                        <div className="text-green-600 mb-4">
                          <div className="text-4xl mb-2">🎉</div>
                          <p className="text-xl font-bold mb-2">正解です！</p>
                          <div className="bg-green-50 rounded-lg p-4">
                            <p className="text-lg font-bold text-green-700">{question.explanation}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-red-600 mb-4">
                          <div className="text-4xl mb-2">😅</div>
                          <p className="text-xl font-bold mb-2">不正解です</p>
                          <div className="bg-red-50 rounded-lg p-4 mb-2">
                            <p className="text-sm text-red-700">あなたの答え: {selectedAnswer}</p>
                            <p className="text-sm text-red-700">正解: {question.correctAnswer}</p>
                          </div>
                          <div className="bg-green-50 rounded-lg p-4">
                            <p className="text-lg font-bold text-green-700">{question.explanation}</p>
                          </div>
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
                        selectedAnswer
                          ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg hover:shadow-xl' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      whileHover={selectedAnswer ? { scale: 1.05 } : {}}
                      whileTap={selectedAnswer ? { scale: 0.95 } : {}}
                      onClick={handleSubmit}
                      disabled={!selectedAnswer}
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