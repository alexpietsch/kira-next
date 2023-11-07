"use client"

// hooks
import { useAuthContext } from "../_hooks/useAuthContext"
import { useLogout } from "../_hooks/useLogout"
// styles
import styles from "./Navbar.module.css"
// icons & images
import Logo from "@/public/assets/logo.svg"
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined"
import LogoutIcon from "@mui/icons-material/Logout"
// material ui
import { IconButton, Button, Avatar, Menu, MenuItem, ListItemIcon } from "@mui/material"
// next & react
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { useState } from "react"

export default function Navbar() {
	const { logout } = useLogout()
	const { state } = useAuthContext()
	const { user, authIsReady } = state
	const { push } = useRouter()

	const [menuAnchor, setMenuAnchor] = useState(null)
	const open = Boolean(menuAnchor)

	const handleAvatarClick = (e: any) => {
		setMenuAnchor(e.currentTarget)
	}
	const handleProfileMenuClose = () => {
		setMenuAnchor(null)
	}

	return (
		<nav className={styles.navContainer}>
			<div className={styles.pageTitleWrapper}>
				<Image src={Logo} alt="Logo" className={styles.logo} />
				<Link href="/">Kira</Link>
			</div>
			{authIsReady && (
				<>
					{!user && (
						<ul className={styles.navElements}>
							<li>
								<Button variant="contained" onClick={() => push("/login")}>
									Login
								</Button>
							</li>
							<li style={{ marginLeft: "16px" }}>
								<Button variant="contained" onClick={() => push("/signup")}>
									Signup
								</Button>
							</li>
						</ul>
					)}
					{user && (
						<ul className={styles.navElements}>
							<li>Logged in as {user.displayName}</li>
							<li style={{ marginLeft: "8px" }}>
								<IconButton onClick={handleAvatarClick}>
									<Avatar
										sx={{ width: 32, height: 32 }}
										alt={user.displayName + " avatar"}
										src={user.photoURL ? user.photoURL : "/assets/avatar.png"}
									/>
								</IconButton>
							</li>
						</ul>
					)}
					{user && (
						<Menu
							anchorEl={menuAnchor}
							id="account-menu"
							open={open}
							onClose={handleProfileMenuClose}
							onClick={handleProfileMenuClose}
							PaperProps={{
								elevation: 0,
								sx: {
									overflow: "visible",
									filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
									mt: 1.5,
									"& .MuiAvatar-root": {
										width: 32,
										height: 32,
										ml: -0.5,
										mr: 1
									},
									"&:before": {
										content: '""',
										display: "block",
										position: "absolute",
										top: 0,
										right: 14,
										width: 10,
										height: 10,
										bgcolor: "background.paper",
										transform: "translateY(-50%) rotate(45deg)",
										zIndex: 0
									}
								}
							}}
							transformOrigin={{ horizontal: "right", vertical: "top" }}
							anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
						>
							<MenuItem onClick={() => push("/")}>
								<ListItemIcon>
									<HomeOutlinedIcon />
								</ListItemIcon>
								Home
							</MenuItem>

							<MenuItem onClick={() => push("/profile")}>
								<ListItemIcon>
									<Avatar
										sx={{ width: 12, height: 12 }}
										alt={user.displayName + " avatar"}
										src={user.photoURL ? user.photoURL : "/assets/avatar.png"}
									/>
								</ListItemIcon>
								Your Profile
							</MenuItem>

							<MenuItem onClick={logout}>
								<ListItemIcon>
									<LogoutIcon />
								</ListItemIcon>
								Logout
							</MenuItem>
						</Menu>
					)}
				</>
			)}
		</nav>
	)
}
