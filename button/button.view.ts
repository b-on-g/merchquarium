namespace $.$$ {
	export class $bog_nka_button extends $.$bog_nka_button {

		hidden(next?: boolean) {
			return next ?? false
		}

		style() {
			return {
				...super.style(),
				display: this.hidden() ? 'none' : '',
			}
		}

	}
}