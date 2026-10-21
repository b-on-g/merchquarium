namespace $ {
	$mol_test({

		'Unknown theme falls back to sakura'() {
			$mol_assert_equal( $bog_nka_theme_of( 'nope' ), $bog_nka_theme.sakura )
			$mol_assert_equal( $bog_nka_theme_of( null ), $bog_nka_theme.sakura )
		},

		'Theme style sets hue and round'() {
			const style = $bog_nka_theme_style( 'mint' )
			$mol_assert_equal( style[ '--mol_theme_hue' ], '165deg' )
			$mol_assert_equal( style[ '--mol_gap_round' ], '1rem' )
		},

	})
}
