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

	}
}