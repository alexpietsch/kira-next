import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { Timestamp, getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_API_KEY,
	authDomain: "kira-9d1ff.firebaseapp.com",
	projectId: "kira-9d1ff",
	storageBucket: "kira-9d1ff.appspot.com",
	messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_APP_ID
}

initializeApp(firebaseConfig)

// init service
const projectFirestore = getFirestore()
const projectAuth = getAuth()
const projectStorage = getStorage()
const timestamp = Timestamp

export { projectFirestore, projectAuth, projectStorage, timestamp }
