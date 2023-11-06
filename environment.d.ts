declare namespace NodeJS {
	interface ProcessEnv {
		/**
		 * @description
		 * The name of the collection to use in Firestore
		 * containing the KiraDocuments
		 */
		NEXT_PUBLIC_COLLECTION: string
		/**
		 * @description
		 * The API Key
		 */
		NEXT_PUBLIC_API_KEY: string
		/**
		 * @description
		 * The Auth Domain
		 */
		NEXT_PUBLIC_MESSAGING_SENDER_ID: string
		/**
		 * @description
		 * The Project ID
		 */
		NEXT_PUBLIC_APP_ID: string
		/**
		 * @description
		 * Wether the current environment is
		 * development or production
		 */
		NODE_ENV: "development" | "production"
	}
}
