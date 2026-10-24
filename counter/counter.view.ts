namespace $.$$ {
	export class $bog_prilavok_counter extends $.$bog_prilavok_counter {

		content() {
			return this.enabled() ? [ this.Minus(), this.Value(), this.Plus() ] : [ this.Value() ]
		}

		value_text() {
			return this.enabled() ? String( this.value() ) : `× ${ this.value() }`
		}

		@ $mol_action
		dec() {
			this.value( Math.max( 0, this.value() - 1 ) )
		}

		@ $mol_action
		inc() {
			this.value( this.value() + 1 )
		}

	}
}
