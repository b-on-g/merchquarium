namespace $.$$ {
	
	$mol_style_define($bog_merchquarium_app, {
		background: {
			image: $mol_style_func.vary( '--bog_merchquarium_pattern' ),
			size: [ $mol_style_func.vary( '--bog_merchquarium_pattern_size' ) ],
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
		Head: {
			alignItems: 'flex-start',
			background: {
				image: $mol_style_func.vary( '--bog_merchquarium_cover' ),
				size: [ 'cover' ],
				position: 'center',
			},
		},
		Hero: {
			flex: { wrap: 'wrap', grow: 1 },
			alignItems: 'center',
			gap: $mol_gap.block,
			padding: $mol_gap.block,
			minHeight: '10rem',
			'@media': {
				'(max-width: 40rem)': {
					padding: $mol_gap.space,
					minHeight: 0,
				},
			},
		},

		Profile: {
			flexDirection: 'column',
			alignItems: 'center',
			gap: $mol_gap.block,
			'@media': {
				'(max-width: 40rem)': {
					flexDirection: 'row',
				},
			},
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
			'@media': {
				'(max-width: 40rem)': {
					width: '3.5rem',
					height: '3.5rem',
					boxShadow: `0 0 0 2px ${ $mol_theme.back }, 0 0 0 3px ${ $mol_theme.current }`,
				},
			},
		},

		Nick: {
			font: {
				weight: 'bold',
				size: '1.25rem',
			},
			'@media': {
				'(max-width: 40rem)': {
					font: {
						size: '1rem',
					},
				},
			},
			padding: {
				top: 0,
				bottom: 0,
				left: $mol_gap.text,
				right: $mol_gap.text,
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
			'@media': {
				'(max-width: 40rem)': {
					padding: 0,
				},
			},
		},

		Socials_label: {
			color: $mol_theme.shade,
			'@media': {
				'(max-width: 40rem)': {
					display: 'none',
				},
			},
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
				'@media': {
					'(max-width: 40rem)': {
						width: '1.25rem',
						height: '1.25rem',
					},
				},
			},
		},

		Filters: {
			flex: { wrap: 'wrap' },
			alignItems: 'center',
			gap: $mol_gap.block,
			padding: $mol_gap.space,
			margin: {
				left: $mol_gap.block,
				right: $mol_gap.block,
			},
			background: {
				color: $mol_theme.back,
			},
			border: {
				radius: $mol_gap.round,
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

		Cart_size: {
			font: {
				weight: 'bold',
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
