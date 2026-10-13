namespace $.$$ {
	export class $bog_nka_button extends $.$bog_nka_button {

		hidden(next?: boolean) {
			return next ?? false
		}

		attr() {
			return {
				...super.attr(),
				hidden: this.hidden(),
			}
		}
	}
}