'use client'

import { motion } from 'framer-motion'
import { GameSession, PASSING_SCORE } from '@/types'
import { getScorePercentage, formatScore } from '@/utils/gameLogic'
import Link from 'next/link'

interface ResultComponentProps {
  session: GameSession
  onRestart: () => void
}

export default function ResultComponent({ session, onRestart }: ResultComponentProps) {
  const { score, questions, answers } = session
  const percentage = getScorePercentage(score)
  const isPassed = score >= PASSING_SCORE
  const scoreColor = isPassed ? 'text-green-600' : 'text-red-600'
  const bgColor = isPassed ? 'from-green-50 to-green-100' : 'from-red-50 to-red-100'

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <motion.div
          className={`glass rounded-2xl p-8 bg-gradient-to-br ${bgColor}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <motion.div
              className="text-6xl mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {isPassed ? '🎉' : '😔'}
            </motion.div>
            
            <motion.h1
              className={`text-4xl font-bold mb-4 ${scoreColor}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {isPassed ? 'ステージクリア！' : 'もう一度挑戦！'}
            </motion.h1>
            
            <motion.div
              className="text-2xl font-semibold text-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              スコア: {formatScore(score)} ({percentage}%)
            </motion.div>
            
            {isPassed ? (
              <motion.p
                className="text-green-700 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                {PASSING_SCORE}問以上正解でクリア！次のステージが解放されました。
              </motion.p>
            ) : (
              <motion.p
                className="text-red-700 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                クリアには{PASSING_SCORE}問以上の正解が必要です。
              </motion.p>
            )}
          </div>

          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h2 className="text-2xl font-semibold mb-4 text-center">詳細結果</h2>
            <div className="grid gap-4">
              {questions.map((question, index) => {
                const userAnswer = answers[index]
                const isCorrect = userAnswer === question.correctAnswer
                
                return (
                  <motion.div
                    key={question.id}
                    className={`p-4 rounded-xl border-2 ${
                      isCorrect 
                        ? 'border-green-300 bg-green-50' 
                        : 'border-red-300 bg-red-50'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className={`text-xl mr-3 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                            {isCorrect ? '✓' : '✗'}
                          </span>
                          <span className="font-semibold text-lg">
                            {question.word.word}
                          </span>
                        </div>
                        <div className="ml-8">
                          <p className="text-gray-600">
                            正解: {question.options[question.correctAnswer]}
                          </p>
                          {!isCorrect && userAnswer >= 0 && (
                            <p className="text-red-600">
                              あなたの回答: {question.options[userAnswer]}
                            </p>
                          )}
                          {userAnswer === -1 && (
                            <p className="text-red-600">
                              時間切れ (未回答)
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <motion.button
              onClick={onRestart}
              className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              もう一度挑戦
            </motion.button>
            
            <Link href="/">
              <motion.button
                className="px-8 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-xl transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ホームに戻る
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}