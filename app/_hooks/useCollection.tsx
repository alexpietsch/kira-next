import { projectFirestore } from "@/app/_firebase/config"
import { KiraDocument } from "@/types/KiraDocument"
import { User } from "firebase/auth"
import {
	QueryFieldFilterConstraint,
	collection,
	query,
	where,
	orderBy,
	QueryConstraint,
	WhereFilterOp,
	OrderByDirection,
	Query,
	onSnapshot
} from "firebase/firestore"
import { useEffect, useState, useRef } from "react"

interface ICollectionProps {
	collectionName: string
	_query?: [string, string, string]
	_user?: User | null
	_orderBy?: [string, "asc" | "desc"]
}

export const useCollection = <T,>({ collectionName, _query, _user, _orderBy }: ICollectionProps) => {
	const [documents, setDocuments] = useState<T[] | null>()
	const [error, setError] = useState("")

	const customQuery = useRef(_query).current
	const customOrder = useRef(_orderBy).current
	const user = useRef(_user).current

	useEffect(() => {
		let ref = collection(projectFirestore, collectionName)
		let conditions: QueryConstraint[] = []
		let q: Query

		if (customQuery && user) {
			conditions.push(where(customQuery[0], customQuery[1] as WhereFilterOp, customQuery[2]))
			conditions.push(where("user", "==", user.uid))
		}
		if (customQuery && !user) {
			conditions.push(where(customQuery[0], customQuery[1] as WhereFilterOp, customQuery[2]))
		}
		if (!customQuery && user) {
			conditions.push(where("user", "==", user.uid))
		}

		if (customOrder) {
			q = query(ref, ...conditions, orderBy(customOrder[0], customOrder[1]))
		} else {
			q = query(ref, ...conditions)
		}

		const unsubscribe = onSnapshot(
			q,
			snapshot => {
				let results: T[] = []
				snapshot.docs.forEach(doc => {
					results.push({ ...(doc.data() as T) })
				})
				setDocuments(results)
				setError("")
			},
			error => {
				console.error(error)
				setError("Could not fetch the data.")
			}
		)
		return () => unsubscribe()
	}, [collectionName, customQuery, customOrder, user])

	return { documents, error }
}
