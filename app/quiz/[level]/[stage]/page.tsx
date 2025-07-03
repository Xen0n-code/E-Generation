'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { EikenLevel, GameSession } from '@/types'
import { generateQuestions, isStageCleared } from '@/utils/gameLogic'
import { updateStageCompletion } from '@/utils/storage'
import { useUser } from '@/contexts/UserContext'
import QuizComponent from '@/components/QuizComponent'
import ResultComponent from '@/components/ResultComponent'
import LoginScreen from '@/components/LoginScreen'

export default function QuizPage() {
  const { user, isLoading } = useUser()
  const params = useParams()
  const router = useRouter()
  const [gameSession, setGameSession] = useState<GameSession | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [questions, setQuestions] = useState<any[]>([])

  const level = decodeURIComponent(params.level as string) as EikenLevel
  const stage = parseInt(params.stage as string)

  // ログイン状態確認
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

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const generatedQuestions = await generateQuestions(level, stage)
        setQuestions(generatedQuestions)
      } catch (error) {
        console.error('Failed to generate questions:', error)
        router.push('/')
      }
    }
    loadQuestions()
  }, [level, stage, router])

  const handleQuizComplete = async (session: GameSession) => {
    setGameSession(session)
    setShowResult(true)
    
    if (isStageCleared(session.score)) {
      await updateStageCompletion(session.stageId, session.score)
    }
  }

  const handleRestart = async () => {
    setShowResult(false)
    setGameSession(null)
    try {
      const generatedQuestions = await generateQuestions(level, stage)
      setQuestions(generatedQuestions)
    } catch (error) {
      console.error('Failed to generate questions:', error)
      router.push('/')
    }
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">クイズを準備中...</p>
        </div>
      </div>
    )
  }

  if (showResult && gameSession) {
    return (
      <ResultComponent
        session={gameSession}
        onRestart={handleRestart}
      />
    )
  }

  return (
    <QuizComponent
      questions={questions}
      onComplete={handleQuizComplete}
      stageId={`${level}-${stage}`}
    />
  )
}