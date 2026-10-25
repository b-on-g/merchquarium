namespace $.$$ {
	export class $bog_merchquarium_button extends $.$bog_merchquarium_button {
		
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
