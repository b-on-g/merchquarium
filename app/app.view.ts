namespace $.$$ {
	export class $bog_nka_app extends $.$bog_nka_app {

		catalog_link( next?: string ) {
			return this.$.$mol_state_arg.value( 'catalog', next ) ?? ''
		}

		content() {
			return this.catalog_link()
				? [ this.Catalog_selected() ]
				: [ this.Catalog_missing() ]
		}

		catalog_selected_text() {
			return `Catalog: ${ this.catalog_link() }`
		}

		@ $mol_action
		catalog_create() {
			const land = this.$.$giper_baza_glob.land_grab()
			land.Data( $bog_nka_catalog )
			this.catalog_link( land.link().str )
		}

	}
}