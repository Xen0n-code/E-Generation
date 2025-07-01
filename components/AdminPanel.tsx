'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getAllUserAccounts, createUserAccount, deleteUserAccount, UserAccount } from '@/services/adminService'
import { useUser } from '@/contexts/UserContext'

export default function AdminPanel() {
  const { user } = useUser()
  const [accounts, setAccounts] = useState<UserAccount[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newUsername, setNewUsername] = useState('')
  const [newDisplayName, setNewDisplayName] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    loadAccounts()
  }, [])

  const loadAccounts = async () => {
    try {
      setIsLoading(true)
      const accountList = await getAllUserAccounts()
      setAccounts(accountList)
    } catch (error) {
      console.error('Error loading accounts:', error)
      setError('アカウント一覧の取得に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newUsername.trim() || !newDisplayName.trim()) {
      setError('ユーザー名と表示名を入力してください')
      return
    }

    if (newUsername.trim().length < 2) {
      setError('ユーザー名は2文字以上で入力してください')
      return
    }

    if (accounts.some(acc => acc.username === newUsername.toLowerCase().trim())) {
      setError('そのユーザー名は既に存在します')
      return
    }

    setIsCreating(true)
    setError('')

    try {
      await createUserAccount(
        newUsername.trim(),
        newDisplayName.trim(),
        user?.username || 'admin'
      )
      
      setSuccess('ユーザーアカウントを作成しました')
      setNewUsername('')
      setNewDisplayName('')
      setShowCreateForm(false)
      await loadAccounts()
    } catch (error) {
      console.error('Error creating user:', error)
      setError('アカウント作成に失敗しました')
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteUser = async (username: string) => {
    if (username === 'admin') {
      setError('Adminアカウントは削除できません')
      return
    }

    if (!confirm(`ユーザー「${username}」を削除しますか？\nこの操作は取り消せません。`)) {
      return
    }

    try {
      await deleteUserAccount(username)
      setSuccess('ユーザーアカウントを削除しました')
      await loadAccounts()
    } catch (error) {
      console.error('Error deleting user:', error)
      setError('アカウント削除に失敗しました')
    }
  }

  // 成功・エラーメッセージの自動非表示
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000)
      return () => clearTimeout(timer)
    }
  }, [success])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        className="glass rounded-2xl p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">管理者パネル</h1>
          <motion.button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {showCreateForm ? 'キャンセル' : '新規ユーザー作成'}
          </motion.button>
        </div>

        {/* メッセージ表示 */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="mb-4 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.div>
          )}
          
          {success && (
            <motion.div
              className="mb-4 p-4 bg-green-100 border border-green-300 text-green-700 rounded-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ユーザー作成フォーム */}
        <AnimatePresence>
          {showCreateForm && (
            <motion.div
              className="mb-6 p-6 bg-blue-50 rounded-xl border border-blue-200"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold mb-4">新規ユーザー作成</h2>
              <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ユーザー名
                  </label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="半角英数字"
                    disabled={isCreating}
                    maxLength={20}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    表示名
                  </label>
                  <input
                    type="text"
                    value={newDisplayName}
                    onChange={(e) => setNewDisplayName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="日本語OK"
                    disabled={isCreating}
                    maxLength={30}
                  />
                </div>
                <div className="md:col-span-2">
                  <motion.button
                    type="submit"
                    disabled={isCreating}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: isCreating ? 1 : 1.02 }}
                    whileTap={{ scale: isCreating ? 1 : 0.98 }}
                  >
                    {isCreating ? '作成中...' : 'ユーザーを作成'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ユーザー一覧 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">登録ユーザー一覧</h2>
          
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">読み込み中...</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {accounts.map((account, index) => (
                <motion.div
                  key={account.username}
                  className="p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-lg">
                          {account.displayName}
                        </h3>
                        {account.username === 'admin' && (
                          <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                            管理者
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600">@{account.username}</p>
                      <p className="text-sm text-gray-500">
                        作成者: {account.createdBy}
                      </p>
                    </div>
                    
                    {account.username !== 'admin' && (
                      <motion.button
                        onClick={() => handleDeleteUser(account.username)}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        削除
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}