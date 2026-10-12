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
		
			const descr = product.Description(null)
			if (!descr) return ''
			
			descr.val(next)
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

		catalog() {
			const link = this.catalog_link()
			if (!link) return null
		
			const land = this.$.$giper_baza_glob.Land(
				new this.$.$giper_baza_link(link),
			)
		
			return land.Data($bog_nka_catalog)
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


	}
}