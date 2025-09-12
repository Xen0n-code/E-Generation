'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useUser } from '@/contexts/UserContext'
import LoginScreen from '@/components/LoginScreen'
import Header from '@/components/Header'
import Link from 'next/link'

// ステージ1: be動詞の5つのサブステージ
const STAGE1_SUBSTAGES = [
  { 
    id: 1, 
    stageNumber: '1-1',
    title: '主語と動詞', 
    description: '文章の主人公と動作を見つけよう',
    completed: false,
    locked: false,
    emoji: '📝'
  },
  { 
    id: 2, 
    stageNumber: '1-2',
    title: 'be動詞', 
    description: 'be動詞と一般動詞の見分け方',
    completed: false,
    locked: false,
    emoji: '🟰'
  },
  { 
    id: 3, 
    stageNumber: '1-3',
    title: 'I am / You are', 
    description: '「私は〜です」「あなたは〜です」の表現',
    completed: false,
    locked: false,
    emoji: '👤'
  },
  { 
    id: 4, 
    stageNumber: '1-4',
    title: 'We/They are', 
    description: '「私たち/彼らは〜です」の表現',
    completed: false,
    locked: true,
    emoji: '👪'
  },
  { 
    id: 5, 
    stageNumber: '1-5',
    title: 'be動詞まとめ', 
    description: 'am, is, areの総復習',
    completed: false,
    locked: true,
    emoji: '✨'
  }
]

const StageCard = ({ substage, onClick, index }: {
  substage: typeof STAGE1_SUBSTAGES[0],
  onClick: () => void,
  index: number
}) => {
  const getCardColor = () => {
    if (substage.completed) return 'from-green-500 to-green-600'
    if (substage.locked) return 'from-gray-400 to-gray-500'
    return 'from-blue-500 to-blue-600'
  }

  const getBorderColor = () => {
    if (substage.completed) return 'border-green-300 hover:border-green-400'
    if (substage.locked) return 'border-gray-300'
    return 'border-blue-300 hover:border-blue-400'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`
        glass rounded-xl p-6 border-2 ${getBorderColor()} 
        ${!substage.locked ? 'hover:bg-white cursor-pointer' : 'opacity-60 cursor-not-allowed'}
        transition-all duration-300 relative
      `}
      whileHover={substage.locked ? {} : { scale: 1.02 }}
      onClick={substage.locked ? undefined : onClick}
    >
      {/* ステージ番号バッジ */}
      <div className="flex items-start justify-between mb-4">
        <div className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getCardColor()}`}>
          {substage.stageNumber}
        </div>
        <div className="text-3xl">
          {substage.emoji}
        </div>
      </div>
      
      {/* タイトルと説明 */}
      <h4 className="text-xl font-semibold mb-2">{substage.title}</h4>
      <p className="text-gray-600 text-sm mb-4">{substage.description}</p>
      
      {/* ステータス表示 */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {substage.completed && (
            <span className="flex items-center text-green-600">
              <span className="mr-1">✓</span>
              完了済み
            </span>
          )}
          {substage.locked && (
            <span className="flex items-center text-gray-500">
              <span className="mr-1">🔒</span>
              ロック中
            </span>
          )}
          {!substage.completed && !substage.locked && (
            <span className="flex items-center text-blue-600">
              <span className="mr-1">▶</span>
              学習可能
            </span>
          )}
        </div>
        
        <motion.button
          className={`
            px-4 py-2 rounded-lg font-medium text-white 
            bg-gradient-to-r ${getCardColor()} 
            ${!substage.locked ? 'hover:shadow-lg' : 'opacity-50 cursor-not-allowed'}
            transition-all duration-200
          `}
          whileHover={substage.locked ? {} : { scale: 1.05 }}
          whileTap={substage.locked ? {} : { scale: 0.95 }}
          onClick={substage.locked ? undefined : onClick}
          disabled={substage.locked}
        >
          {substage.completed ? '復習する' : substage.locked ? 'ロック中' : '学習開始'}
        </motion.button>
      </div>

      {/* 完了マーク */}
      {substage.completed && (
        <motion.div
          className="absolute -top-2 -right-2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-sm">⭐</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default function Stage1Page() {
  const { user, isLoading } = useUser()
  const [substages, setSubstages] = useState(STAGE1_SUBSTAGES)


  const handleStageClick = (substageId: number) => {
    if (substageId === 1) {
      window.location.href = '/grammar/junior/stage1/1-1'
    } else if (substageId === 2) {
      window.location.href = '/grammar/junior/stage1/1-2'
    } else if (substageId === 3) {
      window.location.href = '/grammar/junior/stage1/1-3'
    } else {
      alert(`サブステージ${substageId}の学習画面は準備中です`)
    }
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
          <motion.header 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link 
              href="/grammar/junior"
              className="inline-block mb-4 px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors rounded-lg bg-white shadow-sm hover:shadow-md"
            >
              ← 文法一覧に戻る
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 mb-2">
              ステージ1: be動詞
            </h1>
            <p className="text-lg text-gray-600">
              am, is, areの使い方をマスターしよう！
            </p>
          </motion.header>

          {/* プログレスバー */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white rounded-full shadow-lg p-2">
              <div className="flex items-center justify-between px-4 py-2">
                <span className="text-sm font-medium text-gray-600">進捗</span>
                <span className="text-sm font-bold text-blue-600">
                  {substages.filter(s => s.completed).length} / {substages.length}
                </span>
              </div>
              <div className="bg-gray-200 rounded-full h-2 mx-4 mb-2">
                <motion.div
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${(substages.filter(s => s.completed).length / substages.length) * 100}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
          </motion.div>

          {/* ステージ一覧 */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {substages.map((substage, index) => (
              <StageCard
                key={substage.id}
                substage={substage}
                onClick={() => handleStageClick(substage.id)}
                index={index}
              />
            ))}
          </motion.div>

          {/* 学習のヒント */}
          <motion.div
            className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <h3 className="text-lg font-bold text-orange-800 mb-2 flex items-center">
              <span className="mr-2">💡</span>
              学習のコツ
            </h3>
            <p className="text-orange-700">
              be動詞は英語の基礎中の基礎です。主語によってam, is, areを使い分けることが重要です。
              順番通りに学習して、確実にマスターしていきましょう！
            </p>
          </motion.div>
        </div>
      </div>
    </>
  )
}