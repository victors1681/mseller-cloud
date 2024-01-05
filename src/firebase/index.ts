import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/functions'
import * as firebase from 'firebase/app'
import firebaseConfig from './firebaseConfig'
import { getFirestore } from 'firebase/firestore'
import { getFunctions, httpsCallable } from 'firebase/functions'
import { UserDataType } from 'src/context/types'

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig)
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
): Promise<UserDataType | undefined> => {
  try {
    const fn = httpsCallable(functions, 'getUserByAccessToken')
    const response = await fn({ accessToken })
    return response.data as UserDataType
  } catch (err) {
    console.error(err)
    throw err
  }
}

export { db, firebase, functions }
