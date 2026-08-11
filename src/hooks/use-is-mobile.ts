"use client";

import { useEffect, useState } from "react";

const MOBILE_MQ = "(max-width: 767px)";

/** Viewport mobile (layout). Desktop permanece inalterado acima de 768px. */
export function useIsMobileViewport(): boolean {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const mq = window.matchMedia(MOBILE_MQ);
		const update = () => setIsMobile(mq.matches);
		update();
		mq.addEventListener("change", update);
		return () => mq.removeEventListener("change", update);
	}, []);

	return isMobile;
}

export function isStandaloneDisplay(): boolean {
	if (typeof window === "undefined") return false;
	const nav = window.navigator as Navigator & { standalone?: boolean };
	return window.matchMedia("(display-mode: standalone)").matches || nav.standalone === true;
}

/** Dispositivo móvel (UA / touch) para toast de instalação PWA. */
export function isMobileDevice(): boolean {
	if (typeof window === "undefined") return false;
	const ua = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
	const coarse = window.matchMedia("(pointer: coarse)").matches;
	const narrow = window.matchMedia(MOBILE_MQ).matches;
	return ua || (coarse && narrow);
}

export function isIosDevice(): boolean {
	if (typeof window === "undefined") return false;
	return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}
