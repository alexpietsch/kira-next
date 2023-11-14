import { SeveritySnackbarProvider } from "./_components/SeveritySnackbar"
import "./global.css"
import Footer from "@/app/_components/Footer"
import Navbar from "@/app/_components/Navbar"
import { AuthContextProvider } from "@/app/_context/AuthContext"
import { Open_Sans } from "next/font/google"

export const metadata = {
	title: "Kira",
	description: "Drag and Drop ToDo App"
}

const inter = Open_Sans({
	subsets: ["latin"],
	display: "swap"
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className={inter.className}>
			<link rel="icon" href="/favicon.ico" sizes="any" />
			<AuthContextProvider>
				<SeveritySnackbarProvider>
					<body>
						<Navbar />
						<div className="App">{children}</div>
						<Footer />
					</body>
				</SeveritySnackbarProvider>
			</AuthContextProvider>
		</html>
	)
}
