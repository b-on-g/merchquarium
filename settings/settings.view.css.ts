namespace $.$$ {

	$mol_style_define($bog_merchquarium_settings, {
		width: '100%',
		maxWidth: '44rem',
		margin: {
			left: 'auto',
			right: 'auto',
		},

		Title: {
			flex: {
				grow: 0,
			},
		},

		Lang: {
			margin: {
				right: 'auto',
			},
		},


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

		Account_id: {
			wordBreak: 'break-all',
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

		Images: {
			flex: { wrap: 'wrap' },
			gap: $mol_gap.block,
			padding: {
				top: $mol_gap.block,
				bottom: $mol_gap.block,
			},
		},

		Image_field: {
			flexDirection: 'column',
			alignItems: 'center',
			gap: $mol_gap.space,
		},

		Image_preview: {
			width: '5rem',
			height: '5rem',
			border: {
				radius: $mol_gap.round,
			},
			background: {
				color: $mol_theme.card,
				size: [ 'cover' ],
				position: 'center',
			},
			boxShadow: `inset 0 0 0 1px ${ $mol_theme.line }`,
		},

		Links_label: {
			color: $mol_theme.shade,
		},

	})

}