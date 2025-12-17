import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail, signOut, updateProfile, User as FirebaseUser, UserCredential } from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { app, db } from './config'
import { api } from '@/api/client'

export interface User {
  uid: string
  email: string
  displayName: string | null
  photoURL: string | null
  role: 'user' | 'provider' | 'admin'
  phone?: string
  createdAt: any
  lastLogin: any
  isEmailVerified: boolean
  profileCompleted: boolean
}

export interface AuthResult {
  success: boolean
  user?: User
  error?: string
  needsVerification?: boolean
}

const auth = getAuth(app as any)

class AuthService {
  async signUp(
    email: string, 
    password: string, 
    name: string, 
    role: 'user' | 'provider',
    phone?: string
  ): Promise<AuthResult> {
    try {
      // Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user

      // Update profile with display name
      await updateProfile(firebaseUser, { displayName: name })

      // Create user document in Firestore
      const userData: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        displayName: name,
        photoURL: firebaseUser.photoURL,
        role,
        phone: phone || '',
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        isEmailVerified: firebaseUser.emailVerified,
        profileCompleted: false
      }

      await setDoc(doc(db, 'users', firebaseUser.uid), userData)

      // Send email verification
      await this.sendEmailVerification(firebaseUser)

      // Store in local storage
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('token', await firebaseUser.getIdToken())

      return {
        success: true,
        user: userData,
        needsVerification: !firebaseUser.emailVerified
      }
    } catch (error: any) {
      console.error('Signup error:', error)
      return {
        success: false,
        error: this.getErrorMessage(error.code)
      }
    }
  }

  async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user

      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
      let userData: User

      if (userDoc.exists()) {
        userData = userDoc.data() as User
        userData.lastLogin = serverTimestamp()
        
        // Update last login
        await setDoc(doc(db, 'users', firebaseUser.uid), userData, { merge: true })
      } else {
        // Create user document if it doesn't exist
        userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          role: 'user',
          phone: '',
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          isEmailVerified: firebaseUser.emailVerified,
          profileCompleted: false
        }
        await setDoc(doc(db, 'users', firebaseUser.uid), userData)
      }

      // Store in local storage
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('token', await firebaseUser.getIdToken())

      return {
        success: true,
        user: userData,
        needsVerification: !firebaseUser.emailVerified
      }
    } catch (error: any) {
      console.error('Sign in error:', error)
      return {
        success: false,
        error: this.getErrorMessage(error.code)
      }
    }
  }

  async signInWithGoogle(): Promise<AuthResult> {
    try {
      const provider = new GoogleAuthProvider()
      const userCredential = await signInWithPopup(auth, provider)
      const firebaseUser = userCredential.user

      // Get or create user document
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
      let userData: User

      if (userDoc.exists()) {
        userData = userDoc.data() as User
        userData.lastLogin = serverTimestamp()
        await setDoc(doc(db, 'users', firebaseUser.uid), userData, { merge: true })
      } else {
        // New user from Google - ask for role
        userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          role: 'user', // Default role, can be changed later
          phone: '',
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          isEmailVerified: firebaseUser.emailVerified,
          profileCompleted: false
        }
        await setDoc(doc(db, 'users', firebaseUser.uid), userData)
      }

      // Store in local storage
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('token', await firebaseUser.getIdToken())

      return {
        success: true,
        user: userData,
        needsVerification: !firebaseUser.emailVerified
      }
    } catch (error: any) {
      console.error('Google sign in error:', error)
      return {
        success: false,
        error: this.getErrorMessage(error.code)
      }
    }
  }

  async resetPassword(email: string): Promise<AuthResult> {
    try {
      await sendPasswordResetEmail(auth, email)
      return {
        success: true
      }
    } catch (error: any) {
      console.error('Password reset error:', error)
      return {
        success: false,
        error: this.getErrorMessage(error.code)
      }
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(auth)
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  async sendEmailVerification(user: FirebaseUser): Promise<void> {
    try {
      // Note: In a real app, you'd use sendEmailVerification
      // For now, we'll just log it
      console.log('Email verification sent to:', user.email)
    } catch (error) {
      console.error('Email verification error:', error)
    }
  }

  getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem('user')
      return userStr ? JSON.parse(userStr) : null
    } catch (error) {
      console.error('Get current user error:', error)
      return null
    }
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
        if (userDoc.exists()) {
          callback(userDoc.data() as User)
        } else {
          callback(null)
        }
      } else {
        callback(null)
      }
    })
  }

  private getErrorMessage(errorCode: string): string {
    const errorMessages: Record<string, string> = {
      'auth/email-already-in-use': 'This email is already registered. Please login.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/weak-password': 'Password should be at least 6 characters long.',
      'auth/user-not-found': 'No account found with this email address.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
      'auth/popup-closed-by-user': 'Sign-in popup was closed before completion.',
      'auth/cancelled-popup-request': 'Sign-in was cancelled.',
      'auth/operation-not-allowed': 'This sign-in method is not enabled.',
      'auth/invalid-credential': 'Invalid credentials provided.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/expired-action-code': 'The verification code has expired.',
      'auth/invalid-action-code': 'The verification code is invalid.',
      'auth/missing-email': 'Please provide an email address.',
      'auth/missing-password': 'Please provide a password.'
    }

    return errorMessages[errorCode] || 'An error occurred. Please try again.'
  }

  async updateProfile(userData: Partial<User>): Promise<AuthResult> {
    try {
      const currentUser = this.getCurrentUser()
      if (!currentUser) {
        return { success: false, error: 'No user logged in' }
      }

      // Update Firestore document
      await setDoc(doc(db, 'users', currentUser.uid), userData, { merge: true })

      // Update local storage
      const updatedUser = { ...currentUser, ...userData }
      localStorage.setItem('user', JSON.stringify(updatedUser))

      return { success: true, user: updatedUser }
    } catch (error: any) {
      console.error('Update profile error:', error)
      return {
        success: false,
        error: 'Failed to update profile. Please try again.'
      }
    }
  }
}

export const authService = new AuthService()
export default authService
