namespace $.$$ {
	export class $bog_nka_app extends $.$bog_nka_app {

		catalog_link( next?: string ) {
			return this.$.$mol_state_arg.value( 'catalog', next ) ?? ''
		}

		@ $mol_mem
		settings_open( next?: boolean ) {
			return next ?? false
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