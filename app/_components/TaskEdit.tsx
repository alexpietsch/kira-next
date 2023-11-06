import ConfirmModal from "./ConfirmModal"
import styles from "./TaskEdit.module.css"
import { timestamp } from "@/app/_firebase/config"
import { useFirestore } from "@/app/_hooks/useFirestore"
import { Card, Column, KiraDocument } from "@/types/KiraDocument"
// icons
import Button from "@mui/material/Button"
// MUI components
//Dialog
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { clsx } from "clsx"
import de from "date-fns/locale/de"
import React, { useState } from "react"
import { GithubPicker } from "react-color"
import { v4 as uuidv4 } from "uuid"

interface ITaskEditProps {
	sourceCard: Card | null | undefined
	sourceColumn: Column | null | undefined
	boardData: KiraDocument
	setBoardData: React.Dispatch<React.SetStateAction<KiraDocument>>
	isTaskEditModalOpen: boolean
	setIsTaskEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function TaskEdit({
	sourceCard,
	sourceColumn,
	boardData,
	setBoardData,
	isTaskEditModalOpen,
	setIsTaskEditModalOpen
}: ITaskEditProps) {
	const [showLabelCreator, setShowLabelCreator] = useState(false)
	const [showConfirmModal, setShowConfirmModal] = useState(false)
	const [isEdit, setIsEdit] = useState({ state: true, text: "Edit" })

	const [cardName, setCardName] = useState(sourceCard?.cardName)
	const [cardWorker, setCardWorker] = useState(sourceCard?.cardWorker)
	const [deadline, setDeadline] = useState(sourceCard?.cardDeadline ? sourceCard.cardDeadline.toDate() : null)

	const [cardDescription, setCardDescription] = useState(sourceCard?.cardDescription)
	const [cardLabels, setCardLabels] = useState(sourceCard?.cardLabels)

	const [newCardLabelName, setNewCardLabelName] = useState("")
	const [newCardLabelNameColor, setNewCardLabelNameColor] = useState("#fff")
	const [newCardLabelColor, setNewCardLabelColor] = useState("#b80000")
	const { updateDocument } = useFirestore("tasks")

	function handleEditButton(e: React.SyntheticEvent) {
		e.preventDefault()

		if (isEdit.state) {
			setIsEdit({ state: false, text: "Save Changes" })
		} else {
			let newBoardData = boardData
			// get column from boardData.columns
			let newBoardDataColumn = newBoardData.columns.find(col => col.columnID === sourceColumn?.columnID)!
			// get card from column.cards
			let newBoardDataColumnCard = newBoardDataColumn.cards.find(card => card.cardID === sourceCard?.cardID)!

			// update card
			newBoardDataColumnCard = {
				...newBoardDataColumnCard,
				cardName: cardName || "",
				cardWorker: cardWorker || "",
				cardDeadline: deadline ? timestamp.fromDate(new Date(deadline)) : null,
				cardDescription: cardName || "",
				cardLabels: cardLabels || []
			}

			// insert card to same position in column
			newBoardDataColumn.cards = newBoardDataColumn.cards.map(card => {
				if (card.cardID === sourceCard?.cardID) {
					return newBoardDataColumnCard
				} else {
					return card
				}
			})

			// insert column to same position in boardData
			newBoardData.columns = newBoardData.columns.map(col => {
				if (col.columnID === sourceColumn?.columnID) {
					return newBoardDataColumn
				} else {
					return col
				}
			})

			// update boardData
			setBoardData(newBoardData)
			updateDocument(boardData.boardID, { columns: newBoardData.columns })

			setCardName("")
			setCardWorker("")
			setDeadline(null)
			setCardDescription("")
			setCardLabels([])
			setIsTaskEditModalOpen(false)
		}
	}
	function handleAdd(e: React.SyntheticEvent) {
		e.preventDefault()
		const labelName = newCardLabelName.trim()
		const labelColor = newCardLabelColor.trim()
		const labelTextColor = newCardLabelNameColor.trim()

		if (labelName && cardLabels !== undefined && cardLabels?.filter(label => label.labelName === labelName).length === 0) {
			setCardLabels(prevLabels => [...prevLabels!, { labelID: uuidv4(), labelName, labelColor, labelTextColor }])
		}
		setNewCardLabelName("")
		setNewCardLabelColor("#b80000")
		setNewCardLabelNameColor("#fff")
		setShowLabelCreator(false)
	}
	function handleDeleteLabel(labelID: string) {
		setCardLabels(cardLabels => cardLabels?.filter(label => label.labelID !== labelID))
	}
	function handleCloseModal() {
		if (!isEdit.state) {
			setShowConfirmModal(true)
		} else {
			setIsTaskEditModalOpen(false)
		}
	}
	return (
		<>
			{showConfirmModal && (
				<ConfirmModal
					handleYesAction={() => {
						setShowConfirmModal(false)
						setIsTaskEditModalOpen(false)
					}}
					handleNoAction={() => setShowConfirmModal(false)}
					title="Close without saving?"
					message="Do you really want to close without saving?"
				/>
			)}
			<Dialog open={isTaskEditModalOpen} onClose={() => handleCloseModal()} maxWidth="lg" fullWidth={true}>
				<DialogTitle
					style={{
						maxWidth: "800px",
						whiteSpace: "nowrap",
						overflow: "hidden",
						textOverflow: "ellipsis"
					}}
				>
					{cardName}
				</DialogTitle>
				<DialogContent style={{ paddingTop: "10px" }}>
					<form>
						<Stack spacing={1.5}>
							<label>
								<TextField
									className={styles.formInput}
									required
									label="Taskname"
									onChange={e => setCardName(e.target.value)}
									value={cardName}
									size="small"
									InputProps={{
										readOnly: isEdit.state
									}}
								/>
							</label>

							<label>
								<TextField
									className={styles.formInput}
									label="Worker"
									onChange={e => setCardWorker(e.target.value)}
									value={cardWorker}
									size="small"
									InputProps={{
										readOnly: isEdit.state
									}}
								/>
							</label>

							<label>
								<LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
									<DatePicker
										label="Deadline"
										onChange={date => setDeadline(date)}
										value={deadline}
										format="dd.MM.yyyy"
										readOnly={isEdit.state}
									/>
								</LocalizationProvider>
							</label>
							<label>
								<TextField
									className={styles.formInput}
									label="Description"
									multiline
									rows={4}
									onChange={e => setCardDescription(e.target.value)}
									value={cardDescription}
									size="small"
									InputProps={{
										readOnly: isEdit.state
									}}
								/>
							</label>

							<label>
								<span>Labels:</span>
								{showLabelCreator && (
									<Dialog open={showLabelCreator} onClose={() => setShowLabelCreator(false)}>
										<DialogTitle>Add Label</DialogTitle>
										<DialogContent style={{ paddingTop: "10px" }}>
											<div>
												<TextField
													className={styles.formInput}
													required
													label="Label Name"
													onChange={e => setNewCardLabelName(e.target.value)}
													value={newCardLabelName}
													sx={{ color: newCardLabelColor }}
													size="small"
												/>
												<p
													className={styles.label}
													style={{
														backgroundColor: newCardLabelColor,
														color: newCardLabelNameColor
													}}
												>
													{newCardLabelName === "" ? "Label Name" : newCardLabelName}
												</p>
												<GithubPicker
													className={styles.colorPicker}
													color={newCardLabelColor}
													// triangle="top-left"
													onChangeComplete={color => {
														setNewCardLabelColor(color.hex)
														color.hsl.l >= 0.5
															? setNewCardLabelNameColor("#000")
															: setNewCardLabelNameColor("#fff")
													}}
												/>
											</div>
										</DialogContent>
										<DialogActions>
											<Button onClick={handleAdd}>Add label</Button>
											<Button onClick={() => setShowLabelCreator(false)}>Cancel</Button>
										</DialogActions>
									</Dialog>
								)}
							</label>
							<p className={styles.labelWrapper}>
								{cardLabels?.map(label => (
									<span
										className={clsx(styles.label, {
											[styles.labelDelete]: !isEdit.state
										})}
										key={label.labelID}
										style={{
											backgroundColor: label.labelColor,
											color: label.labelTextColor
										}}
										onClick={() => {
											if (!isEdit.state) handleDeleteLabel(label.labelID)
										}}
									>
										{label.labelName}
										{/* {!isEdit.state && (
											<span
												className="deleteButton"
												
											>
												<DeleteOutlineIcon sx={{ fontSize: "1.7em" }} />
											</span>
										)} */}
									</span>
								))}
								<button
									className={styles.addLabel}
									onClick={e => {
										e.preventDefault()
										setShowLabelCreator(true)
									}}
									disabled={isEdit.state}
								>
									+
								</button>
							</p>
						</Stack>
					</form>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => handleCloseModal()}>Cancel</Button>
					<Button variant="contained" onClick={handleEditButton}>
						{isEdit.text}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	)
}
