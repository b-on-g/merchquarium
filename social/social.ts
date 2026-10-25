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

	export function $bog_merchquarium_social_same( left: URL, right: URL ) {
		const kind = $bog_merchquarium_social_kind( left )
		if( kind !== $bog_merchquarium_social_kind( right ) ) return false
		return kind !== 'web' || left.hostname.replace( /^www\./, '' ) === right.hostname.replace( /^www\./, '' )
	}

	export function $bog_merchquarium_social_header( order: string, links: readonly string[] ) {
		const urls = links.map( $bog_merchquarium_social_url ).filter( url => url ) as URL[]
		const main = $bog_merchquarium_social_url( order )
		const list = main && !urls.some( url => $bog_merchquarium_social_same( url, main ) ) ? [ main, ... urls ] : urls
		return [ ... new Set( list.map( url => url.toString() ) ) ]
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
