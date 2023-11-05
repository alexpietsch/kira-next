"use client"

import withAuth from "@/app/_components/WithAuth"
import { useAuthContext } from "@/app/_hooks/useAuthContext"
import { useFirestore } from "@/app/_hooks/useFirestore"
// mui components
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import { th } from "date-fns/locale"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import { v4 as uuidv4 } from "uuid"

function NewBoard() {
	const { state } = useAuthContext()
	const { user } = state

	const { addDocumentCustomId } = useFirestore("tasks")
	const { push } = useRouter()

	const [boardName, setBoardName] = useState("")
	const [boardDescription, setBoardDescription] = useState("")

	const [isBoardNameError, setBoardNameError] = useState(false)
	const [boardnameHelperText, setBoardnameHelperText] = useState("")

	if (!user) return <p>loading...</p>

	function handleSubmit(e: any) {
		e.preventDefault()

		if (boardName.length === 0) {
			setBoardnameHelperText("Boardname is required")
			setBoardNameError(true)
			return
		} else if (!user) {
			throw new Error("User is not logged in")
		} else {
			setBoardnameHelperText("")
			setBoardNameError(false)
		}

		const board = {
			boardID: uuidv4(),
			boardName,
			boardDescription,
			boardMember: [],
			columns: [],
			user: user.uid
		}
		setBoardName("")
		setBoardDescription("")
		addDocumentCustomId(board.boardID, board)
		push("/")
	}

	return (
		<div>
			<h1>Create a New Board</h1>
			<form>
				<label>
					<TextField
						required
						label="Boardname"
						onChange={e => setBoardName(e.target.value)}
						value={boardName}
						size="small"
						sx={{ width: "20vw" }}
						error={isBoardNameError}
						helperText={boardnameHelperText}
					/>
				</label>
				<br />
				<label>
					<TextField
						label="Board Description"
						onChange={e => setBoardDescription(e.target.value)}
						value={boardDescription}
						size="small"
						sx={{ width: "30vw", marginTop: "1em" }}
						multiline
						rows={4}
					/>
				</label>
				<br />
				<Button type="submit" variant="contained" onClick={handleSubmit} sx={{ margin: "1em" }}>
					Create Board
				</Button>
			</form>
		</div>
	)
}

export default withAuth(NewBoard)
