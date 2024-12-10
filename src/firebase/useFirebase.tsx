import { useContext } from 'react'
import { FirebaseContext } from 'src/context/FirebaseContext'

export const useFirebase = () => useContext(FirebaseContext)
