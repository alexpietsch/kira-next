import { AuthContext } from "@/app/_context/AuthContext"
import { useContext } from "react"

export const useAuthContext = () => {
	const context = useContext(AuthContext)

	if (!context) {
		throw Error("useAuthContext must be inside a AuthContextProvider (out of scope)")
	}

	return context
}
