"use client"

import Home from "@/app/_components/Home"
import withAuth from "@/app/_components/WithAuth"

const Main = () => {
	return <Home />
}

export default withAuth(Main)
