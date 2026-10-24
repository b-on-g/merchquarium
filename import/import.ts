namespace $ {

	export type $bog_prilavok_import_product = {
		title: string
		price: number
		description: string
		category: string
		fandoms: string[]
		available: boolean
	}

	export type $bog_prilavok_import_data = {
		title: string
		categories: string[]
		fandoms: string[]
		products: $bog_prilavok_import_product[]
		errors: string[]
	}

	const text = ( value: unknown )=> typeof value === 'string' ? value.trim() : ''

	const names = ( value: unknown )=> {
		const list = Array.isArray( value ) ? value : typeof value === 'string' ? value.split( ',' ) : []
		return [ ... new Set( list.map( text ).filter( Boolean ) ) ]
	}

	export function $bog_prilavok_import_parse( json: string ): $bog_prilavok_import_data {

		const data: $bog_prilavok_import_data = { title: '', categories: [], fandoms: [], products: [], errors: [] }
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

		const categories = new Set( names( raw.categories ) )
		const fandoms = new Set( names( raw.fandoms ) )

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

			const tags = names( item.fandoms ?? item.tags )
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

	export function $bog_prilavok_import_apply( catalog: $bog_prilavok_catalog, data: $bog_prilavok_import_data ) {

		if( data.title ) catalog.Title( 'auto' )!.val( data.title )

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
			$bog_prilavok_product_status( product, item.available ? 'available' : 'sold' )
		}

	}

	export const $bog_prilavok_import_prompt = `You help an author fill an online merch catalog.
Ask me short questions in my language, one at a time: what products I sell, their names, prices in rubles, short descriptions, categories, fandoms (what the art is about) and whether each one is in stock.
When you have enough, reply with JSON only, no comments, in this format:
{
	"title": "Catalog name",
	"categories": [ "Category" ],
	"fandoms": [ "Fandom" ],
	"products": [
		{ "title": "Name", "price": 1000, "description": "Short description", "category": "Category", "fandoms": [ "Fandom" ], "available": true }
	]
}
Every product must have a title. Price is a number without currency. I will upload photos myself later.`

}
