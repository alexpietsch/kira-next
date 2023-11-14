"use client"

import LoadingSpinner from "../_components/LoadingSpinner"
import { openSnackbar } from "../_components/SeveritySnackbar"
import { projectFirestore } from "../_firebase/config"
import { useAuthContext } from "../_hooks/useAuthContext"
import { useFirestore } from "../_hooks/useFirestore"
import getUserDocument from "../utils/getDocumentById"
import withAuth from "@/app/_components/WithAuth"
import { SettingsEnum, Settings } from "@/types/Settings"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormGroup from "@mui/material/FormGroup"
import Switch from "@mui/material/Switch"
import React, { useEffect, useState } from "react"

function UserSettings() {
	const {
		state: { user }
	} = useAuthContext()

	const [settings, setSettings] = useState<Settings>()
	const { updateDocument, response } = useFirestore("users")

	useEffect(() => {
		getUserDocument("users", user?.uid).then(data => {
			setSettings(data?.settings)
		})
	}, [user])

	const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>, setting: SettingsEnum) => {
		const {
			target: { checked }
		} = event

		switch (setting) {
			case SettingsEnum.SHOW_COLUMN_COUNT:
				setSettings({ ...settings, showColumnCount: checked })
				break
		}
	}

	const handleSave = async () => {
		if (!user?.uid || !settings) {
			openSnackbar({ severity: "error", message: "Error while saving!" })
			return
		} else {
			await updateDocument(user.uid, { settings })
			openSnackbar({ severity: "success", message: "Settings saved!" })
		}

		// updateDocument(, { settings })
	}

	return (
		<Box sx={{ ml: 5 }}>
			<h1>Settings</h1>
			{settings && (
				<>
					<Box>
						<FormGroup>
							<FormControlLabel
								control={
									<Switch
										checked={settings?.showColumnCount ?? false}
										onChange={event =>
											handleSwitchChange(event, SettingsEnum.SHOW_COLUMN_COUNT)
										}
									/>
								}
								label="Show number of tasks for each column"
							/>
						</FormGroup>
					</Box>
					<Button variant="contained" onClick={handleSave}>
						Save
					</Button>
				</>
			)}
			{!settings && <LoadingSpinner />}
		</Box>
	)
}

export default withAuth(UserSettings)
