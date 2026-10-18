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

		@ $mol_mem
		grant_draft(next?: string) {
			return next ?? ''
		}

		@ $mol_action
		async grant( id: unknown = this.grant_draft() ) {
			const raw = typeof id === 'string' ? id : this.grant_draft()
			const id_str = raw.trim()

			const land = this.catalog_land()
			console.log('[grant] click', {
				id: id_str,
				catalog_link: this.catalog_link(),
				land: land?.link().str,
			})
			if (!land || !id_str) return

			let pass: $giper_baza_auth_pass | null = null
			try {
				const candidate = $giper_baza_auth_pass.from(id_str)
				console.log('[grant] parsed pass', id_str.length, {
					bytes: candidate.byteLength,
					first_byte: candidate.uint8(0),
					lord: candidate.lord().str,
				})
				if (candidate.uint8(0) === 0xFF) pass = candidate
			} catch (e) {
				console.warn('[grant] cannot parse account id', id_str, String(e))
				pass = null
			}

			if (!pass) {
				console.warn('[grant] invalid account id, abort', id_str)
				return
			}

			try {
				land.give(pass, $giper_baza_rank_rule)
				console.log('[grant] gave', {
					pass_lord: pass.lord().str,
					their_rank: land.lord_rank(pass.lord()),
				})
			} catch (e) {
				console.warn('[grant] give failed', String(e))
				return
			}

			this.grant_draft('')
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
