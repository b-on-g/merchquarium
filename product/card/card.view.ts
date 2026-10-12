namespace $.$$ {
	export class $bog_nka_product_card extends $.$bog_nka_product_card {

		product() {
			return this.$.$giper_baza_glob.Pawn(
				new this.$.$giper_baza_link( this.product_link() ),
				$bog_nka_product,
			)
		}
		
		changed(): boolean {
			return this.product().can_change()
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
		
			const title = product.Description(null)
			if (!title) return ''
			
			title.val(next)
			return next
		}

		available(next?: boolean): boolean {
			const product = this.product()
		
			if (next === undefined) return product.Available()?.val() ?? false
		
			const atom = product.Available(null)
			if (!atom) return false
		
			atom.val(next)
			return next
		}


	}
}