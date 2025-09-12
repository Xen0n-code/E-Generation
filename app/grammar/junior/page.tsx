'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useUser } from '@/contexts/UserContext'
import LoginScreen from '@/components/LoginScreen'
import Header from '@/components/Header'
import Link from 'next/link'

const GRAMMAR_STAGES = [
  { id: 1, title: 'be動詞', description: 'am, is, areの使い方を学習', level: 'basic' },
  { id: 2, title: '一般動詞', description: '動詞の基本的な使い方', level: 'basic' },
  { id: 3, title: '品詞について', description: '名詞、動詞、形容詞、副詞など', level: 'basic' },
  { id: 4, title: '否定文', description: 'notを使った否定の表現', level: 'basic' },
  { id: 5, title: '疑問文', description: 'Yes/No疑問文の作り方', level: 'basic' },
  { id: 6, title: '疑問詞の疑問文', description: 'what, who, whenなどを使った疑問文', level: 'basic' },
  { id: 7, title: '複数形・命令文・代名詞', description: 's/es、命令文、I, you, heなど', level: 'basic' },
  { id: 8, title: '現在進行形', description: 'be + ~ing の表現', level: 'intermediate' },
  { id: 9, title: '過去形・過去進行形', description: '過去の出来事の表現', level: 'intermediate' },
  { id: 10, title: '未来の文', description: 'will, be going toの使い方', level: 'intermediate' },
  { id: 11, title: '助動詞', description: 'can, must, mayなどの使い方', level: 'intermediate' },
  { id: 12, title: '不定詞・動名詞', description: 'to + 動詞、~ing形の名詞的用法', level: 'intermediate' },
  { id: 13, title: '接続詞', description: 'and, but, becauseなどの使い方', level: 'intermediate' },
  { id: 14, title: '比較', description: '比較級、最上級の作り方', level: 'intermediate' },
  { id: 15, title: '受け身', description: 'be + 過去分詞の表現', level: 'advanced' },
  { id: 16, title: '現在完了', description: 'have + 過去分詞の表現', level: 'advanced' },
  { id: 17, title: '重要表現', description: 'よく使われる慣用表現', level: 'advanced' },
  { id: 18, title: '関係代名詞', description: 'who, which, thatの使い方', level: 'advanced' },
  { id: 19, title: '後置修飾', description: '名詞を後ろから修飾する方法', level: 'expert' },
  { id: 20, title: '仮定法', description: 'if文の特殊な用法', level: 'expert' }
]

const getLevelColor = (level: string) => {
  switch (level) {
    case 'basic': return 'from-green-500 to-green-600'
    case 'intermediate': return 'from-blue-500 to-blue-600'
    case 'advanced': return 'from-purple-500 to-purple-600'
    case 'expert': return 'from-red-500 to-red-600'
    default: return 'from-gray-500 to-gray-600'
  }
}

const getLevelBorder = (level: string) => {
  switch (level) {
    case 'basic': return 'border-green-300 hover:border-green-400'
    case 'intermediate': return 'border-blue-300 hover:border-blue-400'
    case 'advanced': return 'border-purple-300 hover:border-purple-400'
    case 'expert': return 'border-red-300 hover:border-red-400'
    default: return 'border-gray-300 hover:border-gray-400'
  }
}

export default function JuniorGrammarPage() {
  const { user, isLoading } = useUser()

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
      <div className="min-h-screen p-4">
        <div className="max-w-6xl mx-auto">
          <motion.header 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link 
              href="/"
              className="inline-block mb-4 px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              ← ホームに戻る
            </Link>
            <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 mb-4">
              中学文法
            </h1>
            <p className="text-lg text-gray-600">
              基礎から応用まで20ステージで英文法をマスター
            </p>
          </motion.header>

          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="glass rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">学習レベルについて</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-green-600 rounded mr-2"></div>
                  <span>基礎（ステージ1-7）</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded mr-2"></div>
                  <span>中級（ステージ8-14）</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded mr-2"></div>
                  <span>上級（ステージ15-18）</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-red-600 rounded mr-2"></div>
                  <span>発展（ステージ19-20）</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {GRAMMAR_STAGES.map((stage, index) => (
              <motion.div
                key={stage.id}
                className={`glass rounded-xl p-6 border-2 ${getLevelBorder(stage.level)} hover:bg-white transition-all duration-300 cursor-pointer`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getLevelColor(stage.level)}`}>
                    ステージ {stage.id}
                  </div>
                  <div className="text-2xl">
                    {stage.level === 'expert' && '🚀'}
                    {stage.level === 'advanced' && '⭐'}
                    {stage.level === 'intermediate' && '📘'}
                    {stage.level === 'basic' && '📗'}
                  </div>
                </div>
                
                <h4 className="text-xl font-semibold mb-2">{stage.title}</h4>
                <p className="text-gray-600 text-sm mb-4">{stage.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {stage.id <= 7 && '基礎レベル'}
                    {stage.id >= 8 && stage.id <= 14 && '中級レベル'}
                    {stage.id >= 15 && stage.id <= 18 && '上級レベル'}
                    {stage.id >= 19 && '発展レベル'}
                  </div>
                  
                  <Link href={stage.id === 1 ? "/grammar/junior/stage1" : "#"}>
                    <motion.button
                      className={`px-4 py-2 rounded-lg font-medium text-white bg-gradient-to-r ${getLevelColor(stage.level)} hover:shadow-lg transition-all duration-200`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={stage.id !== 1 ? () => {
                        alert(`ステージ${stage.id}「${stage.title}」の学習ページは準備中です。`)
                      } : undefined}
                    >
                      {stage.id === 1 ? '学習開始' : '準備中'}
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  )
}