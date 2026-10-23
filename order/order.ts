namespace $ {

	export type $bog_nka_order_items = Record< string, number >

	export function $bog_nka_order_encode( catalog: string, items: $bog_nka_order_items ) {
		return Object.entries( items )
			.filter( ([ link, count ])=> link.startsWith( catalog ) && count > 0 )
			.map( ([ link, count ])=> `${ link.slice( catalog.length ) }.${ Math.floor( count ) }` )
			.join( '~' )
	}

	export function $bog_nka_order_decode( catalog: string, code: string ): $bog_nka_order_items {
		const items: $bog_nka_order_items = {}
		for( const chunk of code.split( '~' ) ) {
			const match = /^([\w-]+)\.(\d{1,4})$/.exec( chunk )
			if( !match || !Number( match[2] ) ) continue
			items[ catalog + match[1] ] = Number( match[2] )
		}
		return items
	}

	export function $bog_nka_order_message( template: string, order: { titles: string[], count: number, total: number, link: string } ) {
		const message = template
			.replace( /\{count\}/g, String( order.count ) )
			.replace( /\{total\}/g, order.total.toLocaleString( 'ru-RU' ) )
			.replace( /\{title\}/g, order.titles.join( ', ' ) )
			.replace( /\{link\}/g, order.link )
		return template.includes( '{link}' ) ? message : `${ message } ${ order.link }`
	}

}
