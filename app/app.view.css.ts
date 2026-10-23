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
		Hero: {
			flex: { wrap: 'wrap' },
			alignItems: 'center',
			gap: $mol_gap.block,
			padding: $mol_gap.block,
			minHeight: '10rem',
			background: {
				image: $mol_style_func.vary( '--bog_nka_cover' ),
				size: [ 'cover' ],
				position: 'center',
			},
			border: {
				radius: $mol_gap.round,
			},
		},

		Profile: {
			flexDirection: 'column',
			alignItems: 'center',
			gap: $mol_gap.space,
		},

		Avatar: {
			width: '7rem',
			height: '7rem',
			alignItems: 'center',
			justifyContent: 'center',
			border: {
				radius: '50%',
			},
			background: {
				color: $mol_theme.card,
				size: [ 'cover' ],
				position: 'center',
			},
			boxShadow: `0 0 0 3px ${ $mol_theme.back }, 0 0 0 5px ${ $mol_theme.current }`,
		},

		Nick: {
			font: {
				weight: 'bold',
				size: '1.25rem',
			},
			padding: {
				top: 0,
				bottom: 0,
				left: $mol_gap.text,
				right: $mol_gap.text,
			},
			background: {
				color: $mol_theme.back,
			},
			border: {
				radius: $mol_gap.round,
			},
		},

		Socials: {
			flexDirection: 'column',
			padding: $mol_gap.block,
			background: {
				color: $mol_theme.back,
			},
			border: {
				radius: $mol_gap.round,
			},
			boxShadow: `inset 0 0 0 2px ${ $mol_theme.line }`,
		},

		Socials_label: {
			color: $mol_theme.shade,
		},

		Socials_list: {
			flex: { wrap: 'wrap' },
		},

		Social: {
			padding: $mol_gap.text,
			border: {
				radius: '50%',
			},
			$mol_icon: {
				width: '1.75rem',
				height: '1.75rem',
			},
		},

		Filters: {
			flex: { wrap: 'wrap' },
			alignItems: 'center',
			gap: $mol_gap.block,
			padding: {
				left: $mol_gap.block,
				right: $mol_gap.block,
			},
		},

		Search: {
			flex: {
				grow: 1,
			},
			maxWidth: '24rem',
			margin: {
				left: 'auto',
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
