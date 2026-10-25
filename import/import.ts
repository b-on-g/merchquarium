namespace $ {

	export type $bog_merchquarium_import_product = {
		title: string
		price: number
		description: string
		category: string
		fandoms: string[]
		available: boolean
	}

	export type $bog_merchquarium_import_data = {
		title: string
		social: string
		links: string[]
		categories: string[]
		fandoms: string[]
		products: $bog_merchquarium_import_product[]
		errors: string[]
	}

	const text = ( value: unknown )=> typeof value === 'string' ? value.trim() : ''

	const names = ( value: unknown )=> {
		const list = Array.isArray( value ) ? value : typeof value === 'string' ? value.split( ',' ) : []
		return [ ... new Set( list.map( text ).filter( Boolean ) ) ]
	}

	const fandoms_of = ( value: unknown )=> [ ... new Set( names( value ).map( $bog_merchquarium_catalog_fandom ).filter( Boolean ) ) ]

	export function $bog_merchquarium_import_social_key( value: string ) {
		return $bog_merchquarium_social_url( value )?.toString() ?? value.trim()
	}

	export function $bog_merchquarium_import_parse( json: string ): $bog_merchquarium_import_data {

		const data: $bog_merchquarium_import_data = { title: '', social: '', links: [], categories: [], fandoms: [], products: [], errors: [] }
		if( !json.trim() ) return data

		let raw: any
		try {
			raw = JSON.parse( json.trim().replace( /^```(?:json)?\s*|\s*```$/g, '' ) )
		} catch( error: any ) {
			data.errors.push( error.message )
			return data
		}

		if( !raw || typeof raw !== 'object' ) {
			data.errors.push( 'Root must be an object' )
			return data
		}

		data.title = text( raw.title )
		data.social = text( raw.social )
		if( data.social && !$bog_merchquarium_social_url( data.social ) ) {
			data.errors.push( `Link "${ data.social }" is not recognized` )
			data.social = ''
		}

		const links = new Map< string, string >()
		for( const link of names( raw.links ?? raw.socials ) ) {
			if( !$bog_merchquarium_social_url( link ) ) {
				data.errors.push( `Link "${ link }" is not recognized` )
				continue
			}
			const key = $bog_merchquarium_import_social_key( link )
			if( !links.has( key ) ) links.set( key, link )
		}
		data.links = [ ... links.values() ]

		const categories = new Set( names( raw.categories ) )
		const fandoms = new Set( fandoms_of( raw.fandoms ) )

		const products = Array.isArray( raw.products ) ? raw.products : []
		products.forEach( ( item: any, index: number )=> {

			const title = text( item?.title )
			if( !title ) {
				data.errors.push( `Product ${ index + 1 } has no title` )
				return
			}

			const price = Number( item.price ?? 0 )
			if( !Number.isFinite( price ) || price < 0 ) data.errors.push( `Product "${ title }" has wrong price` )

			const category = text( item.category )
			if( category ) categories.add( category )

			const tags = fandoms_of( item.fandoms ?? item.tags )
			for( const fandom of tags ) fandoms.add( fandom )

			data.products.push({
				title,
				price: Number.isFinite( price ) && price > 0 ? price : 0,
				description: text( item.description ),
				category,
				fandoms: tags,
				available: item.available !== false,
			})

		} )

		data.categories = [ ... categories ]
		data.fandoms = [ ... fandoms ]
		return data
	}

	export function $bog_merchquarium_import_new_links( catalog: $bog_merchquarium_catalog | null, data: $bog_merchquarium_import_data ) {
		const social = catalog?.Social()?.val() ?? ''
		const known = new Set( [ social, ... catalog?.Links()?.items() ?? [] ].filter( Boolean ).map( $bog_merchquarium_import_social_key ) )
		return [ data.social, ... data.links ].filter( link => {
			const key = $bog_merchquarium_import_social_key( link )
			if( !link || known.has( key ) ) return false
			known.add( key )
			return true
		} )
	}

	export function $bog_merchquarium_import_apply( catalog: $bog_merchquarium_catalog, data: $bog_merchquarium_import_data ) {

		if( data.title ) catalog.Title( 'auto' )!.val( data.title )

		const fresh_links = $bog_merchquarium_import_new_links( catalog, data )
		if( data.social && fresh_links.includes( data.social ) && !catalog.Social()?.val() ) catalog.Social( 'auto' )!.val( data.social )

		const social = $bog_merchquarium_import_social_key( catalog.Social()?.val() ?? '' )
		const extra = fresh_links.filter( link => $bog_merchquarium_import_social_key( link ) !== social )
		if( extra.length ) {
			const links = catalog.Links( 'auto' )!
			links.items([ ... links.items(), ... extra ])
		}

		const categories = catalog.Categories( 'auto' )!
		const known = categories.items()
		const fresh = data.categories.filter( category => !known.includes( category ) )
		if( fresh.length ) categories.items([ ... known, ... fresh ])

		const fandoms = catalog.Fandoms( 'auto' )!
		const known_fandoms = fandoms.items()
		const fresh_fandoms = data.fandoms.filter( fandom => !known_fandoms.includes( fandom ) )
		if( fresh_fandoms.length ) fandoms.items([ ... known_fandoms, ... fresh_fandoms ])

		const products = catalog.Products( 'auto' )!
		for( const item of data.products ) {
			const product = products.make( null )
			product.Title( 'auto' )!.val( item.title )
			product.Price( 'auto' )!.val( item.price )
			product.Description( 'auto' )!.val( item.description )
			product.Category( 'auto' )!.val( item.category )
			if( item.fandoms.length ) product.Fandoms( 'auto' )!.items( item.fandoms )
			$bog_merchquarium_product_status( product, item.available ? 'available' : 'sold' )
		}

	}

	export const $bog_merchquarium_import_prompt = `You help an author fill an online merch catalog.
Ask me short questions in my language, one at a time: where buyers should send orders (Telegram or VK link), my other social links, what products I sell, their names, prices in rubles, short descriptions, categories, fandoms (what the art is about) and whether each one is in stock.
When you have enough, reply with JSON only, no comments, in this format:
{
	"title": "Catalog name",
	"social": "https://t.me/nick",
	"links": [ "https://vk.com/nick" ],
	"categories": [ "Category" ],
	"fandoms": [ "Fandom" ],
	"products": [
		{ "title": "Name", "price": 1000, "description": "Short description", "category": "Category", "fandoms": [ "Fandom" ], "available": true }
	]
}
Every product must have a title. Price is a number without currency. Fandoms are plain names without #. I will upload photos myself later.`

}
