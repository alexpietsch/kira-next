// mui components
// styles
import styles from "./Footer.module.css"
import React from "react"

export default function Footer() {
	return (
		<div className={styles.container}>
			<a href="mailto:support@alexpts.dev?body=---%20please%20leave%20the%20content%20below%20this%20line%20---%0Aapp%3A%20Kira">
				support@alexpts.dev
			</a>
		</div>
	)
}
