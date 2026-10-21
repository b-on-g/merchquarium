namespace $.$$ {

	$mol_style_define( $bog_nka_product_card, {
		overflow: 'hidden',
		border: {
			style: $mol_style_func.vary( '--bog_nka_card_border_style' ),
			width: $mol_style_func.vary( '--bog_nka_card_border_width' ),
			color: $mol_theme.control,
		},
		gap: $mol_gap.block,
		padding: {
			bottom: $mol_gap.block,
		},

		Cover: {
			display: 'block',
			padding: $mol_style_func.vary( '--bog_nka_photo_inset' ),
		},

		Photos: {
			Image: {
				width: '100%',
				aspectRatio: 1,
				border: {
					radius: $mol_style_func.vary( '--bog_nka_photo_round' ),
				},
			},
		},

		Photo_empty: {
			aspectRatio: 1,
			border: {
				radius: $mol_style_func.vary( '--bog_nka_photo_round' ),
			},
			alignItems: 'center',
			justifyContent: 'center',
			background: {
				color: $mol_theme.line,
			},
		},

		Photo_empty_icon: {
			width: '3rem',
			height: '3rem',
			color: $mol_theme.shade,
		},

		Info: {
			padding: {
				left: $mol_gap.block,
				right: $mol_gap.block,
			},
		},

		Title: {
			font: {
				size: '1.25rem',
				weight: 'bold',
			},
		},

		Price_text: {
			padding: {
				left: '.75rem',
				right: '.75rem',
			},
			font: {
				size: '1.5rem',
				weight: 'bold',
			},
			color: $mol_theme.current,
		},

		Description_text: {
			padding: {
				left: '.75rem',
				right: '.75rem',
			},
			color: $mol_theme.shade,
		},

		Category_text: {
			padding: {
				left: '.75rem',
				right: '.75rem',
			},
			font: {
				size: '.875rem',
			},
			color: $mol_theme.shade,
		},

		Buy: {
			justifyContent: 'center',
			margin: {
				left: $mol_gap.block,
				right: $mol_gap.block,
			},
		},

		Admin: {
			flex: {
				wrap: 'wrap',
			},
			alignItems: 'center',
			margin: {
				left: $mol_gap.block,
				right: $mol_gap.block,
			},
			border: {
				top: {
					width: '1px',
					style: 'dashed',
					color: $mol_theme.line,
				},
			},
		},

		Delete: {
			':hover': {
				color: '#e53935',
			},
		},

	} )

}
