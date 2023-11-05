"use client"

import LoadingSpinner from "./LoadingSpinner"
import { useAuthContext } from "@/app/_hooks/useAuthContext"
import { redirect } from "next/navigation"
import React, { useLayoutEffect } from "react"

export default function withAuth(Component: React.ComponentType<any>) {
	return function WithAuth(props: any) {
		const { state } = useAuthContext()
		const { user, authIsReady } = state

		useLayoutEffect(() => {
			if (authIsReady && !user) {
				redirect("/login")
			}
		}, [authIsReady, user])

		return user?.uid ? <Component {...props} /> : <LoadingSpinner isFullpage={true} size="medium" />
	}
}
