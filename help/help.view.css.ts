namespace $.$$ {

	$mol_style_define( $bog_merchquarium_help, {
		maxWidth: '44rem',
		margin: {
			left: 'auto',
			right: 'auto',
		},
		gap: $mol_gap.block,
		padding: $mol_gap.block,

		Quick: {
			gap: $mol_gap.block,
			padding: $mol_gap.block,
			background: {
				color: $mol_theme.card,
			},
			border: {
				radius: $mol_gap.round,
			},
			boxShadow: `0 0 0 2px ${ $mol_theme.current }`,
		},

		Quick_title: {
			font: {
				weight: 'bold',
				size: '1.375rem',
			},
			padding: {
				left: '.75rem',
				right: '.75rem',
			},
		},

		Quick_settings: {
			alignSelf: 'flex-start',
			margin: {
				left: '.75rem',
			},
		},

		Lead: {
			color: $mol_theme.shade,
			padding: {
				left: '.75rem',
				right: '.75rem',
			},
		},

		Section: {
			gap: $mol_gap.block,
			padding: $mol_gap.block,
			background: {
				color: $mol_theme.card,
			},
			border: {
				radius: $mol_gap.round,
			},
			boxShadow: `0 0 0 1px ${ $mol_theme.line }`,
		},

		Section_icon: {
			flex: {
				shrink: 0,
			},
			width: '2.5rem',
			height: '2.5rem',
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

		Section_body: {
			flex: {
				grow: 1,
				shrink: 1,
			},
			minWidth: 0,
		},

		Section_text: {
			padding: 0,
		},

		Section_title: {
			font: {
				weight: 'bold',
				size: '1.125rem',
			},
			padding: {
				left: '.75rem',
				right: '.75rem',
			},
		},

	} )

}
