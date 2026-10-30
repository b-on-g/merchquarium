namespace $.$$ {

	$mol_style_define( $bog_merchquarium_start, {
		flex: {
			grow: 1,
		},
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		padding: $mol_gap.block,

		Card: {
			width: '100%',
			maxWidth: '30rem',
			alignItems: 'center',
			gap: $mol_gap.block,
			padding: {
				top: '2rem',
				bottom: '2rem',
				left: $mol_gap.block,
				right: $mol_gap.block,
			},
			background: {
				color: $mol_theme.card,
			},
			border: {
				radius: $mol_gap.round,
			},
			boxShadow: `0 0 0 1px ${ $mol_theme.line }`,
		},

		Logo: {
			width: '5rem',
			height: '5rem',
			alignItems: 'center',
			justifyContent: 'center',
			color: $mol_theme.current,
			background: {
				color: $mol_theme.back,
			},
			border: {
				radius: '50%',
			},
			boxShadow: `0 0 0 3px ${ $mol_theme.current }`,
		},

		Logo_icon: {
			width: '3rem',
			height: '3rem',
		},

		Brand: {
			font: {
				size: '2rem',
				weight: 'bold',
			},
			textAlign: 'center',
		},

		Tagline: {
			color: $mol_theme.current,
			textAlign: 'center',
			padding: {
				top: 0,
			},
		},

		Lead: {
			textAlign: 'center',
		},

		Points: {
			alignSelf: 'stretch',
			gap: $mol_gap.space,
		},

		Point: {
			alignItems: 'center',
			gap: $mol_gap.block,
		},

		Point_icon: {
			flex: {
				shrink: 0,
			},
			width: '2.25rem',
			height: '2.25rem',
			alignItems: 'center',
			justifyContent: 'center',
			color: $mol_theme.current,
			background: {
				color: $mol_theme.back,
			},
			border: {
				radius: '50%',
			},
		},

		Point_text: {
			flex: {
				shrink: 1,
			},
			minWidth: 0,
		},

		Create: {
			font: {
				size: '1.125rem',
			},
			padding: {
				top: '.5rem',
				bottom: '.5rem',
				left: '2rem',
				right: '2rem',
			},
		},

		Note: {
			color: $mol_theme.shade,
			textAlign: 'center',
			font: {
				size: '.875rem',
			},
		},

	} )

}
