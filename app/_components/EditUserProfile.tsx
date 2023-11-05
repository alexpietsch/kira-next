import { projectStorage } from "@/app/_firebase/config"
import { useAuthContext } from "@/app/_hooks/useAuthContext"
import { TextField, DialogTitle, Dialog, DialogActions, Button } from "@mui/material"
import { updateProfile } from "firebase/auth"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import React, { Dispatch, SetStateAction, useState } from "react"

interface IEditUserProfileProps {
	open: boolean
	onClose: Dispatch<SetStateAction<any>>
	setIsSnackBarOpen: Dispatch<SetStateAction<any>>
}

export default function EditUserProfile({ open, onClose, setIsSnackBarOpen }: IEditUserProfileProps) {
	const { state } = useAuthContext()
	const user = state.user!

	const [displayName, setDisplayName] = useState(user?.displayName ?? "No name provided")
	const [profileImage, setProfileImage] = useState<File | null>()
	const [profileImageError, setProfileImageError] = useState("")

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		setProfileImage(null)
		if (!e.target.files) return
		let selectedFile = e.target.files[0]

		if (!selectedFile) {
			setProfileImageError("No file selected")
			return
		}
		if (!selectedFile.type.includes("image")) {
			setProfileImageError("File must be an image")
			return
		}
		if (selectedFile.size > 100000) {
			setProfileImageError("File must be less than 100kb")
			return
		}
		setProfileImageError("")
		setProfileImage(selectedFile)
	}

	const handleSubmitProfilePicture = async () => {
		if (!profileImage) return
		const uploadPath = `${user?.uid}/profilePicture/${profileImage.name}`
		let imgUrl
		try {
			let imgRef = ref(projectStorage, uploadPath)
			uploadBytes(imgRef, profileImage).then(snapshot => {
				getDownloadURL(snapshot.ref).then(url => (imgUrl = url))
			})
		} catch (error) {
			console.error(error)
			return
		}

		if (imgUrl && user) {
			await updateProfile(user, { photoURL: imgUrl })
			onClose(false)
			setIsSnackBarOpen(true)
		}
	}
	return (
		<div>
			<Dialog open={open} onClose={onClose} fullWidth={true} maxWidth="lg" sx={{ p: "20px" }}>
				<DialogTitle>Edit Profile</DialogTitle>
				<TextField
					label="Username"
					value={displayName}
					onChange={e => setDisplayName(e.target.value)}
					sx={{ maxWidth: "500px", m: "20px" }}
				/>
				<p style={{ marginLeft: "20px" }}>Change Avatar</p>
				<input style={{ marginLeft: "20px" }} required type="file" onChange={handleFileChange} />
				{/* <Button
                size='small'
                variant='outlined'
                style={{ marginLeft: "20px", marginTop: "10px", maxWidth: "200px" }}
                color="error"
                disabled={user.photoURL === null}
                onClick={}
                >Delete Avatar</Button> */}
				<Button
					size="small"
					variant="outlined"
					style={{ marginLeft: "20px", marginTop: "10px", maxWidth: "200px" }}
					disabled={profileImage == null}
					onClick={handleSubmitProfilePicture}
				>
					Submit
				</Button>
				{profileImageError && (
					<p style={{ marginLeft: "20px" }} className="error">
						{profileImageError}
					</p>
				)}
				<DialogActions>
					<Button onClick={() => onClose(false)}>Cancel</Button>
					<Button
						variant="contained"
						onClick={async () => {
							if (user) {
								await updateProfile(user, { displayName })
								onClose(false)
							}
						}}
					>
						Save Changes
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	)
}
