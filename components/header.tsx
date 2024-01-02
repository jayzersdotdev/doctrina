'use client'

import Link from 'next/link'
import { Button } from './ui/button'
import { HomeIcon, PersonIcon, PlusCircledIcon } from '@radix-ui/react-icons'
import dynamic from 'next/dynamic'
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Tables } from '@/lib/database.types'
import { useUpload } from '@/hooks/use-upload'
import humanId from 'human-id'

const DropdownMenu = dynamic(
	() => import('./ui/dropdown-menu').then((mod) => mod.DropdownMenu),
	{
		ssr: false,
		loading: () => (
			<Button
				size="icon"
				variant="secondary"
				className="animate-pulse"
			></Button>
		),
	},
)
const ThemeToggle = dynamic(
	() => import('./theme-toggle').then((mod) => mod.ThemeToggle),
	{
		ssr: false,
		loading: () => (
			<Button
				size="icon"
				className="animate-pulse"
				variant="secondary"
			></Button>
		),
	},
)
const DropdownMenuContent = dynamic(
	() => import('./ui/dropdown-menu').then((mod) => mod.DropdownMenuContent),
	{ ssr: false },
)
const DropdownMenuTrigger = dynamic(
	() => import('./ui/dropdown-menu').then((mod) => mod.DropdownMenuTrigger),
	{
		ssr: false,
		loading: () => (
			<Button
				size="icon"
				variant="secondary"
				className="animate-pulse"
			></Button>
		),
	},
)

export function Header({
	profile,
}: {
	profile: Pick<Tables<'profiles'>, 'avatar_url' | 'username' | 'role'>
}) {
	const { fileUrl } = useUpload(
		'avatars',
		profile.avatar_url,
		profile.username || humanId(),
	)

	return (
		<header className="px-4 py-2">
			<div className="flex justify-between items-center w-full">
				<div className="flex items-center">
					<div className="px-2 inline-flex items-center">
						<Button
							asChild
							variant="ghost"
							size="icon"
							className="px-0"
						>
							<Link href="/">
								<HomeIcon className="size-6" />{' '}
								<span className="sr-only">Home</span>
							</Link>
						</Button>
					</div>
				</div>
				<div className="flex items-center gap-2">
					{profile && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="icon">
									<span className="sr-only">
										Open Class Menu
									</span>
									<PlusCircledIcon className="w-6 h-6" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								{profile.role === 'instructor' && (
									<DropdownMenuItem>
										<Button
											size="lg"
											asChild
											variant="ghost"
										>
											<Link href="/create/course">
												Create Course
											</Link>
										</Button>
									</DropdownMenuItem>
								)}
								<DropdownMenuItem>
									<Button size="lg" asChild variant="ghost">
										<Link href="/enroll/course">
											Enroll Course
										</Link>
									</Button>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon">
								<span className="sr-only">Open User Menu</span>
								<Avatar className="h-8 w-8">
									<AvatarImage src={fileUrl || undefined} />
									<AvatarFallback>
										<PersonIcon />
									</AvatarFallback>
								</Avatar>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent side="bottom" align="end">
							{profile ? (
								<>
									<DropdownMenuItem>
										<Button asChild variant="link">
											<Link href="/profile">Profile</Link>
										</Button>
									</DropdownMenuItem>
									<DropdownMenuItem>
										<form
											action="/api/auth/signout"
											method="POST"
										>
											<Button
												type="submit"
												variant="link"
											>
												Log Out
											</Button>
										</form>
									</DropdownMenuItem>
								</>
							) : (
								<Button
									asChild
									variant="link"
									className="w-full"
								>
									<Link href="/auth/signin">Sign in</Link>
								</Button>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
					<ThemeToggle />
				</div>
			</div>
		</header>
	)
}
