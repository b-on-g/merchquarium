namespace $.$$ {
	export class $bog_nka_app extends $.$bog_nka_app {

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
			this.settings_open( !this.settings_open() )
		}
		
		content() {
			if( this.settings_open() ) return [ this.Settings() ]
		
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

		title() {
			return this.catalog()?.Title()?.val()?.trim() || super.title()
		}

		@ $mol_mem
		style() {
			return {
				... super.style(),
				... $bog_nka_theme_style( this.catalog()?.Theme()?.val() ),
			}
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
				... this.filter_categories().length ? [ this.Category_filter() ] : [],
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
		
			return land.Data( $bog_nka_catalog )
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
		category_filter(next?: string) {
			const categories = this.filter_categories() ?? []
			const value = next ?? 'all'
		
			return value === 'all' || categories.includes(value)
				? value
				: 'all'
		}
		
		category_filter_options(): Record<string, string> {
			const options: Record<string, string> = {
				all: this.Filter_all(),
			}
		
			for (const category of this.filter_categories() ?? []) {
				options[category] = category
			}
		
			return options
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
			const catalog = this.catalog()
			const products = catalog?.Products()?.remote_list() ?? []
		
			const categories = this.is_admin()
				? catalog?.Categories()?.items() ?? []
				: products
					.filter(product => product.Available()?.val())
					.map(product => product.Category()?.val())
					.filter((category): category is string => Boolean(category))
		
			return [...new Set(categories)]
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
			const category = this.category_filter()
		
			for (const product of products) {
				const link = product.link().str
				if (!order.includes(link)) order.push(link)
			}
		
			const cards: $mol_view[] = []
		
			for (const link of order) {
				const product = by_link.get(link)
		
				if (product) {
					if (!product.can_change() && !product.Available()?.val()) continue
					if (category !== 'all' && product.Category()?.val() !== category) continue
		
					cards.push(this.Product_card(link))
					continue
				}
		
				if (!this.is_admin() || !deleted.has(link)) continue
		
				const removed = this.$.$giper_baza_glob.Pawn(
					new this.$.$giper_baza_link(link),
					$bog_nka_product,
				)
		
				if (category !== 'all' && removed.Category()?.val() !== category) continue
		
				cards.push(this.Product_undo(link))
			}
		
			return cards
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
