namespace $ {
	export class $bog_prilavok_catalog extends $giper_baza_dict.with({
		Products: $giper_baza_list_link.to( ()=> $bog_prilavok_product ),
		Categories: $giper_baza_list_str,
		Fandoms: $giper_baza_list_str,
		Social: $giper_baza_atom_text,
		SocialText: $giper_baza_atom_text,
		Links: $giper_baza_list_str,
		Title: $giper_baza_atom_text,
		Theme: $giper_baza_atom_text,
		Hidden: $giper_baza_atom_bool,
		Avatar: $giper_baza_list_link.to( ()=> $giper_baza_file ),
		Cover: $giper_baza_list_link.to( ()=> $giper_baza_file ),
		Back: $giper_baza_list_link.to( ()=> $giper_baza_file ),
	}) {}

	export type $bog_prilavok_catalog_image = 'Avatar' | 'Cover' | 'Back'

	export function $bog_prilavok_catalog_image( catalog: $bog_prilavok_catalog, key: $bog_prilavok_catalog_image ) {
		return catalog[ key ]()?.items().at( -1 )?.str ?? ''
	}

}
