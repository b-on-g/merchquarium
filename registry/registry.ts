namespace $ {

	export class $bog_nka_registry extends $giper_baza_dict.with({
		Catalogs: $giper_baza_list_link,
	}) {

		static link = new $giper_baza_link( 'REGISTRY_LINK' )

		static land() {
			return this.$.$giper_baza_glob.Land( this.link )
		}

		static data() {
			return this.land().Data( this )
		}

		static links() {
			return this.data().Catalogs()?.items() ?? []
		}

		static has( catalog: $giper_baza_link ) {
			return this.links().some( link => link.str === catalog.str )
		}

		@ $mol_action
		static listed( catalog: $giper_baza_link, next: boolean ) {
			if( this.has( catalog ) === next ) return
			const list = this.data().Catalogs( 'auto' )!
			if( next ) list.add( catalog )
			else list.cut( catalog )
		}

	}

}
