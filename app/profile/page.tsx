"use client"

import EditUserProfile from "@/app/_components/EditUserProfile"
import withAuth from "@/app/_components/WithAuth"
import { useAuthContext } from "@/app/_hooks/useAuthContext"
import GenericUserAvatar from "@/public/assets/avatar.png"
import MuiAlert, { AlertProps } from "@mui/material/Alert"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import Snackbar from "@mui/material/Snackbar"
import Stack from "@mui/material/Stack"
import Image from "next/image"
import React, { useState } from "react"

function UserProfile() {
	const { state } = useAuthContext()
	const user = state.user!

	const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
	const [isSnackBarOpen, setIsSnackBarOpen] = useState(false)

	const handleClose = (event: any, reason: string) => {
		if (reason === "clickaway") {
			return
		}
		setIsSnackBarOpen(false)
	}
	const SnackbarAlert = React.forwardRef(function Alert(props: AlertProps) {
		return <MuiAlert elevation={6} variant="filled" {...props} />
	})

	return (
		<>
			<EditUserProfile open={isEditProfileOpen} onClose={setIsEditProfileOpen} setIsSnackBarOpen={setIsSnackBarOpen} />
			<Snackbar open={isSnackBarOpen} autoHideDuration={6000} onClose={handleClose}>
				<SnackbarAlert>Successfully updated profile image!</SnackbarAlert>
			</Snackbar>

			<Box sx={{ flexGrow: 1, mt: "50px", p: "20px" }}>
				<Grid container spacing={5}>
					<Grid item xs={12} sm={5}>
						<Box
							sx={{
								display: "flex",
								justifyContent: { sm: "flex-end", xs: "center" }
							}}
						>
							<Image
								width="0"
								height="0"
								style={{ width: "200px", height: "auto" }}
								src={user.photoURL ? user.photoURL : GenericUserAvatar}
								alt="User profile avatar"
								unoptimized
							/>
						</Box>
					</Grid>
					<Grid item xs={12} sm={7}>
						<Box
							sx={{
								display: "flex",
								justifyContent: { sm: "flex-start", xs: "center" }
							}}
						>
							<Stack
								spacing={3}
								sx={{
									display: "flex",
									justifyContent: "flex-start"
								}}
							>
								<Box>
									<span style={{ fontWeight: "bold" }}>Username:</span>
									<span style={{ marginLeft: "10px" }}>{user.displayName}</span>
								</Box>
								<Box>
									<span style={{ fontWeight: "bold" }}>Email:</span>
									<span style={{ marginLeft: "10px" }}>{user.email}</span>
								</Box>
								<Button onClick={() => setIsEditProfileOpen(true)} variant="outlined">
									Edit Profile
								</Button>
							</Stack>
						</Box>
					</Grid>
				</Grid>
			</Box>
		</>
	)
}

export default withAuth(UserProfile)
