import { Tables } from '@/lib/database.types'
import { createClient } from '@/lib/supabase/server'
import { getFilename } from '@/lib/utils'
import { FileIcon } from '@radix-ui/react-icons'
import { cookies } from 'next/headers'
import { buttonVariants } from './ui/button'
import Link from 'next/link'

export function Attachments({
	attachment,
}: {
	attachment: Tables<'announcements'>['attachment']
}) {
	if (!attachment) return null

	const cookieStore = cookies()
	const supabase = createClient(cookieStore)
	const { data } = supabase.storage.from('files').getPublicUrl(attachment)
	const filename = getFilename(attachment)
	return (
		<Link
			href={data.publicUrl}
			download
			target="_blank"
			className={buttonVariants({ variant: 'outline', size: 'lg' })}
		>
			<FileIcon className="size-4" />
			<span className="pl-2">{filename}</span>
		</Link>
	)
}


