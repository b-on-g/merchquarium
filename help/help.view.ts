namespace $.$$ {
	export class $bog_merchquarium_help extends $.$bog_merchquarium_help {

		sections() {
			return {
				about: [ this.about_title(), this.about_text(), this.Icon_about() ],
				look: [ this.look_title(), this.look_text(), this.Icon_look() ],
				products: [ this.products_title(), this.products_text(), this.Icon_products() ],
				tags: [ this.tags_title(), this.tags_text(), this.Icon_tags() ],
				import: [ this.import_title(), this.import_text(), this.Icon_import() ],
				preview: [ this.preview_title(), this.preview_text(), this.Icon_preview() ],
				share: [ this.share_title(), this.share_text(), this.Icon_share() ],
				access: [ this.access_title(), this.access_text(), this.Icon_access() ],
			} as Record< string, [ string, string, $mol_icon ] >
		}

		section_title( key: string ) {
			return this.sections()[ key ][ 0 ]
		}

		section_text( key: string ) {
			return this.sections()[ key ][ 1 ]
		}

		icon( key: string ) {
			return this.sections()[ key ][ 2 ]
		}

	}
}
