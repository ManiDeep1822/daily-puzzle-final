import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyCaXomDqsUERhzwQ3pdbIilqMZpOfYrGPM',
  authDomain: 'daily-puzzle-app-93be6.firebaseapp.com',
  projectId: 'daily-puzzle-app-93be6',
  appId: '1:999656674650:web:d6abc9f56763852c8c0f63',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
