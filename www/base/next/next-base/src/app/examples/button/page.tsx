'use client';

import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import { useState } from 'react';
import { ButtonBase } from '@/components/common/button-base';
import { useCounterStore } from '@/hooks/store/use-counter';
import { handleCopyToClipboard } from '@/lib/utils';

const profilePicture =
	'https://img.freepik.com/free-psd/3d-render-avatar-character_23-2150611746.jpg?semt=ais_hybrid&w=740&q=80';
export default function ButtonPage() {
	const [bookMarked, setBookMarked] = useState<boolean>(false);
	const { count, decrement, increment } = useCounterStore((state) => state);
	const handleCopy = (text: string) => {
		handleCopyToClipboard(text);
		console.log('Copied to clipboard');
		return Promise.resolve();
	};
	return (
		<div className="w-full px-10 mx-auto h-screen flex justify-center flex-col gap-y-6 items-center my-10">
			<ButtonBase.ToggleTheme />
			<ButtonBase.Simple rounded> Button Simple</ButtonBase.Simple>
			<ButtonBase.Keyword keyword="CTRL + P">Button</ButtonBase.Keyword>
			<ButtonBase.Profile
				src={profilePicture}
				username="@john_doe"
				alt="Profile Picture"
			/>
			<ButtonBase.Bookmark
				pressed={bookMarked}
				onPressedChange={() => setBookMarked(!bookMarked)}
				color="zinc"
			/>
			<ButtonBase.Count
				count={count}
				max={10}
				min={0}
				increment={increment}
				decrement={decrement}
			/>
			<ButtonBase.Copy handleCopy={handleCopy} text="Texto para copiar" />
			<ButtonBase.Like
				text="Curtir"
				total={count}
				likeType="like"
				decrement={decrement}
				increment={increment}
			/>
			<ButtonBase.Like
				text="Dislike"
				total={count}
				likeType="dislike"
				decrement={decrement}
				increment={increment}
			/>
			<ButtonBase.Link href="#" leftIcon={ArrowRightIcon}>
				Link
			</ButtonBase.Link>
			<ButtonBase.Link href="#" leftIcon={ArrowLeftIcon}>
				Link
			</ButtonBase.Link>
		</div>
	);
}
