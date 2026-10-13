namespace $.$$ {
	export class $bog_nka_button extends $.$bog_nka_button {

		hidden(next?: boolean) {
			return next ?? false
		}

		style() {
			const style = super.style()
			return this.hidden()
				? { ...style, display: 'none' }
				: style
		}

	}
}