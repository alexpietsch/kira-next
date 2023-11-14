import { projectFirestore } from "../_firebase/config"
import { DocumentData, collection, doc, getDoc } from "firebase/firestore"

const getDocumentById = async (
	collectionName: string,
	docId: string | undefined
): Promise<DocumentData | null> => {
	if (!collectionName || !docId) return null
	try {
		const docSnap = await getDoc(doc(projectFirestore, collectionName, docId))
		if (docSnap.exists()) {
			return docSnap.data()
		}
		return null
	} catch (error) {
		console.error(error)
		return null
	}
}

export default getDocumentById
