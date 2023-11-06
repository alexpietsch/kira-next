"use client"

import { projectAuth } from "@/app/_firebase/config"
import { User, onAuthStateChanged } from "firebase/auth"
import React, { ReactNode, createContext, useReducer } from "react"
import { useEffect } from "react"

type Action = { type: "LOGIN" | "LOGOUT" | "AUTH_IS_READY"; payload?: User }
type State = { user: User | null; authIsReady?: boolean }
type AuthContext = { state: State; dispatch: React.Dispatch<Action> }

const initialState: State = { user: null, authIsReady: false }

export const AuthContext = createContext<AuthContext>({ state: initialState, dispatch: () => {} })

export const authReducer = (state: State, action: Action): State => {
	switch (action.type) {
		case "LOGIN":
			return { ...state, user: action.payload! }
		case "LOGOUT":
			return { ...state, user: null }
		case "AUTH_IS_READY":
			return { ...state, user: action.payload!, authIsReady: true }
		default:
			return state
	}
}

export const AuthContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [state, dispatch] = useReducer(authReducer, initialState)

	useEffect(() => {
		const unsub = onAuthStateChanged(projectAuth, user => {
			if (user) {
				dispatch({ type: "AUTH_IS_READY", payload: user })
			} else {
				dispatch({ type: "AUTH_IS_READY" })
			}
			unsub()
		})
	}, [])

	const authContextValue = { state, dispatch }

	return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>
}
