'use client';

import { ChevronDownIcon, LogOutIcon } from 'lucide-react';
import { Fragment } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { StringHelper } from '@/lib/helpers/string';
import type { IconProps } from '@/types/icons';

export type DropdownProfileItems = {
	label: string;
	value: string;
	icon: IconProps;
};

export type DropdownProfileGroup = {
	id: string;
	items: DropdownProfileItems[];
};

export type DropdownProfile = {
	name: string;
	email: string;
	imageUrl: string;
};

export interface DropdownProfileProps {
	profile: DropdownProfile;
	items: DropdownProfileGroup[];
	logout: () => void;
}

export function DropdownProfile({ profile, items, logout }: DropdownProfileProps) {
	const initials = StringHelper.initials(profile.name);
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
					<Avatar>
						<AvatarImage src={profile.imageUrl} alt={profile.name} />
						<AvatarFallback>{initials}</AvatarFallback>
					</Avatar>
					<ChevronDownIcon size={16} className="opacity-60" aria-hidden="true" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="max-w-64">
				<DropdownMenuLabel className="flex min-w-0 flex-col">
					<span className="truncate text-sm font-medium text-foreground">
						{profile.name}
					</span>
					<span className="truncate text-xs font-normal text-muted-foreground">
						{profile.email}
					</span>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{items.map((group) => (
					<Fragment key={group.id}>
						<DropdownMenuGroup>
							{group.items.map((item) => (
								<DropdownMenuItem key={item.value}>
									<item.icon size={16} className="opacity-60" aria-hidden="true" />
									<span>{item.label}</span>
								</DropdownMenuItem>
							))}
						</DropdownMenuGroup>
						{items.length > 1 && items[items.length - 1].id !== group.id && (
							<DropdownMenuSeparator />
						)}
					</Fragment>
				))}
				{items.length > 0 && <DropdownMenuSeparator />}
				<DropdownMenuItem onClick={logout}>
					<LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
					<span>Sair</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
