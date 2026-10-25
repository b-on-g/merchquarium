namespace $.$$ {
	export class $bog_merchquarium_product_card extends $.$bog_merchquarium_product_card {

		product() {
			return this.$.$giper_baza_glob.Pawn(
				new this.$.$giper_baza_link( this.product_link() ),
				$bog_merchquarium_product,
			)
		}
		
		changed(): boolean {
			return this.product().can_change()
		}

		@ $mol_mem
		Photo() {
			return $bog_merchquarium_photo.make({ $: this.$ })
		}

		photos_add(next?: readonly File[]) {
			if (!next?.length || !this.changed()) return [] as readonly File[]
			$mol_wire_async(this).photos_save(next)
			return [] as readonly File[]
		}

		@ $mol_action
		async photos_save(files: readonly File[]) {
			await this.Photo().save(files, this.product().Photos('auto')!)
		}

		photo_ids() {
			return this.product().Photos()?.remote_list().map(photo => photo.link().str) ?? []
		}

		photo_url(link: string) {
			return this.Photo().url(link)
		}

		photo_delete_enabled() {
			return this.changed() && this.photo_ids().length > 0
		}

		@ $mol_action
		photo_delete() {
			if (!this.changed()) return

			const ids = this.photo_ids()
			if (!ids.length) return

			const index = this.Photos().index()
			const link = ids[index]
			if (!link) return

			this.product().Photos('auto')?.cut( new this.$.$giper_baza_link(link) )
		}

		title(next?: string): string {
			const product = this.product()
		
			if (next === undefined) return product.Title()?.val() ?? ''
		
			const title = product.Title(null)
			if (!title) return ''
			
			title.val(next)
			return next
		}

		price(next?: number): number {
			const product = this.product()
		
			if (next === undefined) return product.Price()?.val() ?? 0
		
			const price = product.Price(null)
			if (!price) return 0
		
			price.val(next)
			return next
		}

		description(next?: string): string {
			const product = this.product()
		
			if (next === undefined) return product.Description()?.val() ?? ''
		
			const descr = product.Description(null)
			if (!descr) return ''
			
			descr.val(next)
			return next
		}

		status(next?: string): $bog_merchquarium_product_status {
			const product = this.product()
			if (next === 'available' || next === 'sold' || next === 'hidden') return $bog_merchquarium_product_status(product, next)
			return $bog_merchquarium_product_status(product)
		}

		sold() {
			return this.status() === 'sold'
		}

		catalog() {
			const link = this.catalog_link()
			if (!link) return null
		
			const land = this.$.$giper_baza_glob.Land(
				new this.$.$giper_baza_link(link),
			)
		
			return land.Data($bog_merchquarium_catalog)
		}
		
		category_list() {
			return this.catalog()?.Categories()?.items() ?? []
		}

		category(next?: string | null): string | null {
			const product = this.product()
		
			if (next === undefined || next === null) {
				return product.Category()?.val() ?? null
			}
		
			const atom = product.Category(null)
			if (!atom) return null
		
			atom.val(next)
			return next
		}

		
		cart_controls() {
			if( this.sold() ) return [ this.Want() ]
			return [ this.cart_count() > 0 ? this.Cart_counter() : this.Cart_add() ]
		}

		cart_enabled() {
			return this.status() === 'available' && Boolean( this.title() )
		}

		social_url() {
			return $bog_merchquarium_social_url( this.catalog()?.Social()?.val() ?? '' )
		}

		want_enabled() {
			return Boolean( this.social_url() )
		}

		want_message() {
			return this.Want_message()
				.replace( '{title}', this.title() )
				.replace( '{link}', this.$.$mol_state_arg.make_link({ catalog: this.catalog_link() }) )
		}

		@ $mol_mem
		want_copied( next?: boolean ) {
			return next ?? false
		}

		want_title() {
			const url = this.social_url()
			if( !url || !this.want_copied() ) return this.Want_title()
			return this.Want_copied_title().replace( '{social}', $bog_merchquarium_social_name( url ) )
		}

		@ $mol_action
		want() {
			const url = this.social_url()
			if( !url ) return

			const text = this.want_message()
			if( $bog_merchquarium_social_kind( url ) === 'telegram' ) {
				url.search = `?text=${ encodeURIComponent( text ) }`
			} else if( !this.want_copied() ) {
				this.$.$mol_dom_context.navigator.clipboard?.writeText( text ).catch( ()=> {} )
				this.want_copied( true )
				return
			}

			this.$.$mol_dom_context.open( url.toString(), '_blank' )
		}

		@ $mol_action
		cart_add() {
			if( this.cart_enabled() ) this.cart_count( 1 )
		}

		cover() {
			return [
				this.photo_ids().length ? this.Photos() : this.Photo_empty(),
				... this.sold() ? [ this.Sold_badge() ] : [],
			]
		}

		info_rows() {
			if( this.changed() ) return [ this.Title(), this.Price(), this.Description(), this.Category(), this.Fandoms() ]
			return [
				this.Title(),
				... this.price() ? [ this.Price_text() ] : [],
				... this.description() ? [ this.Description_text() ] : [],
				... this.tag_list().length ? [ this.Tags() ] : [],
			]
		}

		price_text() {
			return `${ this.price().toLocaleString( 'ru-RU' ) } ₽`
		}

		fandom_dictionary() {
			const fandoms = this.catalog()?.Fandoms()?.items() ?? []
			return Object.fromEntries(fandoms.map(fandom => [ fandom, fandom ]))
		}

		fandoms(next?: readonly string[]): readonly string[] {
			const product = this.product()
			if (next === undefined) return product.Fandoms()?.items() ?? []
			product.Fandoms(null)?.items(next)
			return next
		}

		tag_list() {
			return [ this.category() ?? '', ... this.fandoms() ].filter(Boolean)
		}

		tags() {
			return this.tag_list().map(tag => this.Tag(tag))
		}

		tag_title(tag: string) {
			return `#${ tag }`
		}

		@ $mol_action
		tag_select(tag: string) {
			this.search(tag)
		}

		@ $mol_mem
		Admin() {
			return this.changed() ? super.Admin() : null!
		}

	}
}
