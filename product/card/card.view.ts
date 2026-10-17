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

		photos_add(next?: readonly File[]) {
			if (!next?.length || !this.changed()) return [] as readonly File[]
			$mol_wire_async(this).photos_save(next)
			return [] as readonly File[]
		}

		@ $mol_action
		async photos_save(files: readonly File[]) {
			const prepared = await Promise.all(files.map(async file => {
				const picture = this.photo_picture(file)
				if (!picture) return null
				const blob = await picture.format('image/webp', .82) as unknown as Blob | null
				if (!blob) return null

				const buffer = new Uint8Array(await blob.arrayBuffer())
				const output_extension = blob.type === 'image/webp' ? 'webp' : blob.type === 'image/jpeg' ? 'jpg' : 'png'
				return { file, blob, buffer, output_extension }
			}))

			const photos = this.product().Photos('auto')!
			prepared.forEach(item => {
				if (!item) return

				const { file, blob, buffer, output_extension } = item
				const photo = photos.make(null)
				photo.buffer(buffer)
				photo.type(blob.type || 'image/png')
				photo.name(`${file.name.replace(/\.[^/.]+$/, '')}.${output_extension}`)
			})
		}

		@ $mol_mem
		photo_source(file?: File): Blob {
			if (!file) return new Blob()
			const extension = file.name.split('.').pop()?.toLowerCase()
			const detected_type = file.type.toLowerCase()
			const type = detected_type.startsWith('image/')
				? detected_type
				: extension === 'jpg' || extension === 'jpeg'
					? 'image/jpeg'
					: extension === 'png'
						? 'image/png'
						: extension === 'webp'
							? 'image/webp'
							: detected_type
			return new Blob([file], { type })
		}

		@ $mol_mem
		photo_picture(file?: File) {
			if (!file) return null
			return $mol_picture.fit(this.photo_source(file), 1600)
		}

		photo_ids() {
			return this.product().Photos()?.remote_list().map(photo => photo.link().str) ?? []
		}

		photo_url(link: string) {
			const file = this.$.$giper_baza_glob.Pawn(
				new this.$.$giper_baza_link(link),
				$giper_baza_file,
			)
			const master = this.$.$giper_baza_glob.yard().master_current()
			return master ? master.replace(/\/$/, '') + file.uri() : file.uri()
		}

		photo_delete_enabled() {
			return this.changed() && this.photo_ids().length > 0
		}

		@ $mol_action
		photo_delete() {
			if (!this.changed()) return

			const ids = this.photo_ids()
			if (!ids.length) return

			const index = this.Photos().selected_index()
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

		
		buy_title() {
			return this.catalog()?.Social()?.val()?.trim()
				? this.Buy_title()
				: this.Social_missing_title()
		}
		
		buy_enabled() {
			return this.available() && this.social_url() !== null
		}
		
		@ $mol_action
		buy() {
			if (!this.buy_enabled()) return
		
			const catalog = this.catalog()
			const url = this.social_url()
			if (!catalog || !url) return
		
			const host = url.hostname.replace(/^www\./, '')
		
			if (host === 't.me' || host === 'telegram.me') {
				const template = catalog.SocialText()?.val()
					|| 'Добрый день, хотел бы приобрести {title}'
				const message = template.replace(/\{title\}/g, this.title())
				url.searchParams.set('text', message)
			}
		
			window.open(url.toString(), '_blank')
		}

		social_url(): URL | null {
			const value = this.catalog()?.Social()?.val()?.trim() ?? ''
			if (!value) return null
		
			try {
				const url = new URL(value)
				if (url.protocol !== 'https:' && url.protocol !== 'http:') return null
				return url
			} catch {
				return null
			}
		}

		@ $mol_mem
		Available() {
			return this.changed() ? super.Available() : null!
		}
		
		@ $mol_mem
		Delete() {
			return this.changed() ? super.Delete() : null!
		}





	}
}
