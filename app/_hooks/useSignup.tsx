import { useAuthContext } from "./useAuthContext"
import { useFirestore } from "./useFirestore"
import { projectAuth, projectFirestore } from "@/app/_firebase/config"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { useState, useEffect } from "react"

export const useSignup = () => {
	const [isCancelled, setIsCancelled] = useState(false)
	const [error, setError] = useState(null)
	const [isPending, setIsPending] = useState(false)
	const { dispatch } = useAuthContext()
	const { addDocumentCustomId } = useFirestore("users")

	const signup = async (email: string, password: string, displayName: string) => {
		setError(null)
		setIsPending(true)

		try {
			// signup user
			const response = await createUserWithEmailAndPassword(projectAuth, email, password)

			if (!response) {
				throw new Error("Could not complete signup")
			}

			// add display name to user profile
			await updateProfile(response.user, { displayName })

			// create user document
			await addDocumentCustomId(response.user.uid, {
				uid: response.user.uid,
				displayName,
				photoURL: null
			})

			// update Context to be current user
			dispatch({ type: "LOGIN", payload: response.user })

			if (!isCancelled) {
				setIsPending(false)
				setError(null)
			}
		} catch (err: any) {
			if (!isCancelled) {
				setIsPending(false)
				setError(err.message)
			}
		}
	}

	useEffect(() => {
		return () => {
			setIsCancelled(true)
		}
	}, [])

	return { error, isPending, signup }
}
