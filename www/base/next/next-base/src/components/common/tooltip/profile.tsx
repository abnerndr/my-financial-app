'use client';

import type React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from '@/components/ui/hover-card';

export type ProfileData = {
	userPath?: string;
	name: string;
	username: string;
	avatar: string;
};

export type PostData = {
	name: string;
	username: string;
	description: string | React.ReactNode;
	postPath?: string;
	image: string;
};

export interface TooltipProfileCardProps {
	profile: ProfileData;
	post: PostData;
}

export function TooltipProfileCard({ profile, post }: TooltipProfileCardProps) {
	return (
		<HoverCard>
			<div className="flex items-center gap-3">
				<Image
					className="shrink-0 rounded-full"
					src={profile.avatar}
					width={40}
					height={40}
					alt="Avatar"
				/>
				<div className="space-y-0.5">
					<HoverCardTrigger asChild>
						<p>
							<Link
								className="text-sm font-medium hover:underline"
								href={profile.userPath || '#'}
							>
								{profile.name}
							</Link>
						</p>
					</HoverCardTrigger>
					<p className="text-muted-foreground text-xs">{profile.username}</p>
				</div>
			</div>
			<HoverCardContent>
				<div className="space-y-3">
					<div className="flex items-center gap-3">
						<Image
							className="shrink-0 rounded-full"
							src={post.image}
							width={40}
							height={40}
							alt="Avatar"
						/>
						<div className="space-y-0.5">
							<p className="text-sm font-medium">{post.name}</p>
							<p className="text-muted-foreground text-xs">{post.username}</p>
						</div>
					</div>
					<p className="text-muted-foreground text-sm">{post.description}</p>
				</div>
			</HoverCardContent>
		</HoverCard>
	);
}
