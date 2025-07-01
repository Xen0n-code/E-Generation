'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Question, GameSession } from '@/types'

interface QuizComponentProps {
  questions: Question[]
  onComplete: (session: GameSession) => void
  stageId: string
}

export default function QuizComponent({ questions, onComplete, stageId }: QuizComponentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [startTime] = useState(new Date())
  const [timeLeft, setTimeLeft] = useState(30)
  const quizContainerRef = useRef<HTMLDivElement>(null)

  const currentQuestion = questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === questions.length - 1

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      handleTimeOut()
    }
  }, [timeLeft])

  const handleTimeOut = () => {
    if (selectedOption === null) {
      handleAnswer(-1)
    }
  }

  const handleAnswer = (optionIndex: number) => {
    setSelectedOption(optionIndex)
    setShowFeedback(true)
    
    const newAnswers = [...answers, optionIndex]
    setAnswers(newAnswers)

    setTimeout(() => {
      if (isLastQuestion) {
        const score = newAnswers.reduce((acc, answer, index) => {
          return answer === questions[index].correctAnswer ? acc + 1 : acc
        }, 0)

        const session: GameSession = {
          stageId,
          questions,
          currentQuestionIndex: currentQuestionIndex + 1,
          answers: newAnswers,
          score,
          startTime,
          endTime: new Date()
        }

        onComplete(session)
      } else {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setSelectedOption(null)
        setShowFeedback(false)
        setTimeLeft(30)
        
        // スクロール位置を維持（少し上にスクロールして問題が見えるようにする）
        if (quizContainerRef.current) {
          quizContainerRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          })
        }
      }
    }, 2000)
  }

  const isCorrect = selectedOption === currentQuestion.correctAnswer
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <motion.div
          ref={quizContainerRef}
          className="glass rounded-2xl p-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-700">
                問題 {currentQuestionIndex + 1} / {questions.length}
              </span>
              <div className={`text-lg font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-gray-700'}`}>
                ⏰ {timeLeft}秒
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  {currentQuestion.word.word}
                </h2>
                {currentQuestion.word.pronunciation && (
                  <p className="text-lg text-gray-600 mb-2">
                    / {currentQuestion.word.pronunciation} /
                  </p>
                )}
                {currentQuestion.word.example && (
                  <p className="text-gray-600 italic">
                    "{currentQuestion.word.example}"
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4">
                {currentQuestion.options.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => !showFeedback && handleAnswer(index)}
                    disabled={showFeedback}
                    className={`p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                      showFeedback
                        ? index === currentQuestion.correctAnswer
                          ? 'border-green-500 bg-green-100 text-green-800'
                          : selectedOption === index
                          ? 'border-red-500 bg-red-100 text-red-800'
                          : 'border-gray-200 bg-gray-50 text-gray-600'
                        : selectedOption === index
                        ? 'border-blue-500 bg-blue-100 text-blue-800'
                        : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                    }`}
                    whileHover={!showFeedback ? { scale: 1.02 } : {}}
                    whileTap={!showFeedback ? { scale: 0.98 } : {}}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="flex items-center">
                      <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-4 text-sm font-semibold">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="flex-1 text-lg">{option}</span>
                      {showFeedback && index === currentQuestion.correctAnswer && (
                        <span className="text-green-600 text-xl">✓</span>
                      )}
                      {showFeedback && selectedOption === index && index !== currentQuestion.correctAnswer && (
                        <span className="text-red-600 text-xl">✗</span>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>

              {showFeedback && (
                <motion.div
                  className={`mt-6 p-4 rounded-xl ${
                    isCorrect ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center">
                    <div className={`text-2xl font-bold mb-2 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                      {isCorrect ? '正解！' : '不正解'}
                    </div>
                    <p className="text-gray-700">
                      正解: {currentQuestion.options[currentQuestion.correctAnswer]}
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}