namespace $.$$ {
	export class $bog_merchquarium_settings extends $.$bog_merchquarium_settings {

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
			return land?.Data($bog_merchquarium_catalog) ?? null
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
			return this.catalog_land()?.Data($bog_merchquarium_catalog).can_change() ?? false
		}

		body() {
			if (this.is_admin()) return super.body()
			return [ this.Account_section(), this.Categories_section(), this.Fandoms_section() ]
		}

		products() {
			return this.catalog()?.Products()?.remote_list() ?? []
		}

		category_items() {
			return this.catalog()?.Categories()?.items() ?? []
		}

		category_products(category: string) {
			return this.products().filter(product => product.Category()?.val() === category)
		}

		category_usage(category: string) {
			return this.category_products(category).length
		}

		@ $mol_action
		category_add(category: string) {
			const list = this.catalog()?.Categories(null)
			if (list && !list.has(category)) list.items([ ... list.items(), category ])
		}

		@ $mol_action
		category_drop(category: string) {
			for (const product of this.category_products(category)) {
				product.Category(null)?.val('')
			}
			this.catalog()?.Categories()?.cut(category)
		}

		fandom_items() {
			return this.catalog()?.Fandoms()?.items() ?? []
		}

		fandom_products(fandom: string) {
			return this.products().filter(product => product.Fandoms()?.items().includes(fandom))
		}

		fandom_usage(fandom: string) {
			return this.fandom_products(fandom).length
		}

		@ $mol_action
		fandom_add(name: string) {
			const fandom = $bog_merchquarium_catalog_fandom(name)
			if (!fandom) return
			const list = this.catalog()?.Fandoms(null)
			if (list && !list.has(fandom)) list.items([ ... list.items(), fandom ])
		}

		@ $mol_action
		fandom_drop(fandom: string) {
			for (const product of this.fandom_products(fandom)) {
				product.Fandoms(null)?.cut(fandom)
			}
			this.catalog()?.Fandoms()?.cut(fandom)
		}

		link_items() {
			return this.catalog()?.Links()?.items() ?? []
		}

		@ $mol_action
		link_add(link: string) {
			const list = this.catalog()?.Links(null)
			if (list && !list.has(link)) list.items([ ... list.items(), link ])
		}

		@ $mol_action
		link_drop(link: string) {
			this.catalog()?.Links()?.cut(link)
		}

		@ $mol_mem
		Photo() {
			return $bog_merchquarium_photo.make({ $: this.$ })
		}

		image_title(key: $bog_merchquarium_catalog_image) {
			return {
				Avatar: this.Image_avatar(),
				Cover: this.Image_cover(),
				Back: this.Image_back(),
			}[key]
		}

		image_link(key: $bog_merchquarium_catalog_image) {
			const catalog = this.catalog()
			return catalog ? $bog_merchquarium_catalog_image(catalog, key) : ''
		}

		image_filled(key: $bog_merchquarium_catalog_image) {
			return Boolean(this.image_link(key))
		}

		image_style(key: $bog_merchquarium_catalog_image) {
			const link = this.image_link(key)
			const url = link ? this.Photo().url(link) : ''
			return {
				backgroundImage: url ? `url("${ url }")` : 'none',
				... key === 'Avatar' ? { borderRadius: '50%' } : {},
			}
		}

		image_add(key: $bog_merchquarium_catalog_image, next?: readonly File[]) {
			if (next?.length && this.is_admin()) $mol_wire_async(this).image_save(key, next[0])
			return [] as readonly File[]
		}

		@ $mol_action
		async image_save(key: $bog_merchquarium_catalog_image, file: File) {
			const list = this.catalog()![key](null)!
			const old = list.items()
			await this.Photo().save([ file ], list)
			for (const link of old) list.cut(link)
		}

		@ $mol_action
		image_drop(key: $bog_merchquarium_catalog_image) {
			const list = this.catalog()?.[key]()
			for (const link of list?.items() ?? []) list!.cut(link)
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
				.filter(product => $bog_merchquarium_product_status(product) === 'available')
				.length
		}

		debug_info() {
			return `Rank: ${ this.debug_rank() }; Products: ${ this.products_total() } (${ this.products_available() } available)`
		}
		
		catalog_title(next?: string): string {
			const catalog = this.catalog()
			if (!catalog) return ''
			if (next === undefined) return catalog.Title()?.val() ?? ''
			catalog.Title(null)?.val(next)
			return next
		}

		theme_names(): Record<$bog_merchquarium_theme_name, string> {
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

		theme_name(name: $bog_merchquarium_theme_name) {
			return this.theme_names()[name]
		}

		theme_swatch(name: string) {
			const ring = this.theme() === name
				? '0 0 0 3px var(--mol_theme_current)'
				: '0 0 0 1px var(--mol_theme_line)'
			return { ... $bog_merchquarium_theme_swatch(name), boxShadow: ring }
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

		listed(next?: boolean): boolean {
			const catalog = this.catalog()
			if (!catalog) return true
			if (next === undefined) return !catalog.Hidden()?.val()
			catalog.Hidden(null)?.val(!next)
			return next
		}

		import_prompt() {
			return $bog_merchquarium_import_prompt
		}

		@ $mol_mem
		import_json(next?: string) {
			return next ?? ''
		}

		@ $mol_mem
		import_data() {
			return $bog_merchquarium_import_parse(this.import_json())
		}

		import_new_categories() {
			const known = new Set(this.catalog()?.Categories()?.items() ?? [])
			return this.import_data().categories.filter(category => !known.has(category))
		}

		import_new_fandoms() {
			const known = new Set(this.catalog()?.Fandoms()?.items() ?? [])
			return this.import_data().fandoms.filter(fandom => !known.has(fandom))
		}

		import_new_links() {
			return $bog_merchquarium_import_new_links(this.catalog(), this.import_data())
		}

		import_preview() {
			const data = this.import_data()
			if (!this.import_json().trim()) return ''
			const summary = this.Import_summary()
				.replace('{products}', String(data.products.length))
				.replace('{categories}', String(this.import_new_categories().length))
				.replace('{fandoms}', String(this.import_new_fandoms().length))
				.replace('{links}', String(this.import_new_links().length))
			if (!data.errors.length) return summary
			return summary + '. ' + this.Import_errors().replace('{errors}', data.errors.join('; '))
		}

		import_ready() {
			return this.import_data().products.length > 0
				|| this.import_new_categories().length > 0
				|| this.import_new_fandoms().length > 0
				|| this.import_new_links().length > 0
		}

		@ $mol_action
		import_run() {
			const catalog = this.catalog()
			if (!catalog || !this.import_ready()) return
			$bog_merchquarium_import_apply(catalog, this.import_data())
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
