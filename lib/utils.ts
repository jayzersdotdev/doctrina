export function getRandomElement<T>(array: T[]): T {
	return array[Math.floor(Math.random() * array.length)]
}

export const extractUsername = (email: string) => {
	let username = email.split('@')[0]
	username = username.replace(/[^a-zA-Z0-9]/g, '')
	username = username.toLowerCase()
	return username
}

export const getInitials = (name?: string) => {
	const names = name?.split(' ') ?? ''
	let initials = names[0].substring(0, 1).toUpperCase()
	if (names.length > 1) {
		initials += names[names.length - 1].substring(0, 1).toUpperCase()
	}
	return initials
}

export const getURL = (queryParam?: string) => {
	let url =
		process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
		process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
		'http://localhost:3000'
	// Make sure to include `https://` when not localhost.
	url = url.includes('http') ? url : `https://${url}`
	// Make sure to including trailing `/`.
	url = url.charAt(url.length - 1) === '/' ? url : `${url}/`
	if (!queryParam) {
		return url
	}

	// add potential query params
	url = `${url}${queryParam}`

	return url
}

export const createPostgresTimestamp = (date: Date) => {
	const year = date.getFullYear()
	const month = (date.getUTCMonth() + 1).toString().padStart(2, '0')
	const day = date.getUTCDate().toString().padStart(2, '0')
	const hours = date.getUTCHours().toString().padStart(2, '0')
	const minutes = date.getUTCMinutes().toString().padStart(2, '0')
	const seconds = date.getUTCSeconds().toString().padStart(2, '0')
	const milliseconds = date.getUTCMilliseconds().toString().padStart(3, '0')

	const formattedTimeStamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`

	return formattedTimeStamp
}

export const getFilename = (url: string) => {
	const filename = url.split('/').pop()
	return filename
}

export const constructDueDate = (date: string, time: string) => {
	const [hours, minutes] = time.split(':')
	const [year, month, day] = date.split('-')

	return new Date(
		parseInt(year),
		parseInt(month) - 1,
		parseInt(day),
		parseInt(hours),
		parseInt(minutes),
	)
}
