namespace $ {

	export type $bog_nka_import_product = {
		title: string
		price: number
		description: string
		category: string
		available: boolean
	}

	export type $bog_nka_import_data = {
		title: string
		categories: string[]
		products: $bog_nka_import_product[]
		errors: string[]
	}

	const text = ( value: unknown )=> typeof value === 'string' ? value.trim() : ''

	export function $bog_nka_import_parse( json: string ): $bog_nka_import_data {

		const data: $bog_nka_import_data = { title: '', categories: [], products: [], errors: [] }
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

		const categories = new Set< string >()
		for( const category of Array.isArray( raw.categories ) ? raw.categories : [] ) {
			const name = text( category )
			if( name ) categories.add( name )
		}

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

			data.products.push({
				title,
				price: Number.isFinite( price ) && price > 0 ? price : 0,
				description: text( item.description ),
				category,
				available: item.available !== false,
			})

		} )

		data.categories = [ ... categories ]
		return data
	}

	export function $bog_nka_import_apply( catalog: $bog_nka_catalog, data: $bog_nka_import_data ) {

		if( data.title ) catalog.Title( 'auto' )!.val( data.title )

		const categories = catalog.Categories( 'auto' )!
		const known = categories.items()
		const fresh = data.categories.filter( category => !known.includes( category ) )
		if( fresh.length ) categories.items([ ... known, ... fresh ])

		const products = catalog.Products( 'auto' )!
		for( const item of data.products ) {
			const product = products.make( null )
			product.Title( 'auto' )!.val( item.title )
			product.Price( 'auto' )!.val( item.price )
			product.Description( 'auto' )!.val( item.description )
			product.Category( 'auto' )!.val( item.category )
			$bog_nka_product_status( product, item.available ? 'available' : 'sold' )
		}

	}

	export const $bog_nka_import_prompt = `You help an artist fill an online merch catalog.
Ask me short questions in my language, one at a time: what products I sell, their names, prices in rubles, short descriptions, categories and whether each one is in stock.
When you have enough, reply with JSON only, no comments, in this format:
{
	"title": "Catalog name",
	"categories": [ "Category" ],
	"products": [
		{ "title": "Name", "price": 1000, "description": "Short description", "category": "Category", "available": true }
	]
}
Every product must have a title. Price is a number without currency. I will upload photos myself later.`

}
