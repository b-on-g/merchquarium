namespace $.$$ {
	export class $bog_merchquarium_start extends $.$bog_merchquarium_start {

		points() {
			return {
				cards: [ this.cards_text(), this.Icon_cards() ],
				orders: [ this.orders_text(), this.Icon_orders() ],
				search: [ this.search_text(), this.Icon_search() ],
			} as Record< string, [ string, $mol_icon ] >
		}

		point_text( key: string ) {
			return this.points()[ key ][ 0 ]
		}

		point_icon( key: string ) {
			return this.points()[ key ][ 1 ]
		}

	}
}
