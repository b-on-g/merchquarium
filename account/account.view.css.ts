namespace $.$$ {

	$mol_style_define( $bog_merchquarium_account, {

		gap: $mol_gap.block,
		alignItems: 'flex-start',

		Warning: {
			color: $mol_theme.focus,
		},

		Key_text: {
			maxWidth: '100%',
			overflowWrap: 'anywhere',
			userSelect: 'all',
			font: {
				family: 'monospace',
				size: '.75rem',
			},
		},

		Qr: {
			width: '16rem',
			maxWidth: '100%',
			aspectRatio: 1,
			background: {
				color: '#ffffff',
			},
			border: {
				radius: $mol_gap.round,
			},
		},

		Keep: {
			flex: { wrap: 'wrap' },
			gap: $mol_gap.space,
		},

		Load: {
			flex: { wrap: 'wrap' },
			gap: $mol_gap.space,
		},

	} )

}
