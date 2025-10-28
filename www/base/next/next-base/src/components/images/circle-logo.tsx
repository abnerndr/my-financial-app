export function CircleLogoIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			className="stroke-zinc-800 dark:stroke-zinc-100"
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 32 32"
			aria-hidden="true"
			{...props}
		>
			<circle cx="16" cy="16" r="12" fill="none" strokeWidth="8" />
		</svg>
	);
}
