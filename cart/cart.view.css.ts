namespace $.$$ {

	$mol_style_define( $bog_prilavok_cart, {
		gap: $mol_gap.block,
		padding: $mol_gap.block,
		maxWidth: '50rem',
		background: {
			color: $mol_theme.back,
		},
		border: {
			radius: $mol_gap.round,
		},
		boxShadow: `0 0 0 1px ${ $mol_theme.line }`,
		margin: {
			left: 'auto',
			right: 'auto',
		},

		Back: {
			alignSelf: 'flex-start',
		},

		Title: {
			font: {
				size: '2rem',
				weight: 'bold',
			},
			justifyContent: 'center',
		},

		Lines: {
			gap: $mol_gap.block,
		},

		Line: {
			alignItems: 'center',
			flex: { wrap: 'nowrap' },
			gap: $mol_gap.block,
			padding: $mol_gap.block,
			background: {
				color: $mol_theme.card,
			},
			border: {
				radius: $mol_gap.round,
			},
		},

		Thumb: {
			width: '4.5rem',
			height: '4.5rem',
			flex: { shrink: 0 },
			border: {
				radius: $mol_gap.round,
			},
			background: {
				color: $mol_theme.line,
				size: [ 'cover' ],
				position: 'center',
			},
		},

		Line_info: {
			flexDirection: 'column',
			flex: { grow: 1, shrink: 1 },
			minWidth: 0,
		},

		Line_title: {
			font: {
				weight: 'bold',
			},
		},

		Line_price: {
			color: $mol_theme.shade,
		},

		Line_sum: {
			minWidth: '5rem',
			justifyContent: 'flex-end',
			font: {
				weight: 'bold',
			},
		},

		Summary: {
			flexDirection: 'column',
			gap: $mol_gap.block,
			padding: $mol_gap.block,
			background: {
				color: $mol_theme.card,
			},
			border: {
				radius: $mol_gap.round,
			},
			boxShadow: `inset 0 0 0 2px ${ $mol_theme.line }`,
		},

		Notice: {
			color: $mol_theme.shade,
		},

		Total: {
			font: {
				size: '1.5rem',
				weight: 'bold',
			},
			color: $mol_theme.current,
			justifyContent: 'flex-end',
		},

		Actions: {
			flex: { wrap: 'wrap' },
			justifyContent: 'center',
			gap: $mol_gap.block,
		},

		Send_hint: {
			justifyContent: 'center',
			textAlign: 'center',
			color: $mol_theme.shade,
		},

	} )

}
