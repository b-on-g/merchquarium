namespace $.$$ {
	export class $bog_merchquarium_start extends $.$bog_merchquarium_start {

		card_rows() {
			return super.card_rows().filter( row => row !== this.Own() || this.catalogs().length > 0 )
		}

		own_rows() {
			return this.catalogs().map( link => this.Own_link( link ) )
		}

		own_arg( link: string ) {
			return { catalog: link }
		}

		own_title( link: string ) {
			const land = this.$.$giper_baza_glob.Land( new this.$.$giper_baza_link( link ) )
			return land.Data( $bog_merchquarium_catalog ).Title()?.val()?.trim() || link
		}

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
