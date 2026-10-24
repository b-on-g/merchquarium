namespace $.$$ {
	export class $bog_prilavok_button extends $.$bog_prilavok_button {
		
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
