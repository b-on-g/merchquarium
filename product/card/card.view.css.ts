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

		'@': {
			bog_nka_product_card_state: {
				sold: {
					Photos: {
						filter: 'grayscale(1)',
						opacity: .6,
					},
					Photo_empty: {
						opacity: .6,
					},
					Info: {
						opacity: .6,
					},
				},
				hidden: {
					opacity: .5,
					border: {
						style: 'dashed',
					},
				},
			},
		},

		Cover: {
			display: 'block',
			position: 'relative',
			padding: $mol_style_func.vary( '--bog_nka_photo_inset' ),
		},

		Sold_badge: {
			position: 'absolute',
			left: 0,
			right: 0,
			bottom: '1rem',
			justifyContent: 'center',
			margin: {
				left: 'auto',
				right: 'auto',
			},
			width: 'fit-content',
			padding: $mol_gap.text,
			color: $mol_theme.back,
			background: {
				color: $mol_theme.text,
			},
			border: {
				radius: $mol_gap.round,
			},
			font: {
				weight: 'bold',
			},
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

		Tags: {
			flex: {
				wrap: 'wrap',
			},
			padding: {
				left: '.25rem',
				right: '.25rem',
			},
		},

		Tag: {
			padding: {
				top: '.25rem',
				bottom: '.25rem',
				left: '.5rem',
				right: '.5rem',
			},
			font: {
				size: '.875rem',
			},
			color: $mol_theme.current,
		},

		Cart_controls: {
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
