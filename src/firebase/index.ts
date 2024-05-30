import * as firebase from 'firebase/app'
import firebaseConfig from './firebaseConfig'
import { getFirestore } from 'firebase/firestore'
import { getFunctions, httpsCallable } from 'firebase/functions'
import {
  browserLocalPersistence,
  browserSessionPersistence,
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { axiosSetClientUrl } from 'src/configs/restClient'
import { UserTypes } from 'src/types/apps/userTypes'
import user from 'src/store/apps/user'

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig)
const auth = getAuth(app)

const db = getFirestore(app)
const functions = getFunctions(app, 'us-east1')

if (process.env.NODE_ENV === 'development') {
  console.log('EMULATOR RUNNING 🚀🚀 🚀 🚀  ')
  //I'm having problems setting up the evn.
  // db.settings({
  //   host: 'localhost:8081',
  //   ssl: false
  // });
  //Usar emmulador
  // functions.useFunctionsEmulator('http://192.168.1.210:9999');

  console.error(
    'FIREBASE MODE: ',
    process.env.NODE_ENV,
    ' Functions: http://192.168.1.210:9999',
  )
}

export const getUserByAccessToken = async (
  accessToken: string,
): Promise<UserTypes | undefined> => {
  try {
    const fn = httpsCallable(functions, 'getUserByAccessToken')
    const response = await fn({ accessToken })
    return response.data as UserTypes
  } catch (err) {
    console.error(err)
    throw err
  }
}
export const refreshAccessToken = async (): Promise<string | undefined> => {
  const token = await auth.currentUser?.getIdToken(true)
  return token
}

export const getAllCurrentProfile = async (): Promise<
  UserTypes | undefined
> => {
  const fn = httpsCallable(functions, 'getUserProfileV2')
  const profileDataResponse = await fn()
  const userData = profileDataResponse.data as UserTypes
  axiosSetClientUrl(userData.business.config,userData.testMode)
  return userData
}

export const signInByEmail = async (
  email: string,
  password: string,
  remember?: boolean,
) => {
  try {
    await setPersistence(
      auth,
      remember ? browserLocalPersistence : browserSessionPersistence,
    )

    const response = await signInWithEmailAndPassword(auth, email, password)

    return await getAllCurrentProfile()
  } catch (error: any) {
    console.log('Authentication error', error)
    debugger
    throw new Error(error.message)
  }
}

export const handleSignOut = async () => {
  try {
    await signOut(auth)
  } catch (error) {
    console.error('Error signing out:', error)
  }
}

export { db, firebase, functions, auth }
