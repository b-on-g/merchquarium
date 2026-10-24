namespace $ {

	export class $bog_nka_seo_node extends $giper_baza_app_node {

		@ $mol_memo.method
		_root() {
			return $mol_file.relative( '.' )
		}

		origin( msg: $mol_rest_message ) {
			return process.env.BOG_NKA_SEO_ORIGIN?.replace( /\/$/, '' ) || msg.uri().origin
		}

		known( next?: string[] ) {
			return this.$.$mol_state_local.value( 'bog_nka_seo_catalogs', next ) ?? []
		}

		land_link( text: string | null ) {
			if( !text || !/^[\w-]{8}_[\w-]{8}$/.test( text.trim() ) ) return null
			return $giper_baza_link.check( text.trim() )
		}

		remember( link: $giper_baza_link ) {
			const known = this.known()
			if( !known.includes( link.str ) ) this.known([ ... known, link.str ])
		}

		_auto() {
			super._auto()
			for( const link of this.known() ) {
				this.$.$giper_baza_glob.Land( new $giper_baza_link( link ) ).sync()
			}
		}

		catalog( origin: string, link: $giper_baza_link ): $bog_nka_seo_catalog | null {

			const land = this.$.$giper_baza_glob.Land( link ).sync()
			if( land.encrypted() ) return null

			const catalog = land.Data( $bog_nka_catalog )
			if( catalog.Hidden()?.val() ) return null

			const products = ( catalog.Products()?.remote_list() ?? [] )
				.filter( product => $bog_nka_product_status( product ) !== 'hidden' )
				.map( product => {
					const photo = product.Photos()?.items()[0]
					return {
						title: product.Title()?.val()?.trim() ?? '',
						price: product.Price()?.val() ?? 0,
						description: product.Description()?.val()?.trim() ?? '',
						category: product.Category()?.val() ?? '',
						available: $bog_nka_product_status( product ) === 'available',
						cover: photo ? `${ origin }/cover?BAZA:file=${ photo }` : '',
					}
				} )
				.filter( product => product.title )

			return {
				link: link.str,
				url: `${ origin }/?catalog=${ link }`,
				title: catalog.Title()?.val()?.trim() || 'Каталог',
				products,
			}

		}

		verification() {
			return Object.entries({
				'google-site-verification': process.env.BOG_NKA_SEO_GOOGLE,
				'yandex-verification': process.env.BOG_NKA_SEO_YANDEX,
			})
				.filter( ([ , token ])=> token )
				.map( ([ name, token ])=> `<meta name="${ name }" content="${ $bog_nka_seo_escape( token! ) }" />` )
				.join( '' )
		}

		html( msg: $mol_rest_message, html: string ) {
			msg.reply( html.replace( '</head>', `${ this.verification() }</head>` ), { type: 'text/html;charset=utf-8' } )
		}

		GET( msg: $mol_rest_message ) {

			const uri = msg.uri()
			const origin = this.origin( msg )

			if( uri.pathname === '/robots.txt' ) {
				return msg.reply( `User-agent: *\nAllow: /\nSitemap: ${ origin }/sitemap.xml\n` )
			}

			if( uri.pathname === '/sitemap.xml' ) {
				const urls = this.known()
					.map( link => this.catalog( origin, new $giper_baza_link( link ) ) )
					.filter( catalog => catalog?.products.length )
					.map( catalog => catalog!.url )
				return msg.reply( $bog_nka_seo_sitemap( urls ), { type: 'application/xml' } )
			}

			if( uri.pathname !== '/' ) return super.GET( msg )

			const template = this._root().resolve( 'index.html' ).text()

			const link = this.land_link( uri.searchParams.get( 'catalog' ) )
			if( !link ) return this.html( msg, template )

			this.remember( link )

			const catalog = this.catalog( origin, link )
			this.html( msg, catalog ? $bog_nka_seo_page( template, catalog ) : template )

		}

		POST( msg: $mol_rest_message ) {

			if( msg.uri().pathname !== '/register' ) return super.POST( msg )

			msg.port.send_prop( 'access-control-allow-origin', '*' )

			const link = this.land_link( msg.text() )
			if( !link ) return msg.port.send_code( 400 )

			if( this.$.$giper_baza_glob.Land( link ).encrypted() ) return msg.port.send_code( 403 )

			this.remember( link )
			msg.reply( null )

		}

	}

}
