import { Timestamp } from "firebase/firestore"

export type BoardMember = {
	member: {
		user: string
	}
}

export type Column = {
	columnID: string
	columnName: string
	cards: Array<Card>
}

export type Card = {
	cardID: string
	cardName: string
	cardWorker: string
	cardDeadline: Timestamp | null
	cardCreated: Timestamp
	cardIsDone: boolean
	cardDescription: string
	cardLabels: Array<CardLabel>
}

export type CardLabel = {
	labelID: string
	labelName: string
	labelColor: string
	labelTextColor: string
}

export type KiraDocument = {
	boardID: string
	boardName: string
	boardDescription: string
	boardMember: Array<BoardMember>
	columns: Array<Column>
	user: string
}
