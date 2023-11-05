import { useAuthContext } from "./useAuthContext"
import { projectAuth } from "@/app/_firebase/config"
import { signInWithEmailAndPassword } from "firebase/auth"
import { useRouter } from "next/navigation"
import { useState, useEffect, useCallback } from "react"

export const useLogin = () => {
	const [isCancelled, setIsCancelled] = useState(false)
	const [error, setError] = useState(null)
	const [isPending, setIsPending] = useState(false)
	const { dispatch } = useAuthContext()
	const { push } = useRouter()

	const login = async (email: string, password: string) => {
		setError(null)
		setIsPending(true)

		try {
			const response = await signInWithEmailAndPassword(projectAuth, email, password)
			dispatch({ type: "LOGIN", payload: response.user })

			if (!isCancelled) {
				setIsPending(false)
				setError(null)
				push("/")
			}
		} catch (err: any) {
			if (!isCancelled) {
				setError(err.message)
				setIsPending(false)
			}
		}
	}

	return { login, isPending, error }
}
