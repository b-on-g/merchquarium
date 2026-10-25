namespace $.$$ {
	export class $bog_merchquarium_cart extends $.$bog_merchquarium_cart {

		catalog() {
			const link = this.catalog_link()
			if( !link ) return null
			return this.$.$giper_baza_glob.Land( new this.$.$giper_baza_link( link ) ).Data( $bog_merchquarium_catalog )
		}

		product( link: string ) {
			return this.$.$giper_baza_glob.Pawn( new this.$.$giper_baza_link( link ), $bog_merchquarium_product )
		}

		@ $mol_mem
		Photo() {
			return $bog_merchquarium_photo.make({ $: this.$ })
		}

		links() {
			return Object.keys( this.items() ).filter( link => this.items()[ link ] > 0 )
		}

		available( link: string ) {
			const product = this.product( link )
			return Boolean( product.Title()?.val() ) && $bog_merchquarium_product_status( product ) === 'available'
		}

		price( link: string ) {
			return this.product( link ).Price()?.val() ?? 0
		}

		count( link: string, next?: number ) {
			if( next === undefined ) return this.items()[ link ] ?? 0
			const items = { ... this.items() }
			if( next > 0 ) items[ link ] = next
			else delete items[ link ]
			this.items( items )
			return next
		}

		rows() {
			if( !this.links().length ) return [ this.Back(), this.Title(), this.Empty() ]
			return [
				this.Back(),
				this.Title(),
				this.Lines(),
				this.Summary(),
				... this.editable() ? [ this.Actions() ] : [],
				... this.copied() && this.social_kind() !== 'telegram' ? [ this.Send_hint() ] : [],
			]
		}

		heading() {
			return this.editable() ? this.Cart_title() : this.Order_title()
		}

		lines() {
			return this.links().map( link => this.Line( link ) )
		}

		thumb_style( link: string ) {
			const photo = this.product( link ).Photos()?.items()[ 0 ]
			const url = photo ? this.Photo().url( photo.str ) : ''
			return { backgroundImage: url ? `url("${ url }")` : 'none' }
		}

		line_title( link: string ) {
			const title = this.product( link ).Title()?.val() ?? ''
			return this.available( link ) ? title : `${ title } · ${ this.Unavailable() }`
		}

		line_price( link: string ) {
			return `${ this.price( link ).toLocaleString( 'ru-RU' ) } ₽`
		}

		line_sum( link: string ) {
			if( !this.available( link ) ) return ''
			return `${ ( this.price( link ) * this.count( link ) ).toLocaleString( 'ru-RU' ) } ₽`
		}

		ordered() {
			return this.links().filter( link => this.available( link ) )
		}

		total() {
			return this.ordered().reduce( ( sum, link )=> sum + this.price( link ) * this.count( link ), 0 )
		}

		total_text() {
			return this.Total_text().replace( '{total}', this.total().toLocaleString( 'ru-RU' ) )
		}

		social_url() {
			return $bog_merchquarium_social_url( this.catalog()?.Social()?.val() ?? '' )
		}

		social_kind() {
			const url = this.social_url()
			return url ? $bog_merchquarium_social_kind( url ) : null
		}

		social_name() {
			const url = this.social_url()
			return url ? $bog_merchquarium_social_name( url ) : ''
		}

		order_link() {
			const items = Object.fromEntries( this.ordered().map( link => [ link, this.count( link ) ] ) )
			return this.$.$mol_state_arg.make_link({
				catalog: this.catalog_link(),
				order: $bog_merchquarium_order_encode( this.catalog_link(), items ),
			})
		}

		message() {
			const ordered = this.ordered()
			return $bog_merchquarium_order_message( this.catalog()?.SocialText()?.val() || this.Order_message(), {
				titles: ordered.map( link => this.product( link ).Title()?.val() ?? '' ),
				count: ordered.reduce( ( sum, link )=> sum + this.count( link ), 0 ),
				total: this.total(),
				link: this.order_link(),
			} )
		}

		@ $mol_mem
		copied_message( next?: string ) {
			return next ?? ''
		}

		copied() {
			return this.copied_message() === this.message()
		}

		send_enabled() {
			return Boolean( this.social_url() ) && this.ordered().length > 0
		}

		send_title() {
			if( !this.social_url() ) return this.Social_missing()
			if( this.social_kind() === 'telegram' ) return this.Send_title()
			if( this.copied() ) return this.Copied_title().replace( '{social}', this.social_name() )
			return this.Copy_title()
		}

		copy( text: string ) {
			this.$.$mol_dom_context.navigator.clipboard?.writeText( text ).catch( ()=> {} )
			this.copied_message( text )
		}

		@ $mol_action
		send() {
			const url = this.social_url()
			if( !url || !this.send_enabled() ) return

			const text = this.message()
			const copied = this.copied()
			this.copy( text )

			if( this.social_kind() === 'telegram' ) url.search = `?text=${ encodeURIComponent( text ) }`
			else if( !copied ) return

			this.$.$mol_dom_context.open( url.toString(), '_blank' )
		}

		@ $mol_action
		clear() {
			this.items( {} )
		}

	}
}
