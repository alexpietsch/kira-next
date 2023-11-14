import LoadingSpinnerSVG from "@/public/assets/loading.svg"
import Image from "next/image"

interface ILoadingSpinnerProps {
	isFullpage?: boolean
	size?: "small" | "medium" | "large"
}

const spinnerSize = (size: "small" | "medium" | "large" | undefined) => {
	switch (size) {
		case "small":
			return "30"
		case "medium":
			return "70"
		case "large":
			return "100"
		default:
			return "70"
	}
}

const LoadingSpinner = ({ isFullpage, size }: ILoadingSpinnerProps) => {
	if (isFullpage) {
		return (
			<div className="loading-spinner">
				<Image
					priority={true}
					src={LoadingSpinnerSVG}
					alt="Picture of a loading symbol"
					height={spinnerSize(size)}
				/>
			</div>
		)
	}
	return (
		<div>
			<Image
				priority={true}
				src={LoadingSpinnerSVG}
				alt="Picture of a loading symbol"
				height={spinnerSize(size)}
			/>
		</div>
	)
}

export default LoadingSpinner
