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

		title_btn(next?: string): string {
			const title = this.product().Title()
		
			if (!title) return next ?? ''
			if (next === undefined) return title.val() ?? ''
		
			title.val(next)
			return next
		}

	}
}