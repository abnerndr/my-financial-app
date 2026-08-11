import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{ protocol: "https", hostname: "**", pathname: "/**" },
			{ protocol: "http", hostname: "**", pathname: "/**" },
		],
	},
	// Evita o Turbopack escolher /home/abner (package-lock.json) e falhar ao resolver tailwindcss
	turbopack: {
		root: projectRoot,
	},
	outputFileTracingRoot: projectRoot,
};

export default nextConfig;
