/** @type {import('next').NextConfig} */
const config = {
	logging: {
		fetches: { fullUrl: true },
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com',
				port: '',
			},
		],
		domains: ['loremflickr.com'],
	},
}

export default config
