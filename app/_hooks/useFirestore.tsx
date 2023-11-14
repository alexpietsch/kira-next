import { projectFirestore } from "@/app/_firebase/config"
import { BoardMember, Column } from "@/types/KiraDocument"
import { addDoc, collection, deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import { useEffect, useReducer, useState } from "react"

let initialState = {
	document: null,
	isPending: false,
	error: null,
	success: null
}

type Action = {
	type: string
	payload?: any
}

const firestoreReducer = (state: any, action: Action) => {
	switch (action.type) {
		case "IS_PENDING":
			return { ...state, isPending: true, document: null, success: false, error: null }
		case "NEW_DOCUMENT_ADDED":
			return { ...state, isPending: false, document: action.payload, success: true, error: null }
		case "CHANGE_DOCUMENT":
			return { ...state, isPending: false, document: action.payload, success: true, error: null }
		case "UPDATE_DOCUMENT":
			return { ...state, isPending: false, document: action.payload, success: true, error: null }
		case "DELETED_DOCUMENT":
			return { ...state, isPending: false, document: null, success: true, error: null }
		case "ERROR":
			console.error("Error when fetching.", action.payload)
			return { ...state, isPending: false, document: null, success: false, error: action.payload }
		default:
			return state
	}
}

export const useFirestore = (collectionName: string) => {
	const [state, dispatch] = useReducer(firestoreReducer, initialState)
	const [isCancelled, setIsCancelled] = useState(false)

	// collection reference
	const ref = collection(projectFirestore, collectionName)

	// dispatch if not cancelled
	const dispatchIfNotCancelled = (action: Action) => {
		if (!isCancelled) {
			dispatch(action)
		}
	}

	// add new document
	const addDocument = async (doc: any) => {
		dispatch({ type: "IS_PENDING" })

		try {
			const newDocumentAdded = await addDoc(ref, { ...doc })
			dispatchIfNotCancelled({ type: "NEW_DOCUMENT_ADDED", payload: newDocumentAdded })
		} catch (err) {
			dispatchIfNotCancelled({ type: "ERROR", payload: err })
		}
	}

	const addDocumentCustomId = async (id: string, data: any) => {
		dispatch({ type: "IS_PENDING" })

		try {
			const newDocumentAdded = await setDoc(doc(ref, id), data)
			dispatchIfNotCancelled({ type: "NEW_DOCUMENT_ADDED", payload: newDocumentAdded })
		} catch (err) {
			dispatchIfNotCancelled({ type: "ERROR", payload: err })
		}
	}

	const changeDocument = async (id: string, data: any) => {
		dispatch({ type: "IS_PENDING" })

		try {
			const changedDocument = await updateDoc(doc(ref, id), { ...data })
			dispatchIfNotCancelled({ type: "CHANGE_DOCUMENT", payload: changedDocument })
		} catch (err) {
			dispatchIfNotCancelled({ type: "ERROR", payload: "Could not save document." })
		}
	}

	const updateDocument = async (id: string, dataObject: any) => {
		dispatch({ type: "IS_PENDING" })

		try {
			const updatedDocument = await updateDoc(doc(ref, id), dataObject)
			dispatchIfNotCancelled({ type: "UPDATE_DOCUMENT", payload: updatedDocument })
		} catch (err) {
			console.error("Error", err)
			dispatchIfNotCancelled({ type: "ERROR", payload: "Could not save document." })
		}
	}

	const deleteDocument = async (id: string) => {
		dispatch({ type: "IS_PENDING" })

		try {
			await deleteDoc(doc(ref, id))
			dispatchIfNotCancelled({ type: "DELETED_DOCUMENT" })
		} catch (err) {
			dispatchIfNotCancelled({ type: "ERROR", payload: "Could not delete document." })
		}
	}

	useEffect(() => {
		return () => setIsCancelled(true)
	}, [])

	return {
		addDocument,
		addDocumentCustomId,
		deleteDocument,
		response: state,
		changeDocument,
		updateDocument
	}
}
