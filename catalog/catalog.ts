namespace $ {
	export class $bog_nka_catalog extends $giper_baza_dict.with({
		Products: $giper_baza_list_link.to( ()=> $bog_nka_product ),
		Categories: $giper_baza_list_str,
		Social: $giper_baza_atom_text,
		SocialText: $giper_baza_atom_text,
		Title: $giper_baza_atom_text,
		Theme: $giper_baza_atom_text,
	}) {}
}