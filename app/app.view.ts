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

		product_cards() {
			const category = this.category_filter()
			const products = this.catalog()?.Products()?.remote_list() ?? []
		
			return products
				.filter(product => product.can_change() || product.Available()?.val())
				.filter(product =>
					category === 'all' || product.Category()?.val() === category,
				)
				.map(product => this.Product_card(product.link().str))
		}
		
		product_link( link: string ) {
			return link
		}

		@ $mol_mem
		category_filter(next?: string) {
			const categories = this.catalog()?.Categories()?.items() ?? []
			const value = next ?? 'all'
		
			return value === 'all' || categories.includes(value)
				? value
				: 'all'
		}
		
		category_filter_options(): Record<string, string> {
			const options: Record<string, string> = {
				all: this.Filter_all(),
			}
		
			for (const category of this.catalog()?.Categories()?.items() ?? []) {
				options[category] = category
			}
		
			return options
		}

		is_admin() {
			return !this.catalog()?.can_change()
		}


	}
}
