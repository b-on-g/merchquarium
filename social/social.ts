namespace $ {

	export function $bog_merchquarium_social_url( value: string ): URL | null {

		let text = value.trim()
		if( !text ) return null

		if( /^@?[a-zA-Z][\w]{3,}$/.test( text ) ) text = `https://t.me/${ text.replace( /^@/, '' ) }`
		else if( !/^[a-z][a-z\d+.-]*:/i.test( text ) ) text = `https://${ text.replace( /^\/+/, '' ) }`

		try {
			const url = new URL( text )
			if( url.protocol !== 'https:' && url.protocol !== 'http:' ) return null
			if( !url.hostname.includes( '.' ) ) return null
			return url
		} catch {
			return null
		}

	}

	export type $bog_merchquarium_social_kind = 'telegram' | 'vk' | 'youtube' | 'instagram' | 'web'

	export function $bog_merchquarium_social_kind( url: URL ): $bog_merchquarium_social_kind {
		const host = url.hostname.replace( /^(www|m)\./, '' )
		if( host === 't.me' || host === 'telegram.me' ) return 'telegram'
		if( host === 'vk.com' || host === 'vk.ru' || host === 'vk.me' ) return 'vk'
		if( host === 'youtube.com' || host === 'youtu.be' ) return 'youtube'
		if( host === 'instagram.com' ) return 'instagram'
		return 'web'
	}

	export function $bog_merchquarium_social_name( url: URL ) {
		return {
			telegram: 'Telegram',
			vk: 'VK',
			youtube: 'YouTube',
			instagram: 'Instagram',
			web: url.hostname.replace( /^www\./, '' ),
		}[ $bog_merchquarium_social_kind( url ) ]
	}

}
