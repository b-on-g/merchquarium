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

		'Social kind is detected by host'() {
			const kind = ( value: string )=> $bog_nka_social_kind( $bog_nka_social_url( value )! )
			$mol_assert_equal( kind( '@kitten' ), 'telegram' )
			$mol_assert_equal( kind( 'https://m.vk.com/kitten' ), 'vk' )
			$mol_assert_equal( kind( 'youtu.be/abc' ), 'youtube' )
			$mol_assert_equal( kind( 'www.instagram.com/kitten' ), 'instagram' )
			$mol_assert_equal( kind( 'boosty.to/kitten' ), 'web' )
		},

	})
}
