namespace $.$$ {
	export class $bog_nka_settings extends $.$bog_nka_settings {

		@ $mol_mem
		settings_open( next?: boolean ) {
			return next ?? false
		}

		@ $mol_action
		settings_toggle() {
			this.settings_open( !this.settings_open() )
		}

		account_id() {
			return this.$.$giper_baza_auth.current().pass().toString()
		}

		account_lord() {
			return this.$.$giper_baza_auth.current().pass().lord().str
		}

		catalog() {
			const land = this.catalog_land()
			return land?.Data($bog_nka_catalog) ?? null
		}

		catalog_land() {
			const link = this.catalog_link()
			if (!link) return null
			return this.$.$giper_baza_glob.Land(
				new this.$.$giper_baza_link(link),
			)
		}

		@ $mol_mem
		debug_rank() {
			const land = this.catalog_land()
			if (!land) return '-'
			const rank = land.lord_rank(land.auth().pass().lord())
			return $giper_baza_rank_tier[ $giper_baza_rank_tier_of(rank) ]
		}

		@ $mol_mem
		products_total() {
			return this.catalog()?.Products()?.remote_list().length ?? 0
		}

		@ $mol_mem
		products_available() {
			return (this.catalog()?.Products()?.remote_list() ?? [])
				.filter(product => product.Available()?.val())
				.length
		}

		debug_info() {
			return `Rank: ${ this.debug_rank() }; Products: ${ this.products_total() } (${ this.products_available() } available)`
		}
		
		categories_text() {
			return this.catalog()?.Categories()?.items().join(', ') ?? ''
		}


		@ $mol_mem
		category_draft(next?: string) {
			return next ?? ''
		}
		
		@ $mol_action
		category_add() {
			const name = this.category_draft().trim()
			if (!name) return
		
			const categories = this.catalog()?.Categories(null)
			if (!categories) return
		
			categories.add(name)
			this.category_draft('')
		}

		category_rows() {
			const categories = this.catalog()?.Categories()?.items() ?? []
			return categories.map(category => this.Category_row(category))
		}
		
		category_title(category: string) {
			return category
		}
		
		category_products(category: string) {
			return (this.catalog()?.Products()?.remote_list() ?? [])
				.filter(product => product.Category()?.val() === category)
		}
		
		
		category_product_count(category: string) {
			return String(this.category_products(category).length)
		}
		
		@ $mol_action
		category_remove(category: string) {
			if (this.category_products(category).length === 0) {
				this.catalog()?.Categories()?.cut(category)
				return
			}
		
			this.Category_remove(category).showed(true)
		}
		
		@ $mol_action
		category_remove_cancel(category: string) {
			this.Category_remove(category).showed(false)
		}
		
		@ $mol_action
		category_remove_confirm(category: string) {
			this.Category_remove(category).showed(false)
		
			for (const product of this.category_products(category)) {
				product.Category(null)?.val('')
			}
		
			this.catalog()?.Categories()?.cut(category)
		}


		social_link(next?: string): string {
			const catalog = this.catalog()
			if (!catalog) return ''
		
			if (next === undefined) {
				return catalog.Social()?.val() ?? ''
			}
		
			const atom = catalog.Social(null)
			if (!atom) return ''
		
			atom.val(next)
			return next
		}
		
		social_text(next?: string): string {
			const catalog = this.catalog()
			if (!catalog) return ''
		
			if (next === undefined) {
				return catalog.SocialText()?.val() ?? ''
			}
		
			const atom = catalog.SocialText(null)
			if (!atom) return ''
		
			atom.val(next)
			return next
		}


	}
}
