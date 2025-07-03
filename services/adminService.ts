import { doc, getDoc, setDoc, serverTimestamp, collection, getDocs, deleteDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export interface UserAccount {
  username: string
  displayName: string
  createdAt: any
  createdBy: string
  isActive: boolean
}

// Admin初期化（初回起動時のみ）
export const initializeAdmin = async (): Promise<void> => {
  try {
    console.log('Initializing admin account...')
    const adminDocRef = doc(db, 'user_accounts', 'admin')
    const adminDoc = await getDoc(adminDocRef)
    
    if (!adminDoc.exists()) {
      const adminAccount: UserAccount = {
        username: 'admin',
        displayName: 'Administrator',
        createdAt: serverTimestamp(),
        createdBy: 'system',
        isActive: true
      }
      
      await setDoc(adminDocRef, adminAccount)
      console.log('✅ Admin account initialized successfully')
    } else {
      console.log('✅ Admin account already exists')
    }
  } catch (error) {
    console.error('❌ Error initializing admin:', error)
    // エラーが発生した場合の詳細情報
    if (error instanceof Error) {
      console.error('Error details:', error.message)
    }
  }
}

// ユーザーアカウント存在確認
export const checkUserExists = async (username: string): Promise<boolean> => {
  try {
    console.log(`Checking user existence: ${username}`)
    const userDocRef = doc(db, 'user_accounts', username.toLowerCase())
    const userDoc = await getDoc(userDocRef)
    
    const exists = userDoc.exists()
    const isActive = userDoc.data()?.isActive === true
    
    console.log(`User ${username}:`, { exists, isActive, data: userDoc.data() })
    
    return exists && isActive
  } catch (error) {
    console.error('❌ Error checking user existence:', error)
    if (error instanceof Error) {
      console.error('Error details:', error.message)
    }
    return false
  }
}

// 新規ユーザーアカウント作成（Admin専用）
export const createUserAccount = async (
  username: string, 
  displayName: string, 
  createdBy: string
): Promise<void> => {
  try {
    const userDocRef = doc(db, 'user_accounts', username.toLowerCase())
    
    const userAccount: UserAccount = {
      username: username.toLowerCase(),
      displayName,
      createdAt: serverTimestamp(),
      createdBy,
      isActive: true
    }
    
    await setDoc(userDocRef, userAccount)
    console.log(`User account created: ${username}`)
  } catch (error) {
    console.error('Error creating user account:', error)
    throw error
  }
}

// 全ユーザーアカウント取得
export const getAllUserAccounts = async (): Promise<UserAccount[]> => {
  try {
    const accountsCollection = collection(db, 'user_accounts')
    const accountsSnapshot = await getDocs(accountsCollection)
    
    const accounts: UserAccount[] = []
    accountsSnapshot.forEach((doc) => {
      accounts.push(doc.data() as UserAccount)
    })
    
    return accounts.sort((a, b) => a.username.localeCompare(b.username))
  } catch (error) {
    console.error('Error getting user accounts:', error)
    return []
  }
}

// ユーザーアカウント削除
export const deleteUserAccount = async (username: string): Promise<void> => {
  try {
    if (username.toLowerCase() === 'admin') {
      throw new Error('Admin account cannot be deleted')
    }
    
    const userDocRef = doc(db, 'user_accounts', username.toLowerCase())
    await deleteDoc(userDocRef)
    
    // 進捗データも削除
    const progressDocRef = doc(db, 'user_progress', username.toLowerCase())
    await deleteDoc(progressDocRef)
    
    console.log(`User account deleted: ${username}`)
  } catch (error) {
    console.error('Error deleting user account:', error)
    throw error
  }
}