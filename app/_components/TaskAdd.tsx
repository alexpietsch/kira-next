import styles from "./TaskAdd.module.css"
import { timestamp } from "@/app/_firebase/config"
import { useFirestore } from "@/app/_hooks/useFirestore"
import { Card, CardLabel, Column, KiraDocument } from "@/types/KiraDocument"
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
import React, { Dispatch, SetStateAction, useState } from "react"
import { GithubPicker } from "react-color"
import { v4 as uuidv4 } from "uuid"

interface ITaskAddProps {
	boardData: KiraDocument
	setBoardData: Dispatch<SetStateAction<KiraDocument>>
	isTaskAddModalOpen: boolean
	setIsTaskAddModalOpen: Dispatch<SetStateAction<boolean>>
	sourceColumn: Column | null | undefined
}

export default function TaskAdd({
	boardData,
	setBoardData,
	isTaskAddModalOpen,
	setIsTaskAddModalOpen,
	sourceColumn
}: ITaskAddProps) {
	const [showLabelCreator, setShowLabelCreator] = useState(false)
	const [showConfirmModal, setShowConfirmModal] = useState(false)

	const [isTasknameNameError, setIsTasknameNameError] = useState(false)
	const [tasknameHelperText, setTasknameHelperText] = useState("")
	const [isLabelNameError, setIsLabelNameError] = useState(false)
	const [labelHelperText, setLabelHelperText] = useState("")

	const [cardName, setCardName] = useState("")
	const [cardWorker, setCardWorker] = useState("")
	const [deadline, setDeadline] = useState<Date | null>()
	const [cardDescription, setCardDescription] = useState("")
	const [cardLabels, setCardLabels] = useState<CardLabel[]>([])

	const [newCardLabelName, setNewCardLabelName] = useState("")
	const [newCardLabelNameColor, setNewCardLabelNameColor] = useState("#fff")
	const [newCardLabelColor, setNewCardLabelColor] = useState("#b80000")
	const { updateDocument } = useFirestore("tasks")

	function handleSubmit(e: React.SyntheticEvent) {
		e.preventDefault()

		if (cardName.length === 0) {
			setTasknameHelperText("Taskname is required")
			setIsTasknameNameError(true)
			return
		} else {
			setTasknameHelperText("")
			setIsTasknameNameError(false)
		}

		const card: Card = {
			cardID: uuidv4(),
			cardName,
			cardWorker,
			cardDeadline: deadline ? timestamp.fromDate(deadline) : null,
			cardCreated: timestamp.fromDate(new Date()),
			cardDescription,
			cardLabels: cardLabels ? cardLabels : [],
			cardIsDone: false
		}
		let newBoardData = boardData
		// get column from boardData.columns
		const column = newBoardData.columns.find(column => column.columnID === sourceColumn?.columnID)!
		// add new task to column
		column.cards.push(card)
		const isTargetColumn = (column: Column) => column.columnID === sourceColumn?.columnID
		const indexOfColumn = newBoardData.columns.findIndex(isTargetColumn)
		newBoardData.columns[indexOfColumn] = column
		setBoardData(newBoardData)
		updateDocument(boardData.boardID, { columns: newBoardData.columns })
		setCardName("")
		setCardWorker("")
		setDeadline(null)
		setCardDescription("")
		setCardLabels([])
		setIsTaskAddModalOpen(false)
	}
	function handleAdd(e: React.SyntheticEvent) {
		e.preventDefault()
		const labelName = newCardLabelName.trim()
		const labelColor = newCardLabelColor.trim()
		const labelTextColor = newCardLabelNameColor.trim()
		console.log(labelName, labelColor, labelTextColor)

		if (labelName === "") {
			setLabelHelperText("Label Name is required")
			setIsLabelNameError(true)
			return
		} else {
			setLabelHelperText("")
			setIsLabelNameError(false)
		}

		setCardLabels([...cardLabels, { labelID: uuidv4(), labelName, labelColor, labelTextColor }])

		setNewCardLabelName("")
		setNewCardLabelColor("#b80000")
		setNewCardLabelNameColor("#fff")
		setShowLabelCreator(false)
	}

	function handleCloseModal() {
		if (cardName || cardWorker || deadline || (cardLabels && cardLabels.length > 0)) {
			setShowConfirmModal(true)
		} else {
			setIsTaskAddModalOpen(false)
		}
	}
	return (
		<>
			<Dialog open={showConfirmModal} onClose={() => setShowConfirmModal(false)}>
				<DialogTitle>Close window?</DialogTitle>
				<DialogContent>
					<p>You have unsaved changes. Are you sure you want to close?</p>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => {
							setIsTaskAddModalOpen(false)
							setShowConfirmModal(false)
						}}
					>
						Close
					</Button>
					<Button variant="contained" onClick={() => setShowConfirmModal(false)}>
						Cancel
					</Button>
				</DialogActions>
			</Dialog>

			<Dialog open={isTaskAddModalOpen} onClose={() => setIsTaskAddModalOpen(false)} maxWidth="lg" fullWidth={true}>
				<DialogTitle>New Task</DialogTitle>
				<DialogContent style={{ paddingTop: "10px" }}>
					<form className="addTaskForm">
						<Stack spacing={1.5}>
							<label>
								<TextField
									className={styles.formInput}
									required
									label="Taskname"
									onChange={e => setCardName(e.target.value)}
									value={cardName}
									size="small"
									error={isTasknameNameError}
									helperText={tasknameHelperText}
								/>
							</label>

							<label>
								<TextField
									className={styles.formInput}
									label="Worker"
									onChange={e => setCardWorker(e.target.value)}
									value={cardWorker}
									size="small"
								/>
							</label>

							<label>
								<LocalizationProvider dateAdapter={AdapterDateFns}>
									<DatePicker
										label="Deadline"
										onChange={date => {
											const newDate = new Date(date!)
											setDeadline(newDate)
										}}
										value={deadline}
										format="dd.MM.yyyy"
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
													error={isLabelNameError}
													helperText={labelHelperText}
												/>
												<p
													className={styles.label}
													style={{ backgroundColor: newCardLabelColor, color: newCardLabelNameColor }}
												>
													{newCardLabelName === "" ? "Label Name" : newCardLabelName}
												</p>
												<GithubPicker
													className={styles.colorPicker}
													color={newCardLabelColor}
													onChangeComplete={color => {
														setNewCardLabelColor(color.hex)
														color.hsl.l >= 0.5
															? setNewCardLabelNameColor("#000")
															: setNewCardLabelNameColor("#fff")
													}}
												/>
												<br />
											</div>
										</DialogContent>
										<DialogActions>
											<Button onClick={() => setShowLabelCreator(false)}>Cancel</Button>
											<Button variant="contained" onClick={handleAdd}>
												Add label
											</Button>
										</DialogActions>
									</Dialog>
								)}
							</label>
							<p className={styles.labelWrapper}>
								{cardLabels &&
									cardLabels.map(label => (
										<span
											className={styles.label}
											key={label.labelID}
											style={{ backgroundColor: label.labelColor, color: label.labelTextColor }}
										>
											{label.labelName}
										</span>
									))}
								<button
									className={styles.addLabel}
									onClick={e => {
										e.preventDefault()
										setShowLabelCreator(true)
									}}
								>
									+
								</button>
							</p>
						</Stack>
					</form>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseModal}>Cancel</Button>
					<Button variant="contained" onClick={handleSubmit}>
						Save Task
					</Button>
				</DialogActions>
			</Dialog>
		</>
	)
}
