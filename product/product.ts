namespace $ {
	export class $bog_merchquarium_product extends $giper_baza_dict.with({
		Title: $giper_baza_atom_text,
		Price: $giper_baza_atom_real,
		Description: $giper_baza_atom_text,
		Photos: $giper_baza_list_link.to( ()=> $giper_baza_file ),
		Category: $giper_baza_atom_text,
		Fandoms: $giper_baza_list_str,
		Available: $giper_baza_atom_bool,
		Status: $giper_baza_atom_text,
	}) {}

	export type $bog_merchquarium_product_status = 'available' | 'sold' | 'hidden'

	export function $bog_merchquarium_product_status( product: $bog_merchquarium_product, next?: $bog_merchquarium_product_status ): $bog_merchquarium_product_status {
		if( next === undefined ) {
			const status = product.Status()?.val()
			if( status === 'available' || status === 'sold' || status === 'hidden' ) return status
			return product.Available()?.val() ? 'available' : 'hidden'
		}
		product.Status( 'auto' )!.val( next )
		product.Available( 'auto' )!.val( next === 'available' )
		return next
	}
}
