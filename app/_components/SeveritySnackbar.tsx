"use client"

import MuiAlert, { AlertProps } from "@mui/material/Alert"
import Snackbar from "@mui/material/Snackbar"
import React, { useEffect, useState } from "react"

interface ISeveritySnackbarProps {
	autoHideDuration?: number | undefined
	horizontalPosition?: "left" | "center" | "right" | undefined
	verticalPosition?: "top" | "bottom" | undefined
	severity: "success" | "info" | "warning" | "error" | undefined
	message: string
}

interface ISeveritySnackbarArguments {
	severity: "success" | "info" | "warning" | "error" | undefined
	message: string
	autoHideDuration?: number | undefined
	horizontalPosition?: "left" | "center" | "right" | undefined
	verticalPosition?: "top" | "bottom" | undefined
}

const Action = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

let openSnackbarFn: (args: ISeveritySnackbarArguments) => void

export function SeveritySnackbarProvider({ children }: { children: React.ReactNode }) {
	const [open, setOpen] = useState(false)
	const [message, setMessage] = useState("")
	const [autoHideDuration, setAutoHideDuration] = useState<ISeveritySnackbarProps["autoHideDuration"]>(5000)
	const [horizontalPosition, setHorizontalPosition] =
		useState<ISeveritySnackbarProps["horizontalPosition"]>("right")
	const [verticalPosition, setVerticalPosition] = useState<ISeveritySnackbarProps["verticalPosition"]>("bottom")
	const [severity, setSeverity] = useState<ISeveritySnackbarProps["severity"]>("success")

	const openSnackbar = ({
		message,
		severity,
		autoHideDuration,
		verticalPosition,
		horizontalPosition
	}: ISeveritySnackbarArguments) => {
		setOpen(true)
		setMessage(message)
		setSeverity(severity)
		setAutoHideDuration(autoHideDuration)
		setVerticalPosition(verticalPosition)
		setHorizontalPosition(horizontalPosition)
	}

	useEffect(() => {
		openSnackbarFn = openSnackbar
	}, [])

	const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
		if (reason === "clickaway") {
			return
		}
		setOpen(false)
	}

	return (
		<>
			<Snackbar
				open={open}
				autoHideDuration={autoHideDuration ?? 5000}
				onClose={handleClose}
				anchorOrigin={{
					horizontal: horizontalPosition ?? "right",
					vertical: verticalPosition ?? "bottom"
				}}
			>
				<Action severity={severity ?? "info"}>{message}</Action>
			</Snackbar>
			{children}
		</>
	)
}

export function openSnackbar({
	severity,
	message,
	autoHideDuration,
	horizontalPosition,
	verticalPosition
}: ISeveritySnackbarArguments) {
	openSnackbarFn({ severity, message, autoHideDuration, horizontalPosition, verticalPosition })
}
