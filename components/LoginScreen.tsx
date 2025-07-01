'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useUser } from '@/contexts/UserContext'
import { loadProgressFromFirebase, syncProgressToFirebase } from '@/services/firebaseStorage'
import { checkUserExists, initializeAdmin } from '@/services/adminService'

export default function LoginScreen() {
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useUser()
  const router = useRouter()

  // Admin初期化
  useEffect(() => {
    initializeAdmin()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!username.trim()) {
      setError('ユーザー名を入力してください')
      return
    }

    if (username.trim().length < 2) {
      setError('ユーザー名は2文字以上で入力してください')
      return
    }

    if (username.trim().length > 20) {
      setError('ユーザー名は20文字以下で入力してください')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const trimmedUsername = username.trim()
      
      // ユーザーアカウント存在確認
      const userExists = await checkUserExists(trimmedUsername)
      
      if (!userExists) {
        setError('そのユーザーは存在しません。管理者にアカウント作成を依頼してください。')
        setIsLoading(false)
        return
      }
      
      // Firebaseから進捗データを取得
      const firebaseProgress = await loadProgressFromFirebase(trimmedUsername)
      
      if (firebaseProgress) {
        // Firebase上にデータがある場合、ローカルストレージに保存
        localStorage.setItem('e-generation-progress', JSON.stringify(firebaseProgress))
        console.log('Firebase進捗データをローカルに同期しました')
      } else {
        // Firebase上にデータがない場合、ローカルの進捗をFirebaseに同期
        await syncProgressToFirebase(trimmedUsername)
        console.log('ローカル進捗データをFirebaseに同期しました')
      }
      
      // ログイン実行
      login(trimmedUsername)
      
      // ログイン成功後、ホームページにリダイレクト
      router.push('/')
    } catch (error) {
      console.error('Login error:', error)
      setError('ログインに失敗しました。しばらく後にお試しください。')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="glass rounded-2xl p-8 shadow-xl">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
              E-Generation
            </h1>
            <p className="text-gray-600">
              英検各級の英単語をマスターしよう
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleLogin}
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                ユーザー名
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                placeholder="お名前を入力してください"
                disabled={isLoading}
                maxLength={20}
              />
            </div>

            {error && (
              <motion.div
                className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {error}
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  ログイン中...
                </div>
              ) : (
                'ログイン'
              )}
            </motion.button>
          </motion.form>

          <motion.div
            className="mt-6 text-center text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <p>ユーザー名を入力するだけで始められます</p>
            <p className="mt-1">進捗状況は自動的に保存されます</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}