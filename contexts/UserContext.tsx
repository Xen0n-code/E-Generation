'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  username: string
  displayName: string
  loginTime: Date
}

interface UserContextType {
  user: User | null
  login: (username: string) => void
  logout: () => void
  isLoading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // ページ読み込み時に保存されたユーザー情報を復元
    const savedUser = localStorage.getItem('e-generation-user')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser({
          ...userData,
          loginTime: new Date(userData.loginTime)
        })
      } catch (error) {
        console.error('Failed to parse saved user data:', error)
        localStorage.removeItem('e-generation-user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = (username: string) => {
    const userData: User = {
      username: username.toLowerCase().trim(),
      displayName: username.trim(),
      loginTime: new Date()
    }
    
    setUser(userData)
    localStorage.setItem('e-generation-user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('e-generation-user')
    localStorage.removeItem('e-generation-progress')
    localStorage.removeItem('selected-level')
  }

  return (
    <UserContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </UserContext.Provider>
  )
}