namespace $.$$ {
	export class $bog_nka_button extends $.$bog_nka_button {
		
		hidden(next?: boolean) {
			return next ?? false
		}

		@ $mol_mem
		style() {
			return {
				...super.style(),
				display: this.hidden() ? 'none' : '',
			}
		}

	}
}
