namespace $ {

	export class $bog_merchquarium_home extends $giper_baza_dict.with({
		Catalogs: $giper_baza_list_str,
	}) {}

	/** Own catalogs of current account */
	export function $bog_merchquarium_home_of( this: $, auto?: 'auto' ) {
		return this.$giper_baza_glob.Land( this.$giper_baza_auth.current().pass().lord() )
			.Data( $giper_baza_dict )
			.dive( 'bog_merchquarium', $bog_merchquarium_home, auto )
	}

	export function $bog_merchquarium_home_links( this: $ ) {
		return [ ... new Set( ( this.$bog_merchquarium_home_of()?.Catalogs()?.items() ?? [] ).map( String ) ) ]
	}

}
