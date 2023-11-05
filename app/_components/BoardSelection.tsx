import { KiraDocument } from "@/types/KiraDocument"
import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import ListItemText from "@mui/material/ListItemText"
import MenuItem from "@mui/material/MenuItem"
// mui components
import MenuList from "@mui/material/MenuList"
import Paper from "@mui/material/Paper"
import { useRouter } from "next/navigation"
import { type } from "os"
import React from "react"

type Props = {
	data: KiraDocument[]
}

export default function BoardSelection(props: Props) {
	const { push } = useRouter()
	const { data } = props

	return (
		<Grid container spacing={0} direction="column" alignItems="center" justifyContent="center" style={{ minHeight: "60vh" }}>
			<Grid item xs={3}>
				<Paper sx={{ width: 320 }}>
					<MenuList>
						{data.map((board: KiraDocument) => (
							<MenuItem
								sx={{ padding: ".6em" }}
								key={board.boardID}
								onClick={() => push(`/board/${board.boardID}`)}
							>
								<ListItemText primary={board.boardName} />
							</MenuItem>
						))}
						<div style={{ padding: "1em" }}>
							<Button variant="contained" onClick={() => push("/board/new")}>
								Create a new board
							</Button>
						</div>
					</MenuList>
				</Paper>
			</Grid>
		</Grid>
	)
}
