// hooks
import { useFirestore } from "../_hooks/useFirestore"
// components
import ConfirmModal from "./ConfirmModal"
import { Column, KiraDocument } from "@/types/KiraDocument"
// mui components
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
//Dialog
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Divider from "@mui/material/Divider"
import TextField from "@mui/material/TextField"
import React, { Dispatch, SetStateAction, useState } from "react"

interface IColumnEditProps {
	boardData: KiraDocument
	setBoardData: Dispatch<SetStateAction<KiraDocument>>
	isEditColumnOpen: boolean
	setIsEditColumnOpen: Dispatch<SetStateAction<boolean>>
	modalActiveColumn: Column | null | undefined
	setModalActiveColumn: Dispatch<SetStateAction<Column | null | undefined>>
}

export default function ColumnEdit({
	boardData,
	setBoardData,
	isEditColumnOpen,
	setIsEditColumnOpen,
	modalActiveColumn,
	setModalActiveColumn
}: IColumnEditProps) {
	const { updateDocument } = useFirestore("tasks")

	const [showConfirmModal, setShowConfirmModal] = useState(false)
	const [columnName, setColumnName] = useState(modalActiveColumn!.columnName)
	const [isEdit, setIsEdit] = useState({ state: true, text: "Edit" })

	function handleEditButton(e: any) {
		e.preventDefault()

		if (isEdit.state) {
			setIsEdit({ state: false, text: "Save Changes" })
		} else {
			let newBoardData = boardData
			// get column from boardData.columns
			let newBoardDataColumn = newBoardData.columns.find((col: Column) => col.columnID === modalActiveColumn!.columnID)

			// update column name
			newBoardDataColumn = {
				...newBoardDataColumn!,
				columnName: columnName
			}

			// insert column to same position in boardData
			newBoardData.columns = newBoardData.columns.map((col: Column) => {
				if (col.columnID === modalActiveColumn!.columnID) {
					return newBoardDataColumn!
				} else {
					return col
				}
			})

			// update boardData
			setBoardData(newBoardData)
			updateDocument(boardData.boardID, { columns: newBoardData.columns })

			setIsEdit({ state: true, text: "Edit" })
			setIsEditColumnOpen(false)
		}
	}

	function handleDeleteColumn() {
		if (!modalActiveColumn) return
		let newState = boardData
		const indexOfColumn = newState.columns.findIndex((column: Column) => column.columnID === modalActiveColumn.columnID)
		// remove the column from the columns array
		newState.columns.splice(indexOfColumn, 1)
		setBoardData(newState)
		setShowConfirmModal(false)
		setIsEditColumnOpen(false)
		updateDocument(boardData.boardID, { columns: newState.columns })
	}

	return (
		<>
			{showConfirmModal && (
				<ConfirmModal
					title={"Delete Column?"}
					message={"Do you want to delete this Column?"}
					handleYesAction={handleDeleteColumn}
					handleNoAction={() => {
						setShowConfirmModal(false)
						setModalActiveColumn(null)
					}}
				/>
			)}

			<Dialog open={isEditColumnOpen} fullWidth={true} style={{ minWidth: "300px" }}>
				<DialogTitle>Edit column</DialogTitle>
				<DialogContent>
					<br />
					<TextField
						size="small"
						label="Column name"
						value={columnName}
						onChange={e => setColumnName(e.target.value)}
						InputProps={{
							readOnly: isEdit.state
						}}
					/>
					<Box m={2}>
						<Divider variant="fullWidth" />
					</Box>
					<Button color="error" variant="contained" onClick={() => {}}>
						Delete column
					</Button>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setIsEditColumnOpen(false)} color="primary">
						Cancel
					</Button>
					<Button variant="contained" onClick={handleEditButton}>
						{isEdit.text}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	)
}
