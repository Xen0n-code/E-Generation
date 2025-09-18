'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useUser } from '@/contexts/UserContext'
import LoginScreen from '@/components/LoginScreen'
import Header from '@/components/Header'
import Link from 'next/link'

const LESSONS = [
  { id: 1, title: '一般動詞の語順', description: '主語 + 動詞 + 目的語の基本語順', completed: false },
  { id: 2, title: '「3人称」ってなに？', description: '1人称、2人称、3人称の区別を学ぼう', completed: false },
  { id: 3, title: '一般動詞の変化', description: '3人称単数現在形での動詞の変化を学ぼう', completed: false },
  { id: 4, title: '三人称単数現在', description: '主語が三人称単数の時の動詞の変化', completed: false },
  { id: 5, title: '頻度を表す副詞', description: 'always, usually, often などの使い方', completed: false }
]

export default function Stage2Page() {
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
        <div className="max-w-4xl mx-auto">
          <motion.header
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/grammar/junior"
              className="inline-block mb-4 px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              ← 中学文法に戻る
            </Link>
            <div className="flex items-center justify-center mb-4">
              <div className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-semibold mr-4">
                ステージ 2
              </div>
              <div className="text-2xl">📘</div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 mb-4">
              一般動詞
            </h1>
            <p className="text-lg text-gray-600">
              動詞の基本的な使い方を学習しよう
            </p>
          </motion.header>

          <motion.div
            className="grid gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {LESSONS.map((lesson, index) => (
              <motion.div
                key={lesson.id}
                className="bg-white rounded-2xl shadow-lg border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                        {lesson.id}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{lesson.title}</h3>
                        <p className="text-gray-600 text-sm">{lesson.description}</p>
                      </div>
                    </div>
                    {lesson.completed && (
                      <div className="text-green-500 text-2xl">✅</div>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <Link href={
                      lesson.id === 1 ? "/grammar/junior/stage2/2-1" :
                      lesson.id === 2 ? "/grammar/junior/stage2/2-2" :
                      lesson.id === 3 ? "/grammar/junior/stage2/2-3" : "#"
                    }>
                      <motion.button
                        className={`px-6 py-2 rounded-lg font-medium text-white transition-all duration-200 ${
                          lesson.id <= 3
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:shadow-lg'
                            : 'bg-gray-400 cursor-not-allowed'
                        }`}
                        whileHover={lesson.id <= 3 ? { scale: 1.05 } : {}}
                        whileTap={lesson.id <= 3 ? { scale: 0.95 } : {}}
                        onClick={lesson.id > 3 ? () => {
                          alert(`レッスン${lesson.id}「${lesson.title}」は準備中です。`)
                        } : undefined}
                      >
                        {lesson.id <= 3 ? '学習開始' : '準備中'}
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="text-center mt-8 p-6 bg-blue-50 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h3 className="text-lg font-semibold text-blue-800 mb-2">🎯 学習のポイント</h3>
            <p className="text-blue-700">
              一般動詞は「動作」や「状態」を表す動詞です。be動詞以外の動詞がすべて一般動詞になります。<br/>
              英語の語順は日本語と異なるので、しっかりと順番を覚えましょう！
            </p>
          </motion.div>
        </div>
      </div>
    </>
  )
}