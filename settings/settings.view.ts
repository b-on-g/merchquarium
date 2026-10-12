namespace $.$$ {
	export class $bog_nka_settings extends $.$bog_nka_settings {

		@ $mol_mem
		settings_open( next?: boolean ) {
			return next ?? false
		}

		@ $mol_action
		settings_toggle() {
			this.settings_open( !this.settings_open() )
		}

		account_id() {
			return this.text_id() +  this.$.$giper_baza_auth.current().pass().lord().str
		}

		catalog() {
			const link = this.catalog_link()
			if (!link) return null
		
			const land = this.$.$giper_baza_glob.Land(
				new this.$.$giper_baza_link(link),
			)
			return land.Data($bog_nka_catalog)
		}
		
		categories_text() {
			return this.catalog()?.Categories()?.items().join(', ') ?? ''
		}




	}
}