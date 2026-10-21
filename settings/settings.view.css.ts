namespace $.$$ {

	$mol_style_define($bog_nka_settings, {
		Sales_section: {
			Content: {
				gap: $mol_gap.block,
			},
		},

		Import_section: {
			Content: {
				gap: $mol_gap.block,
			},
		},

		Account_lord: {
			font: {
				family: 'monospace',
				size: '1.25rem',
			},
		},

		Themes: {
			flex: { wrap: 'wrap' },
			gap: $mol_gap.block,
			padding: {
				top: $mol_gap.block,
				bottom: $mol_gap.block,
			},
		},

		Theme_option: {
			flexDirection: 'column',
			alignItems: 'center',
			gap: $mol_gap.space,
		},

		Theme_swatch: {
			width: '2.5rem',
			height: '2.5rem',
			border: {
				radius: '50%',
			},
		},

		Theme_name: {
			font: {
				size: '.875rem',
			},
		},

		Category_form: {
			flex: { wrap: 'nowrap' },
			padding: 0,
			gap: $mol_gap.block,
		},

		Category_input: {
			flex: { grow: 1 },
		},

		Categories_list: {
			flex: { wrap: 'wrap' },
			gap: $mol_gap.block,
			padding: {
				top: $mol_gap.block,
				bottom: $mol_gap.block,
			},
		},

		Category_row: {
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

	})

}