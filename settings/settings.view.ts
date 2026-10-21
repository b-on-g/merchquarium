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
		is_admin() {
			return this.catalog_land()?.Data($bog_nka_catalog).can_change() ?? false
		}

		body() {
			if (this.is_admin()) return super.body()
			return [ this.Account_section(), this.Categories_section() ]
		}

		categories_content() {
			if (this.is_admin()) return super.categories_content()
			return [ this.Categories_list() ]
		}

		@ $mol_mem_key
		Category_remove(category: string) {
			return this.is_admin() ? super.Category_remove(category) : null!
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


		catalog_title(next?: string): string {
			const catalog = this.catalog()
			if (!catalog) return ''
			if (next === undefined) return catalog.Title()?.val() ?? ''
			catalog.Title(null)?.val(next)
			return next
		}

		theme_names(): Record<$bog_nka_theme_name, string> {
			return {
				sakura: this.Theme_sakura(),
				lavender: this.Theme_lavender(),
				mint: this.Theme_mint(),
				peach: this.Theme_peach(),
				sky: this.Theme_sky(),
				milk: this.Theme_milk(),
				classic: this.Theme_classic(),
			}
		}

		theme_options() {
			return Object.keys(this.theme_names()).map(name => this.Theme_option(name))
		}

		theme_name(name: $bog_nka_theme_name) {
			return this.theme_names()[name]
		}

		theme_swatch(name: string) {
			const ring = this.theme() === name
				? '0 0 0 3px var(--mol_theme_current)'
				: '0 0 0 1px var(--mol_theme_line)'
			return { ... $bog_nka_theme_swatch(name), boxShadow: ring }
		}

		@ $mol_action
		theme_select(name: string) {
			this.theme(name)
		}

		theme(next?: string): string {
			const catalog = this.catalog()
			if (!catalog) return 'sakura'
			if (next === undefined) return catalog.Theme()?.val() || 'sakura'
			catalog.Theme(null)?.val(next)
			return next
		}

		import_prompt() {
			return $bog_nka_import_prompt
		}

		@ $mol_mem
		import_json(next?: string) {
			return next ?? ''
		}

		@ $mol_mem
		import_data() {
			return $bog_nka_import_parse(this.import_json())
		}

		import_new_categories() {
			const known = new Set(this.catalog()?.Categories()?.items() ?? [])
			return this.import_data().categories.filter(category => !known.has(category))
		}

		import_preview() {
			const data = this.import_data()
			if (!this.import_json().trim()) return ''
			const summary = this.Import_summary()
				.replace('{products}', String(data.products.length))
				.replace('{categories}', String(this.import_new_categories().length))
			if (!data.errors.length) return summary
			return summary + '. ' + this.Import_errors().replace('{errors}', data.errors.join('; '))
		}

		import_ready() {
			return this.import_data().products.length > 0
		}

		@ $mol_action
		import_run() {
			const catalog = this.catalog()
			if (!catalog || !this.import_ready()) return
			$bog_nka_import_apply(catalog, this.import_data())
			this.import_json('')
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
