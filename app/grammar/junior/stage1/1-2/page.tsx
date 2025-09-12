'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUser } from '@/contexts/UserContext'
import LoginScreen from '@/components/LoginScreen'
import Header from '@/components/Header'
import Link from 'next/link'

// 問題データ - be動詞か一般動詞かを判別
const QUESTIONS = [
  {
    id: 1,
    english: 'She is a teacher.',
    japanese: '彼女は先生です',
    correctAnswer: 'be動詞',
    explanation: 'isはbe動詞です。「彼女＝先生」という意味になります。'
  },
  {
    id: 2,
    english: 'I like soccer.',
    japanese: '私はサッカーが好きです',
    correctAnswer: '一般動詞',
    explanation: 'likeは一般動詞です。「好き」という動作・感情を表します。'
  },
  {
    id: 3,
    english: 'We play the piano.',
    japanese: '私たちはピアノを弾きます',
    correctAnswer: '一般動詞',
    explanation: 'playは一般動詞です。「弾く」という動作を表します。'
  },
  {
    id: 4,
    english: 'They are happy.',
    japanese: '彼らは幸せです',
    correctAnswer: 'be動詞',
    explanation: 'areはbe動詞です。「彼ら＝幸せ」という意味になります。'
  },
  {
    id: 5,
    english: 'He is tall.',
    japanese: '彼は背が高いです',
    correctAnswer: 'be動詞',
    explanation: 'isはbe動詞です。「彼＝背が高い」という意味になります。'
  },
  {
    id: 6,
    english: 'You run fast.',
    japanese: 'あなたは速く走ります',
    correctAnswer: '一般動詞',
    explanation: 'runは一般動詞です。「走る」という動作を表します。'
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
              <h2 className="text-3xl font-bold text-gray-800 mb-4">be動詞</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto rounded-full"></div>
            </div>

            <div className="space-y-8">
              {/* be動詞の説明 */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-blue-800 mb-4 flex items-center">
                  <span className="mr-3 text-3xl">🟰</span>
                  be動詞とは？
                </h3>
                <p className="text-xl text-blue-700 mb-4 leading-relaxed">
                  動詞には、be動詞という特別な動詞があります。
                </p>
                <p className="text-xl text-blue-700 mb-4 leading-relaxed">
                  be動詞は<span className="bg-yellow-200 px-2 py-1 rounded font-bold">＝（イコール）</span>と一緒！
                </p>
                <div className="bg-white rounded-lg p-4 mb-4">
                  <p className="text-lg">
                    <span className="font-bold text-blue-600">I am a student.</span><br />
                    <span className="text-gray-600">（私＝生徒）</span>
                  </p>
                </div>
                <p className="text-lg text-blue-700">
                  そして、be動詞は基本的に<span className="bg-yellow-200 px-2 py-1 rounded font-bold">am, is, are</span>の３つしかありません。
                </p>
              </div>

              {/* 動詞の使い分け */}
              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-green-800 mb-4 flex items-center">
                  <span className="mr-3 text-3xl">⚡</span>
                  動詞の使い分け
                </h3>
                <p className="text-xl text-green-700 mb-4 leading-relaxed">
                  英語の文には必ず動詞を使わなければなりません。なので、一般動詞（likeやplayなど）か、be動詞(am,is,are)の２つを使い分けます。
                </p>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-lg mb-2">
                      <span className="font-bold text-green-600">be動詞の例：</span>
                    </p>
                    <p className="text-gray-700">She <span className="bg-yellow-200 px-1 rounded">is</span> a teacher. （彼女は先生です）</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-lg mb-2">
                      <span className="font-bold text-green-600">一般動詞の例：</span>
                    </p>
                    <p className="text-gray-700">I <span className="bg-yellow-200 px-1 rounded">like</span> soccer. （私はサッカーが好きです）</p>
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

// 選択ボタン
const ChoiceButton = ({ 
  choice, 
  isSelected, 
  isCorrect, 
  isIncorrect, 
  onClick 
}: {
  choice: string
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
      className={`px-6 py-4 text-lg font-semibold rounded-xl border-2 transition-all duration-300 min-w-[120px] ${getButtonStyle()}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={isCorrect || isIncorrect}
    >
      {choice}
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
      <p className="text-xl text-gray-600 mb-4">正解率: {Math.round((score / totalQuestions) * 100)}%</p>
      <p className="text-lg text-gray-600 mb-8">be動詞と一般動詞の見分け方がわかりましたね！</p>
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

export default function Stage1Lesson2() {
  const { user, isLoading } = useUser()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null)
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
  const choices = ['be動詞', '一般動詞']

  const handleChoiceClick = (choice: string) => {
    if (showResult) return
    setSelectedChoice(choice)
  }

  const handleSubmit = () => {
    if (!selectedChoice) return
    
    const isCorrect = selectedChoice === question.correctAnswer
    
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
          setSelectedChoice(null)
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
          setSelectedChoice(null)
          setShowResult(false)
        } else {
          // 初回終了、間違えた問題があるかチェック
          if (incorrectQuestions.length > 0 || !isCorrect) {
            const finalIncorrectQuestions = !isCorrect ? [...incorrectQuestions, currentQuestion] : incorrectQuestions
            if (finalIncorrectQuestions.length > 0) {
              setIncorrectQuestions(finalIncorrectQuestions)
              setIsRetryPhase(true)
              setRetryIndex(0)
              setSelectedChoice(null)
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
                      <span className="text-lg font-bold text-gray-700">1-2: be動詞</span>
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
                    この文にあるのはbe動詞？一般動詞？
                  </h2>
                  <div className="bg-gray-50 rounded-xl p-6 mb-6">
                    <p className="text-2xl font-bold text-gray-800 mb-2">{question.english}</p>
                    <p className="text-lg text-gray-600">（{question.japanese}）</p>
                  </div>
                </div>

                {/* 選択肢 */}
                <div className="flex justify-center gap-6 mb-8">
                  {choices.map((choice, index) => (
                    <ChoiceButton
                      key={index}
                      choice={choice}
                      isSelected={selectedChoice === choice}
                      isCorrect={showResult && choice === question.correctAnswer}
                      isIncorrect={showResult && selectedChoice === choice && choice !== question.correctAnswer}
                      onClick={() => handleChoiceClick(choice)}
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
                      {selectedChoice === question.correctAnswer ? (
                        <div className="text-green-600 mb-4">
                          <div className="text-4xl mb-2">🎉</div>
                          <p className="text-xl font-bold mb-2">正解です！</p>
                        </div>
                      ) : (
                        <div className="text-red-600 mb-4">
                          <div className="text-4xl mb-2">😅</div>
                          <p className="text-xl font-bold mb-2">不正解です。正解は「{question.correctAnswer}」でした。</p>
                        </div>
                      )}
                      <div className="bg-blue-50 rounded-lg p-4 max-w-2xl mx-auto">
                        <p className="text-sm text-blue-800">{question.explanation}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 回答ボタン */}
                {!showResult && (
                  <div className="text-center">
                    <motion.button
                      className={`px-8 py-3 text-xl font-bold rounded-xl transition-all duration-300 ${
                        selectedChoice 
                          ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg hover:shadow-xl' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      whileHover={selectedChoice ? { scale: 1.05 } : {}}
                      whileTap={selectedChoice ? { scale: 0.95 } : {}}
                      onClick={handleSubmit}
                      disabled={!selectedChoice}
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