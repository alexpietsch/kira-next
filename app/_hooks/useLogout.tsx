import { useAuthContext } from "./useAuthContext"
import { projectAuth } from "@/app/_firebase/config"
import { useState, useEffect } from "react"

export const useLogout = () => {
	const [isCancelled, setIsCancelled] = useState(false)
	const [error, setError] = useState(null)
	const [isPending, setIsPending] = useState(false)
	const { dispatch } = useAuthContext()

	const logout = async () => {
		setError(null)
		setIsPending(true)
		// sign user out
		try {
			await projectAuth.signOut()

			// dispatch(update state) logout action
			dispatch({ type: "LOGOUT" })

			if (!isCancelled) {
				setIsPending(false)
				setError(null)
			}
		} catch (err: any) {
			if (!isCancelled) {
				setIsPending(false)
				setError(null)
				console.error(err.message)
			}
		}
	}

	useEffect(() => {
		return () => {
			setIsCancelled(true)
		}
	}, [])

	return { logout, error, isPending }
}
