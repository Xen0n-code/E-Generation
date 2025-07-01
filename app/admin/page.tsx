'use client'

import { useUser } from '@/contexts/UserContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import LoginScreen from '@/components/LoginScreen'
import Header from '@/components/Header'
import AdminPanel from '@/components/AdminPanel'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function AdminPage() {
  const { user, isLoading } = useUser()
  const router = useRouter()

  // admin以外のユーザーを自動的にホームページにリダイレクト
  useEffect(() => {
    if (!isLoading && user && user.username !== 'admin') {
      router.push('/')
    }
  }, [user, isLoading, router])

  // ログイン状態確認中
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

  // ログインしていない場合
  if (!user) {
    return <LoginScreen />
  }

  // 管理者でない場合
  if (user.username !== 'admin') {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center p-4">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="glass rounded-2xl p-8 max-w-md mx-auto">
              <div className="text-6xl mb-4">🚫</div>
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                アクセス権限がありません
              </h1>
              <p className="text-gray-600 mb-6">
                この画面は管理者のみがアクセスできます。
              </p>
              <Link href="/">
                <motion.button
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ホームに戻る
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </>
    )
  }

  // 管理者の場合
  return (
    <>
      <Header />
      <div className="min-h-screen pt-6">
        <AdminPanel />
      </div>
    </>
  )
}