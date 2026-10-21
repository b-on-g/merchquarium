namespace $ {

	export function $bog_nka_social_url( value: string ): URL | null {

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

}
