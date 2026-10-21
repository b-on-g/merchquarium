namespace $ {

	export type $bog_nka_seo_product = {
		title: string
		price: number
		description: string
		category: string
		available: boolean
		cover: string
	}

	export type $bog_nka_seo_catalog = {
		link: string
		url: string
		title: string
		products: $bog_nka_seo_product[]
	}

	export function $bog_nka_seo_escape( text: string ) {
		return text.replace( /[&<>"']/g, char => `&#${ char.charCodeAt( 0 ) };` )
	}

	export function $bog_nka_seo_description( catalog: $bog_nka_seo_catalog ) {
		const names = catalog.products.slice( 0, 5 ).map( product => product.title ).join( ', ' )
		return names ? `${ catalog.title }: ${ names }` : catalog.title
	}

	export function $bog_nka_seo_ld( catalog: $bog_nka_seo_catalog ) {
		return {
			'@context': 'https://schema.org',
			'@type': 'ItemList',
			name: catalog.title,
			url: catalog.url,
			itemListElement: catalog.products.map( ( product, index )=> ({
				'@type': 'ListItem',
				position: index + 1,
				item: {
					'@type': 'Product',
					name: product.title,
					description: product.description || undefined,
					category: product.category || undefined,
					image: product.cover || undefined,
					offers: {
						'@type': 'Offer',
						price: product.price,
						priceCurrency: 'RUB',
						availability: product.available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
					},
				},
			}) ),
		}
	}

	export function $bog_nka_seo_page( template: string, catalog: $bog_nka_seo_catalog ) {

		const esc = $bog_nka_seo_escape
		const title = esc( catalog.title )
		const description = esc( $bog_nka_seo_description( catalog ) )
		const cover = catalog.products.find( product => product.cover )?.cover ?? ''
		const ld = JSON.stringify( $bog_nka_seo_ld( catalog ) ).replace( /</g, '\\u003c' )

		const head = [
			`<title>${ title }</title>`,
			`<meta name="description" content="${ description }" />`,
			`<link rel="canonical" href="${ esc( catalog.url ) }" />`,
			`<meta property="og:title" content="${ title }" />`,
			`<meta property="og:description" content="${ description }" />`,
			`<meta property="og:url" content="${ esc( catalog.url ) }" />`,
			`<meta property="og:type" content="website" />`,
			cover ? `<meta property="og:image" content="${ esc( cover ) }" />` : '',
			`<script type="application/ld+json">${ ld }</script>`,
		].filter( Boolean ).join( '\n\t\t' )

		const products = catalog.products.map( product => [
			'<article>',
			product.cover ? `<img src="${ esc( product.cover ) }" alt="${ esc( product.title ) }" />` : '',
			`<h2>${ esc( product.title ) }</h2>`,
			product.price ? `<p>${ product.price } ₽</p>` : '',
			product.description ? `<p>${ esc( product.description ) }</p>` : '',
			product.category ? `<p>${ esc( product.category ) }</p>` : '',
			'</article>',
		].filter( Boolean ).join( '' ) ).join( '\n' )

		const hash = `#!catalog=${ catalog.link }`
		const boot = `<script>if(!location.hash)history.replaceState(null,'',location.href.split('#')[0]+${ JSON.stringify( hash ) })</script>`

		return template
			.replace( /<title>[\s\S]*?<\/title>/, '' )
			.replace( /\s*<meta\s+(name|property)="(description|og:[a-z_]+|twitter:[a-z]+)"[\s\S]*?\/>/g, '' )
			.replace( /\s*<link rel="canonical"[^>]*\/>/, '' )
			.replace( '</head>', `\t${ head }\n\t</head>` )
			.replace( /(<div mol_view_root="\$bog_nka_app">)(<\/div>)/, `$1<main><h1>${ title }</h1>\n${ products }</main>$2` )
			.replace( /(<script src="web\.js")/, `${ boot }\n\t\t$1` )

	}

	export function $bog_nka_seo_sitemap( urls: string[] ) {
		const items = urls.map( url => `<url><loc>${ $bog_nka_seo_escape( url ) }</loc></url>` ).join( '' )
		return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${ items }</urlset>`
	}

}
