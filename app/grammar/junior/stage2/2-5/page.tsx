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
    japanese: '私の両親は寿司が好きです',
    words: ['like', 'sushi', 'likes', 'My parents'],
    correctOrder: ['My parents', 'like', 'sushi'],
    explanation: '「My parents」は複数なので、動詞は「like」を使います（sは付けません）'
  },
  {
    id: 2,
    japanese: '彼はサッカーをします',
    words: ['He', 'soccer', 'plays', 'play'],
    correctOrder: ['He', 'plays', 'soccer'],
    explanation: '「He」は3人称単数なので、動詞は「plays」を使います（sを付けます）'
  },
  {
    id: 3,
    japanese: '彼らはたくさんの友達がいます',
    words: ['many', 'They', 'has', 'friends', 'have'],
    correctOrder: ['They', 'have', 'many', 'friends'],
    explanation: '「They」は複数なので、動詞は「have」を使います（「has」ではありません）'
  },
  {
    id: 4,
    japanese: 'ケンとマイクは東京に住んでいます',
    words: ['lives', 'Ken and Mike', 'in Tokyo', 'live'],
    correctOrder: ['Ken and Mike', 'live', 'in Tokyo'],
    explanation: '「Ken and Mike」は複数人なので、動詞は「live」を使います（sは付けません）'
  },
  {
    id: 5,
    japanese: '彼女は毎日学校に行きます',
    words: ['everyday', 'goes', 'She', 'go', 'to', 'school'],
    correctOrder: ['She', 'goes', 'to', 'school', 'everyday'],
    explanation: '「She」は3人称単数なので、動詞は「goes」を使います（sを付けます）'
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
              <h2 className="text-3xl font-bold text-gray-800 mb-4">sは3人称単数</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto rounded-full"></div>
            </div>

            <div className="space-y-8">
              {/* 基本説明 */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-blue-800 mb-4 flex items-center">
                  <span className="mr-3 text-3xl">📚</span>
                  3単現の「単」とは？
                </h3>
                <p className="text-xl text-blue-700 mb-4 leading-relaxed">
                  今まで、一般動詞に付けたsは、「3単現のs」と呼ぶという話をしました。
                </p>
                <p className="text-xl text-blue-700 mb-4 leading-relaxed">
                  このステージでは、「3単現」の「単」の部分に注目します。
                </p>
                <p className="text-xl text-blue-700 leading-relaxed">
                  「単」とは「単数」の略です。
                </p>
              </div>

              {/* 単数と複数の説明 */}
              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-green-800 mb-4 flex items-center">
                  <span className="mr-3 text-3xl">👥</span>
                  単数と複数の違い
                </h3>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="text-lg font-bold text-green-600 mb-2">単数の場合（1人）</h4>
                    <p className="text-gray-700 mb-2">He <span className="bg-yellow-200 px-2 py-1 rounded font-bold">plays</span> soccer.</p>
                    <p className="text-sm text-gray-600">→ 動詞にsが付く</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="text-lg font-bold text-green-600 mb-2">複数の場合（2人以上）</h4>
                    <p className="text-gray-700 mb-2">My parents <span className="bg-yellow-200 px-2 py-1 rounded font-bold">like</span> sushi.</p>
                    <p className="text-sm text-gray-600">→ 動詞にsは付かない</p>
                  </div>
                </div>
              </div>

              {/* 具体例 */}
              <div className="bg-yellow-50 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-yellow-800 mb-4 flex items-center">
                  <span className="mr-3 text-3xl">✨</span>
                  重要なポイント
                </h3>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-lg">
                      <span className="font-bold text-yellow-600">My parents（両親）</span>のように、「単数人」ではなく、「複数人」いる場合は、sは付けません。
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-lg">
                      <span className="font-bold text-yellow-600">Ken and Mike</span>、<span className="font-bold text-yellow-600">We</span>、<span className="font-bold text-yellow-600">They</span> なども複数なので、動詞にsは付きません。
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

// 単語ボタン
const WordButton = ({
  word,
  isSelected,
  isUsed,
  onClick,
  index
}: {
  word: string
  isSelected: boolean
  isUsed: boolean
  onClick: () => void
  index: number
}) => {
  const getButtonStyle = () => {
    if (isUsed) return 'bg-gray-300 text-gray-500 border-gray-300 opacity-50 cursor-not-allowed'
    if (isSelected) return 'bg-blue-500 text-white border-blue-500'
    return 'bg-white text-gray-800 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
  }

  return (
    <motion.button
      className={`px-4 py-3 text-lg font-semibold rounded-xl border-2 transition-all duration-300 ${getButtonStyle()}`}
      whileHover={isUsed ? {} : { scale: 1.05 }}
      whileTap={isUsed ? {} : { scale: 0.95 }}
      onClick={isUsed ? undefined : onClick}
      disabled={isUsed}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      {word}
    </motion.button>
  )
}

// 回答エリア
const AnswerArea = ({
  selectedWords,
  onWordClick
}: {
  selectedWords: string[]
  onWordClick: (index: number) => void
}) => {
  return (
    <div className="bg-gray-50 rounded-xl p-6 min-h-[100px] flex flex-wrap gap-3 items-center justify-center">
      {selectedWords.length === 0 ? (
        <p className="text-gray-400 text-lg">単語を選んで文章を作ってください</p>
      ) : (
        selectedWords.map((word, index) => (
          <motion.button
            key={index}
            className="px-4 py-3 text-lg font-semibold rounded-xl border-2 bg-blue-500 text-white border-blue-500 hover:bg-blue-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onWordClick(index)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {word}
          </motion.button>
        ))
      )}
    </div>
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

export default function Stage2Lesson5() {
  const { user, isLoading } = useUser()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedWords, setSelectedWords] = useState<string[]>([])
  const [usedWords, setUsedWords] = useState<string[]>([])
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

  // 単語をシャッフル
  const getShuffledWords = (words: string[]) => {
    const shuffled = [...words]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const [shuffledWords] = useState<{ [key: number]: string[] }>(() => {
    const shuffled: { [key: number]: string[] } = {}
    QUESTIONS.forEach(q => {
      shuffled[q.id] = getShuffledWords(q.words)
    })
    return shuffled
  })

  const handleWordClick = (word: string) => {
    if (showResult || usedWords.includes(word)) return
    setSelectedWords([...selectedWords, word])
    setUsedWords([...usedWords, word])
  }

  const handleSelectedWordClick = (index: number) => {
    if (showResult) return
    const wordToRemove = selectedWords[index]
    setSelectedWords(selectedWords.filter((_, i) => i !== index))
    setUsedWords(usedWords.filter(w => w !== wordToRemove))
  }

  const handleSubmit = () => {
    if (selectedWords.length === 0) return

    const userAnswer = selectedWords.join(' ')
    const correctAnswer = question.correctOrder.join(' ')
    const isCorrect = userAnswer === correctAnswer

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
          resetQuestion()
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
          resetQuestion()
        } else {
          // 初回終了、間違えた問題があるかチェック
          if (incorrectQuestions.length > 0 || !isCorrect) {
            const finalIncorrectQuestions = !isCorrect ? [...incorrectQuestions, currentQuestion] : incorrectQuestions
            if (finalIncorrectQuestions.length > 0) {
              setIncorrectQuestions(finalIncorrectQuestions)
              setIsRetryPhase(true)
              setRetryIndex(0)
              resetQuestion()
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

  const resetQuestion = () => {
    setSelectedWords([])
    setUsedWords([])
    setShowResult(false)
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
                      <span className="text-lg font-bold text-gray-700">2-5: sは3人称単数</span>
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
                    単語を並べ替えて文章を作ってください
                  </h2>
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <p className="text-xl font-bold text-gray-800">{question.japanese}</p>
                  </div>
                </div>

                {/* 回答エリア */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">作った文章：</h3>
                  <AnswerArea
                    selectedWords={selectedWords}
                    onWordClick={handleSelectedWordClick}
                  />
                </div>

                {/* 単語選択 */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">単語を選んでください：</h3>
                  <div className="flex flex-wrap justify-center gap-3">
                    {shuffledWords[question.id].map((word, index) => (
                      <WordButton
                        key={word}
                        word={word}
                        isSelected={selectedWords.includes(word)}
                        isUsed={usedWords.includes(word)}
                        onClick={() => handleWordClick(word)}
                        index={index}
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
                      {selectedWords.join(' ') === question.correctOrder.join(' ') ? (
                        <div className="text-green-600">
                          <div className="text-4xl mb-2">🎉</div>
                          <p className="text-xl font-bold">正解です！</p>
                        </div>
                      ) : (
                        <div className="text-red-600">
                          <div className="text-4xl mb-2">😅</div>
                          <p className="text-xl font-bold">不正解です。</p>
                          <p className="text-lg mt-2">正解: {question.correctOrder.join(' ')}</p>
                        </div>
                      )}
                      <div className="bg-blue-50 rounded-lg p-4 mt-4">
                        <p className="text-blue-800">{question.explanation}</p>
                      </div>
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