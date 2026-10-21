namespace $.$$ {
	
	$mol_style_define($bog_nka_app, {
		background: {
			image: $mol_style_func.vary( '--bog_nka_pattern' ),
			size: [ $mol_style_func.vary( '--bog_nka_pattern_size' ) ],
		},
		Catalog_missing: {
			flexDirection: 'column',
			display: 'block'
		},
		Catalog_create: {
			gap: $mol_gap.block,
			marginTop: '1rem'
		},
		Title: {
			font: {
				weight: 'bold',
			},
		},
		Category_filter: {
			flexWrap: 'nowrap',
			overflow: {
				x: 'auto',
			},
			scrollbarWidth: 'none',
			padding: {
				left: $mol_gap.block,
				right: $mol_gap.block,
			},
		},
		Catalog_empty: {
			justifyContent: 'center',
			textAlign: 'center',
			color: $mol_theme.shade,
			padding: {
				top: '4rem',
				bottom: '4rem',
			},
		},
		Product_undo: {
			justifyContent: 'center',
			alignSelf: 'center',
		},
		
	})

}
