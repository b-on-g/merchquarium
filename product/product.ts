namespace $ {
	export class $bog_nka_product extends $giper_baza_dict.with({
		Title: $giper_baza_atom_text,
		Price: $giper_baza_atom_real,
		Description: $giper_baza_atom_text,
		Photos: $giper_baza_list_link.to( ()=> $giper_baza_file ),
		Category: $giper_baza_atom_text,
		Fandoms: $giper_baza_list_str,
		Available: $giper_baza_atom_bool,
	}) {}
}
