// mui components
// styles
import styles from "./Footer.module.css"
import React from "react"

export default function Footer() {
	return (
		<div className={styles.container}>
			<a href="mailto:support@alexpts.dev?body=app%3A%20Kira%0A---%20please%20leave%20the%20content%20above%20this%20line%20---">
				support@alexpts.dev
			</a>
		</div>
	)
}
