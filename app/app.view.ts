namespace $.$$ {
	export class $bog_merchquarium_app extends $.$bog_merchquarium_app {

		catalog_link( next?: string ) {
			return this.$.$mol_state_arg.value( 'catalog', next ) ?? ''
		}

		@ $mol_mem
		settings_open( next?: boolean ) {
			const state = this.$.$mol_state_arg.value(
				'settings',
				next === undefined ? undefined : next ? '' : null,
			)
			return state !== null
		}
		
		@ $mol_action
		settings_toggle() {
			this.cart_open( false )
			this.settings_open( !this.settings_open() )
		}
		
		@ $mol_mem
		cart_open( next?: boolean ) {
			const state = this.$.$mol_state_arg.value(
				'cart',
				next === undefined ? undefined : next ? '' : null,
			)
			return state !== null
		}

		@ $mol_action
		cart_toggle() {
			this.settings_open( false )
			this.cart_open( !this.cart_open() )
		}

		@ $mol_action
		cart_close() {
			this.cart_open( false )
			this.$.$mol_state_arg.value( 'order', null )
		}

		order_code() {
			return this.$.$mol_state_arg.value( 'order' ) ?? ''
		}

		order_items() {
			return $bog_merchquarium_order_decode( this.catalog_link(), this.order_code() )
		}

		cart( next?: $bog_merchquarium_order_items ) {
			const key = `bog_merchquarium_cart=${ this.catalog_link() }`
			return this.$.$mol_state_local.value( key, next ) ?? {}
		}

		cart_count( link: string, next?: number ) {
			if( next === undefined ) return this.cart()[ link ] ?? 0
			const items = { ... this.cart() }
			if( next > 0 ) items[ link ] = next
			else delete items[ link ]
			this.cart( items )
			return next
		}

		cart_size_text() {
			const size = Object.values( this.cart() ).reduce( ( sum, count )=> sum + count, 0 )
			return size ? String( size ) : ''
		}

		@ $mol_mem
		Cart_button() {
			return this.catalog_link() ? super.Cart_button() : null!
		}

		content() {
			if( this.settings_open() ) return [ this.Settings() ]
			if( this.catalog_link() && this.order_code() ) return [ this.Order() ]
			if( this.catalog_link() && this.cart_open() ) return [ this.Cart() ]
		
			return this.catalog_link()
				? [ this.Catalog_selected() ]
				: [ this.Catalog_missing() ]
		}

		catalog_selected_text() {
			const catalog = this.catalog()
			if( !catalog ) return 'Catalog missing'
		
			const products = catalog.Products()?.remote_list() ?? []
		
			return `Catalog: ${ catalog.link().str }; Products: ${ products.length }`
		}

		@ $mol_action
		catalog_create() {
			const land = this.$.$giper_baza_glob.land_grab()
			this.catalog_link( land.link().str )
		}

		auto() {
			return [ this.seo_register() ]
		}

		@ $mol_mem
		seo_register() {
			const server = this.seo_server()
			const link = this.catalog_link()
			if( !server || !link ) return false
			try {
				this.$.$mol_fetch.response( new URL( 'register', server ).toString(), { method: 'POST', body: link } )
				return true
			} catch( error ) {
				if( $mol_promise_like( error ) ) $mol_fail_hidden( error )
				return false
			}
		}

		title() {
			return this.catalog()?.Title()?.val()?.trim() || super.title()
		}

		@ $mol_mem
		Photo() {
			return $bog_merchquarium_photo.make({ $: this.$ })
		}

		image_url( key: $bog_merchquarium_catalog_image ) {
			const catalog = this.catalog()
			const link = catalog ? $bog_merchquarium_catalog_image( catalog, key ) : ''
			return link ? this.Photo().url( link ) : ''
		}

		@ $mol_mem
		style() {
			const back = this.image_url( 'Back' )
			const cover = this.image_url( 'Cover' )
			return {
				... super.style(),
				... $bog_merchquarium_theme_style( this.catalog()?.Theme()?.val() ),
				... back ? { '--bog_merchquarium_pattern': `url("${ back }")`, '--bog_merchquarium_pattern_size': 'cover' } : {},
				'--bog_merchquarium_cover': cover ? `url("${ cover }")` : 'none',
			}
		}

		head() {
			if( this.settings_open() || !this.catalog_link() ) return [ this.Title(), this.Product_add(), this.Tools() ]
			return [ this.Hero(), this.Product_add(), this.Tools() ]
		}

		avatar_empty() {
			return !this.image_url( 'Avatar' )
		}

		avatar_style() {
			const url = this.image_url( 'Avatar' )
			return { backgroundImage: url ? `url("${ url }")` : 'none' }
		}

		social_list() {
			const catalog = this.catalog()
			const values = [ catalog?.Social()?.val() ?? '', ... catalog?.Links()?.items() ?? [] ]
			const urls = values.map( value => $bog_merchquarium_social_url( value )?.toString() ?? '' ).filter( Boolean )
			return [ ... new Set( urls ) ]
		}

		socials() {
			return this.social_list().map( uri => this.Social( uri ) )
		}

		social_uri( uri: string ) {
			return uri
		}

		social_sub( uri: string ) {
			const kind = $bog_merchquarium_social_kind( new URL( uri ) )
			return [ {
				telegram: this.Icon_telegram,
				vk: this.Icon_vk,
				youtube: this.Icon_youtube,
				instagram: this.Icon_instagram,
				web: this.Icon_web,
			}[ kind ].call( this, uri ) ]
		}

		hero_sub() {
			return this.social_list().length ? [ this.Profile(), this.Socials() ] : [ this.Profile() ]
		}

		filters() {
			return [
				... Object.keys( this.kind_options() ).length > 1 ? [ this.Kind_filter() ] : [],
				... Object.keys( this.fandom_options() ).length > 1 ? [ this.Fandom_filter() ] : [],
				... this.visible_products().some( product => $bog_merchquarium_product_status( product ) === 'sold' ) ? [ this.In_stock() ] : [],
				this.Search(),
			]
		}

		settings_button_sub() {
			return [ this.settings_open() ? this.Return_icon() : this.Settings_icon() ]
		}

		@ $mol_mem
		Settings_button() {
			return this.is_admin() || this.settings_open() ? super.Settings_button() : null!
		}

		catalog_rows() {
			return [
				... this.visible_products().length ? [ this.Filters() ] : [],
				this.product_cards().length ? this.Product_cards() : this.Catalog_empty(),
			]
		}

		settings_button_title() {
			return this.settings_open()
				? this.Return_title()
				: this.Settings_title()
		}

		catalog() {
			const link = this.catalog_link()
			if( !link ) return null
		
			const land = this.$.$giper_baza_glob.Land(
				new this.$.$giper_baza_link( link ),
			)
		
			return land.Data( $bog_merchquarium_catalog )
		}

		@ $mol_action
		product_add() {
			const catalog = this.catalog()
			if( !catalog ) return
		
			catalog.Products( null )?.make( null )
		}
		
		product_link( link: string ) {
			return link
		}

		@ $mol_mem
		category_filter( next?: string ) {
			const value = next ?? 'all'
			return value === 'all' || this.filter_categories().includes( value ) ? value : 'all'
		}

		@ $mol_mem
		fandom_filter( next?: string ) {
			const value = next ?? 'all'
			return value === 'all' || this.filter_fandoms().includes( value ) ? value : 'all'
		}

		@ $mol_mem
		search( next?: string ) {
			return next ?? ''
		}

		kind_options() {
			return Object.fromEntries( [
				[ 'all', this.Kind_all() ],
				... this.filter_categories().map( kind => [ kind, kind ] ),
			] )
		}

		fandom_options() {
			return Object.fromEntries( [
				[ 'all', this.Fandom_all() ],
				... this.filter_fandoms().map( fandom => [ fandom, fandom ] ),
			] )
		}

		visible_products() {
			return ( this.catalog()?.Products()?.remote_list() ?? [] )
				.filter( product => product.can_change() || $bog_merchquarium_product_status( product ) !== 'hidden' )
		}

		filter_fandoms() {
			const fandoms = this.is_admin()
				? this.catalog()?.Fandoms()?.items() ?? []
				: this.visible_products().flatMap( product => product.Fandoms()?.items() ?? [] )
			return [ ... new Set( fandoms ) ]
		}

		product_match( product: $bog_merchquarium_product ) {
			const category = this.category_filter()
			if( category !== 'all' && product.Category()?.val() !== category ) return false

			const fandoms = product.Fandoms()?.items() ?? []
			const fandom = this.fandom_filter()
			if( fandom !== 'all' && !fandoms.includes( fandom ) ) return false

			const query = this.search().trim().replace( /^#/, '' ).toLowerCase()
			if( !query ) return true

			return [ product.Title()?.val() ?? '', product.Category()?.val() ?? '', ... fandoms ]
				.some( text => text.toLowerCase().includes( query ) )
		}

		@ $mol_mem
		is_admin() {
			return this.catalog()?.can_change()
		}
		
		@ $mol_mem
		is_not_admin() {
			return !this.is_admin()
		}

		filter_categories() {
			const categories = this.is_admin()
				? this.catalog()?.Categories()?.items() ?? []
				: this.visible_products()
					.map( product => product.Category()?.val() ?? '' )
					.filter( Boolean )
			return [ ... new Set( categories ) ]
		}

		product_cards() {
			const catalog = this.catalog()
			const products = catalog?.Products()?.remote_list() ?? []
			const by_link = new Map(
				products.map(product => [product.link().str, product] as const),
			)
			const catalog_link = this.catalog_link()
			const deleted = new Set(this.deleted_products(catalog_link))
			const order = [...this.product_order(catalog_link)]
			for (const product of products) {
				const link = product.link().str
				if (!order.includes(link)) order.push(link)
			}
		
			const cards: $mol_view[] = []
			const sold: $mol_view[] = []

			for (const link of order) {
				const product = by_link.get(link)

				if (product) {
					const status = $bog_merchquarium_product_status(product)
					if (!product.can_change() && status === 'hidden') continue
					if (this.in_stock_only() && status !== 'available') continue
					if (!this.product_match(product)) continue

					if (status === 'sold' && !this.is_admin()) sold.push(this.Product_card(link))
					else cards.push(this.Product_card(link))
					continue
				}
		
				if (!this.is_admin() || !deleted.has(link)) continue
		
				const removed = this.$.$giper_baza_glob.Pawn(
					new this.$.$giper_baza_link(link),
					$bog_merchquarium_product,
				)
		
				if (!this.product_match(removed)) continue
		
				cards.push(this.Product_undo(link))
			}

			return [ ... cards, ... sold ]
		}
		
		@ $mol_mem_key
		deleted_products(catalog_link: string, next?: string[]) {
			if (!catalog_link) return []
			return next ?? []
		}

		@ $mol_mem_key
		product_order(catalog_link: string, next?: string[]) {
			if (!catalog_link) return []
			return next ?? []
		}
		
		@ $mol_action
		product_delete(link: string) {
			if (!this.is_admin()) return
		
			const products = this.catalog()?.Products()
			if (!products) return
		
			const catalog_link = this.catalog_link()
			const deleted = this.deleted_products(catalog_link)
			if (deleted.includes(link)) return

			const product_links = products.remote_list().map(product => product.link().str)
			if (!product_links.includes(link)) return

			const saved_order = this.product_order(catalog_link)
			const order = saved_order.length ? [ ... saved_order ] : product_links
			if (!order.includes(link)) order.push(link)
		
			products.cut(new this.$.$giper_baza_link(link))
			this.product_order(catalog_link, order)
			this.deleted_products(catalog_link, [ ... deleted, link ])
			this.focused(true)

		}
		
		@ $mol_action
		product_undo(link: string) {
			if (!this.is_admin()) return
		
			const catalog_link = this.catalog_link()
			const products = this.catalog()?.Products()
			if (!products) return
		
			const deleted = this.deleted_products(catalog_link)
			const deleted_index = deleted.indexOf(link)
			if (deleted_index < 0) return
		
			const order = this.product_order(catalog_link)
			const order_index = order.indexOf(link)
			const items = products.items()
		
			if (order_index < 0) {
				products.add(new this.$.$giper_baza_link(link))
			} else {
				const next_index = items.findIndex(item => {
					const item_index = order.indexOf(item.str)
					return item_index < 0 || item_index > order_index
				})
				const insert_at = next_index < 0 ? items.length : next_index
				const product_link = new this.$.$giper_baza_link(link)
		
				products.splice([product_link], insert_at, insert_at)
			}
		
			this.deleted_products(
				catalog_link,
				deleted.filter( item => item !== link ),
			)
		}

		@ $mol_action
		undo_last(event: KeyboardEvent) {
			const deleted = this.deleted_products(this.catalog_link())
			const link = deleted[deleted.length - 1]
			if (!link) return
			event.preventDefault()
			this.product_undo(link)
		}
	}
}
