namespace $.$$ {
	export class $bog_nka_app extends $.$bog_nka_app {

		catalog_link() {
			return this.$.$mol_state_arg.value( 'catalog' ) ?? ''
		}

		content() {
			return this.catalog_link()
				? [ this.Catalog_selected() ]
				: [ this.Catalog_missing() ]
		}

		catalog_selected_text() {
			return `Catalog: ${ this.catalog_link() }`
		}

	}
}