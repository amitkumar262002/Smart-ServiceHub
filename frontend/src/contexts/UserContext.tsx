import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authService } from '../firebase/auth'

interface User {
  uid: string
  email?: string
  displayName?: string | null
  photoURL?: string | null
  phone?: string
  address?: string
  bio?: string
  website?: string
  social?: {
    linkedin?: string
    twitter?: string
    instagram?: string
    facebook?: string
  }
  verification?: {
    email?: boolean
    phone?: boolean
    identity?: boolean
    address?: boolean
  }
  stats?: {
    totalBookings?: number
    completedBookings?: number
    totalSpent?: number
    averageRating?: number
    responseRate?: number
    responseTime?: string
    memberSince?: string
  }
  achievements?: Array<{
    id: string
    title: string
    description: string
    icon: string
    earnedAt: string
  }>
  skills?: string[]
  languages?: string[]
  preferences?: {
    emailUpdates?: boolean
    notifications?: boolean
    darkMode?: boolean
    language?: string
  }
}

interface UserContextType {
  user: User | null
  loading: boolean
  updateUser: (updates: Partial<User>) => void
  refreshUser: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Load user from Firebase auth
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async (firebaseUser) => {
      setLoading(true)
      
      if (firebaseUser) {
        // Create base user object from Firebase
        const baseUser: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || undefined,
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          photoURL: firebaseUser.photoURL || null,
        }

        // Try to load additional user data from localStorage (for demo purposes)
        // In production, this would come from your backend API
        try {
          const storedUserData = localStorage.getItem(`user_${firebaseUser.uid}`)
          if (storedUserData) {
            const storedData = JSON.parse(storedUserData)
            setUser({ ...baseUser, ...storedData })
          } else {
            setUser(baseUser)
          }
        } catch (error) {
          console.log('No stored user data found, using base user')
          setUser(baseUser)
        }
      } else {
        setUser(null)
      }
      
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Update user function that syncs across all components
  const updateUser = (updates: Partial<User>) => {
    if (!user) return

    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)

    // Save to localStorage for persistence (demo purposes)
    // In production, this would save to your backend API
    try {
      localStorage.setItem(`user_${user.uid}`, JSON.stringify(updatedUser))
    } catch (error) {
      console.log('Failed to save user data to localStorage')
    }

    // Update Firebase auth profile if needed
    if (updates.displayName || updates.photoURL) {
      authService.updateProfile({
        displayName: updatedUser.displayName || undefined,
        photoURL: updatedUser.photoURL || undefined
      }).catch(error => {
        console.log('Failed to update Firebase profile:', error)
      })
    }
  }

  // Refresh user data
  const refreshUser = async () => {
    if (!user) return

    // In production, this would fetch fresh data from your backend API
    try {
      const storedUserData = localStorage.getItem(`user_${user.uid}`)
      if (storedUserData) {
        const storedData = JSON.parse(storedUserData)
        setUser({ ...user, ...storedData })
      }
    } catch (error) {
      console.log('Failed to refresh user data')
    }
  }

  const value: UserContextType = {
    user,
    loading,
    updateUser,
    refreshUser
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
