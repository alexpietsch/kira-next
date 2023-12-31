// hooks
import { useFirestore } from "../_hooks/useFirestore"
// styles
import styles from "./BoardEdit.module.css"
// components
import ConfirmModal from "./ConfirmModal"
import { Column, KiraDocument } from "@/types/KiraDocument"
import { DragDropContext, Draggable, DropResult, Droppable } from "@hello-pangea/dnd"
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
import { useRouter } from "next/navigation"
import React, { Dispatch, SetStateAction, useState } from "react"

interface IBoardEditProps {
	boardData: KiraDocument
	setBoardData: Dispatch<SetStateAction<KiraDocument>>
	isBoardEditOpen: boolean
	setIsBoardEditOpen: Dispatch<SetStateAction<boolean>>
}

export default function BoardEdit({ boardData, setBoardData, isBoardEditOpen, setIsBoardEditOpen }: IBoardEditProps) {
	const { changeDocument, deleteDocument } = useFirestore("tasks")

	const { push } = useRouter()

	const [showConfirmModal, setShowConfirmModal] = useState(false)
	const [boardName, setBoardName] = useState(boardData.boardName)
	const [boardDescription, setBoardDescription] = useState(boardData.boardDescription)
	const [isEdit, setIsEdit] = useState({ state: true, text: "Edit" })

	async function handleEditButton(e: any) {
		e.preventDefault()

		if (isEdit.state) {
			setIsEdit({ state: false, text: "Save Changes" })
			return
		}

		if (!isEdit.state) {
			let newBoardData = boardData
			// newBoardData.columns = newColumnOrder.columns;

			// update board data
			newBoardData = {
				...newBoardData,
				boardName,
				boardDescription
			}

			// update boardData
			await changeDocument(boardData.boardID, newBoardData)
			setBoardData(newBoardData)

			setIsEdit({ state: true, text: "Edit" })
			setIsBoardEditOpen(false)
		}
	}

	async function handleDeleteBoard() {
		await deleteDocument(boardData.boardID)
		push("/")
		// updateDocument(boardData.boardID, {columns: newState.columns})
	}

	function handleDragEnd(result: DropResult) {
		let newColumnOrder = boardData
		const { source, destination } = result
		// check if the card is dropped outside the area
		if (!destination) {
			return
		}
		// check if the card is dropped in the same column and the index
		// does not change (case if card is dragged and then dropped at the same position)
		else if (source.droppableId === destination.droppableId && source.index === destination.index) {
			return
		}

		const movedElement = newColumnOrder.columns.splice(source.index, 1)
		newColumnOrder.columns.splice(destination.index, 0, movedElement[0])
	}

	return (
		<>
			{showConfirmModal && (
				<ConfirmModal
					title={"Delete Board?"}
					message={"Do you want to delete this Board?"}
					handleYesAction={handleDeleteBoard}
					handleNoAction={() => {
						setShowConfirmModal(false)
					}}
				/>
			)}

			<Dialog open={isBoardEditOpen} fullWidth={true} style={{ minWidth: "300px" }}>
				<DialogTitle>Edit Board</DialogTitle>
				<DialogContent>
					<br />
					<TextField
						size="small"
						label="Board Name"
						value={boardName}
						onChange={e => setBoardName(e.target.value)}
						InputProps={{
							readOnly: isEdit.state
						}}
					/>
					<br />

					<TextField
						size="small"
						label="Board Description"
						value={boardDescription}
						onChange={e => setBoardDescription(e.target.value)}
						InputProps={{
							readOnly: isEdit.state
						}}
						multiline
						rows={4}
						style={{ marginTop: "16px", width: "100%" }}
					/>
					<br />

					<div
						style={{
							overflow: "auto",
							marginTop: "20px",
							margin: "auto",
							width: "90%"
						}}
					>
						<p>Rearrange columns</p>
						<DragDropContext onDragEnd={handleDragEnd}>
							<Droppable droppableId="droppable" direction="horizontal">
								{provided => (
									<div className={styles.BoardEdit_container}>
										<ul
											{...provided.droppableProps}
											ref={provided.innerRef}
											style={{ display: "flex", listStyle: "none" }}
										>
											{boardData &&
												boardData.columns.map((column: Column, index: number) => {
													return (
														<Draggable
															key={column.columnID}
															index={index}
															draggableId={column.columnID}
															isDragDisabled={isEdit.state}
														>
															{provided => (
																<li
																	ref={provided.innerRef}
																	{...provided.draggableProps}
																	{...provided.dragHandleProps}
																	className={styles.BoardEdit_column}
																>
																	{column.columnName}
																</li>
															)}
														</Draggable>
													)
												})}
											{provided.placeholder}
										</ul>
									</div>
								)}
							</Droppable>
						</DragDropContext>
					</div>

					<br />
					<Box m={2}>
						<Divider variant="fullWidth" />
					</Box>
					<Button color="error" variant="contained" onClick={() => console.log("deleted")}>
						Delete Board
					</Button>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => {
							setIsEdit({ state: true, text: "Edit" })
							setIsBoardEditOpen(false)
						}}
						color="primary"
					>
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
