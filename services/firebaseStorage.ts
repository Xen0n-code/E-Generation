import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { UserProgress } from '@/types'

export interface FirebaseUserProgress extends UserProgress {
  lastUpdated: any // Firestore timestamp
  username: string
}

export const saveProgressToFirebase = async (username: string, progress: UserProgress): Promise<void> => {
  try {
    const userDocRef = doc(db, 'user_progress', username.toLowerCase())
    
    const firebaseProgress: FirebaseUserProgress = {
      ...progress,
      username: username.toLowerCase(),
      lastUpdated: serverTimestamp()
    }
    
    await setDoc(userDocRef, firebaseProgress, { merge: true })
    console.log(`Progress saved to Firebase for user: ${username}`)
  } catch (error) {
    console.error('Error saving progress to Firebase:', error)
    throw error
  }
}

export const loadProgressFromFirebase = async (username: string): Promise<UserProgress | null> => {
  try {
    const userDocRef = doc(db, 'user_progress', username.toLowerCase())
    const docSnap = await getDoc(userDocRef)
    
    if (docSnap.exists()) {
      const data = docSnap.data() as FirebaseUserProgress
      console.log(`Progress loaded from Firebase for user: ${username}`)
      
      // Firebaseのタイムスタンプを除いてUserProgressオブジェクトを返す
      return {
        completedStages: data.completedStages || [],
        currentLevel: data.currentLevel || '5級',
        totalScore: data.totalScore || 0,
        achievements: data.achievements || []
      }
    } else {
      console.log(`No progress found in Firebase for user: ${username}`)
      return null
    }
  } catch (error) {
    console.error('Error loading progress from Firebase:', error)
    return null
  }
}

export const syncProgressToFirebase = async (username: string): Promise<void> => {
  try {
    // ローカルストレージから現在の進捗を取得
    const localProgress = localStorage.getItem('e-generation-progress')
    if (localProgress) {
      const progress: UserProgress = JSON.parse(localProgress)
      await saveProgressToFirebase(username, progress)
    }
  } catch (error) {
    console.error('Error syncing progress to Firebase:', error)
  }
}