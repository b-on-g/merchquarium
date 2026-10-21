namespace $ {
	$mol_test({

		'Social url accepts telegram nick in any form'() {
			for( const value of [ '@NaftulKittenArt', 'NaftulKittenArt', 't.me/NaftulKittenArt', ' https://t.me/NaftulKittenArt ' ] ) {
				$mol_assert_equal( $bog_nka_social_url( value )?.toString(), 'https://t.me/NaftulKittenArt' )
			}
		},

		'Social url keeps other sites'() {
			$mol_assert_equal( $bog_nka_social_url( 'vk.com/kitten' )?.toString(), 'https://vk.com/kitten' )
		},

		'Social url rejects empty and unsafe values'() {
			$mol_assert_equal( $bog_nka_social_url( '' ), null )
			$mol_assert_equal( $bog_nka_social_url( 'javascript:alert(1)' ), null )
			$mol_assert_equal( $bog_nka_social_url( 'not a link' ), null )
		},

	})
}
