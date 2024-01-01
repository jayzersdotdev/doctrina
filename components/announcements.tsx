import { Tables } from "@/lib/database.types"
import { Badge } from "./ui/badge"
import { CreateAnnouncement } from "./create-announcement"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Attachments } from "./attachments"

export function Announcements({
	profile,
	course,
	announcements,
}: {
	profile: Tables<'profiles'>
	course: Tables<'courses'>
	announcements: Array<Tables<'announcements'>>
}) {
	return (
		<section className="grid grid-cols-5">
			{profile.role === 'instructor' && (
				<div className="grid pt-10 col-span-2 place-items-start place-content-start gap-4">
					<div>
						<p className="leading-7 [&:not(:first-child)]:mt-6">
							Get started by sharing the class code:{' '}
						</p>
						<Badge>{course.course_id}</Badge>
					</div>
					<div className="p-4 border rounded border-border">
						<p>Room: {course.room}</p>
						<p>Subject: {course.subject}</p>
						<p>Section: {course.section}</p>
					</div>
				</div>
			)}

			<div className="pt-10 col-span-3 border px-4 py-2">
				<CreateAnnouncement course={course} />
				<div className="flex flex-col gap-4 py-8">
					{announcements.length > 0 ? (
						announcements.map((announcement) => (
							<Card key={announcement.announcement_id}>
								<CardHeader>
									<CardTitle>{announcement.title}</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="whitespace-pre-line">
										{announcement.description}
									</p>
								</CardContent>
								{announcement.attachment && (
									<CardFooter className="grid grid-cols-2">
										<Attachments
											attachment={announcement.attachment}
										/>
									</CardFooter>
								)}
							</Card>
						))
					) : (
						<p className="leading-7 [&:not(:first-child)]:mt-6">
							This is the start of your classroom.
						</p>
					)}
				</div>
			</div>
		</section>
	)
}
