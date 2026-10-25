namespace $.$$ {

	$mol_style_define( $bog_merchquarium_tags, {
		flexDirection: 'column',

		Form: {
			flex: { wrap: 'nowrap' },
			padding: 0,
			gap: $mol_gap.block,
		},

		Input: {
			flex: { grow: 1 },
		},

		List: {
			flex: { wrap: 'wrap' },
			gap: $mol_gap.block,
			padding: {
				top: $mol_gap.block,
				bottom: $mol_gap.block,
			},
		},

		Row: {
			alignItems: 'center',
			flex: { wrap: 'nowrap', grow: 0 },
			padding: {
				top: 0,
				bottom: 0,
				left: '.75rem',
				right: 0,
			},
			gap: 0,
			background: {
				color: $mol_theme.card,
			},
			border: {
				radius: $mol_gap.round,
			},
			boxShadow: `inset 0 0 0 1px ${ $mol_theme.line }`,
		},

	} )

}
