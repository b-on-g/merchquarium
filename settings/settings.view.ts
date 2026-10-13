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
			return this.text_id() +  this.$.$giper_baza_auth.current().pass().lord().str
		}

		catalog() {
			const link = this.catalog_link()
			if (!link) return null
		
			const land = this.$.$giper_baza_glob.Land(
				new this.$.$giper_baza_link(link),
			)
			return land.Data($bog_nka_catalog)
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
		
		@ $mol_action
		category_remove(category: string) {
			if (this.category_products(category).length === 0) {
				this.catalog()?.Categories()?.cut(category)
			}
			
		}

		category_products(category: string) {
			return (this.catalog()?.Products()?.remote_list() ?? [])
				.filter(product => product.Category()?.val() === category)
		}



	}
}
