import { Tables } from '@/lib/database.types'
import Link from 'next/link'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from './ui/card'
import { Button, buttonVariants } from './ui/button'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { getProfileById } from '@/lib/queries/profile'
import { DotsVerticalIcon, PersonIcon } from '@radix-ui/react-icons'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { DeleteCourse } from './delete-course'
import { cx } from '@/lib/cva.config'
import Image from 'next/image'

export async function Course({ course }: { course: Tables<'courses'> }) {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const {
		data: { session },
	} = await supabase.auth.getSession()

	if (!session) {
		redirect('/auth/signin')
	}

	const { data: profileData, error: profileError } = await supabase
		.from('profiles')
		.select('role, full_name, username')
		.eq('profile_id', session.user.id)
		.limit(1)
		.single()

	const { data: instructorProfileData, error: instructorProfileError } =
		await supabase
			.from('profiles')
			.select('avatar_url')
			.eq('profile_id', course.instructor_id)
			.limit(1)
			.single()

	if (profileError) {
		throw new Error(profileError.message)
	}

	if (instructorProfileError) {
		throw new Error(instructorProfileError.message)
	}

	const [profile, instructorProfile] = await Promise.all([
		profileData,
		instructorProfileData,
	])

	if (!profile) {
		redirect('/auth/signin')
	}

	const assignments = await supabase
		.from('assignments')
		.select('*')
		.eq('course_id', course.course_id)

	if (!assignments.data) {
		notFound()
	}

	const pending =
		assignments.data.length === 0 ? 'no' : assignments.data.length
	const classWorks =
		assignments.data.length === 0 ? 'classwork' : 'classworks'
	const toDo = profile.role === 'instructor' ? 'to grade' : 'to complete'

	const getAvatarAlt = () => {
		if (profile.full_name) {
			return `${profile.full_name}'s avatar`
		} else if (profile.username) {
			return `${profile.full_name}'s avatar`
		} else {
			return 'A user avatar'
		}
	}

	const avatarAlt = getAvatarAlt()

	const Avatar = ({ src }: { src: string | null }) => {
		if (src) {
			return (
				<Image
					src={src}
					alt={avatarAlt}
					className={cx('aspect-square h-full w-full')}
					width={40}
					height={40}
				/>
			)
		}

		return (
			<div
				className={cx(
					'flex h-full w-full items-center justify-center rounded-full bg-muted',
				)}
			>
				<PersonIcon />
			</div>
		)
	}

	return (
		<Card className="max-w-sm h-60">
			<CardHeader className="flex flex-row justify-between items-center">
				<div>
					<CardTitle>{course.course_name}</CardTitle>
					<CardDescription>
						{course.course_description}
					</CardDescription>
				</div>
				<div>
					<div
						className={cx(
							'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
						)}
					>
						<Avatar src={instructorProfile.avatar_url} />
					</div>
				</div>
				<div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button size="icon" variant="ghost">
								<DotsVerticalIcon />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem>
								<DeleteCourse courseId={course.course_id} />
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</CardHeader>
			<CardContent>
				<p>
					You currently have {pending} pending {classWorks} {toDo}.
				</p>
			</CardContent>
			<CardFooter>
				<Link
					className={cx(
						buttonVariants({ variant: 'default' }),
						'w-full',
					)}
					href={`/course/${course.course_id}`}
				>
					View More
				</Link>
			</CardFooter>
		</Card>
	)
}
