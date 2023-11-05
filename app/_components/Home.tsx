"use client"

import LoadingSpinner from "./LoadingSpinner"
import BoardSelection from "@/app/_components/BoardSelection"
import { useAuthContext } from "@/app/_hooks/useAuthContext"
import { useCollection } from "@/app/_hooks/useCollection"
import { KiraDocument } from "@/types/KiraDocument"
import Head from "next/head"

export default function Home() {
	const { state } = useAuthContext()
	const { user } = state

	const { documents, error } = useCollection<KiraDocument>({ collectionName: "tasks", _user: user })

	return (
		<>
			<Head>
				<title>KIRA</title>
				<meta name="description" content="Drag and Drop ToDo App" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
				<div>
					<div>
						{documents && <BoardSelection data={documents} />}
						{!documents && <LoadingSpinner isFullpage={false} size="small" />}
						{error && <p>{error}</p>}
					</div>
				</div>
			</main>
		</>
	)
}
