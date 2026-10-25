namespace $ {
	$mol_test({

		'Social url accepts telegram nick in any form'() {
			for( const value of [ '@NaftulKittenArt', 'NaftulKittenArt', 't.me/NaftulKittenArt', ' https://t.me/NaftulKittenArt ' ] ) {
				$mol_assert_equal( $bog_merchquarium_social_url( value )?.toString(), 'https://t.me/NaftulKittenArt' )
			}
		},

		'Social url keeps other sites'() {
			$mol_assert_equal( $bog_merchquarium_social_url( 'vk.com/kitten' )?.toString(), 'https://vk.com/kitten' )
		},

		'Social url rejects empty and unsafe values'() {
			$mol_assert_equal( $bog_merchquarium_social_url( '' ), null )
			$mol_assert_equal( $bog_merchquarium_social_url( 'javascript:alert(1)' ), null )
			$mol_assert_equal( $bog_merchquarium_social_url( 'not a link' ), null )
		},

		'Social kind is detected by host'() {
			const kind = ( value: string )=> $bog_merchquarium_social_kind( $bog_merchquarium_social_url( value )! )
			$mol_assert_equal( kind( '@kitten' ), 'telegram' )
			$mol_assert_equal( kind( 'https://m.vk.com/kitten' ), 'vk' )
			$mol_assert_equal( kind( 'youtu.be/abc' ), 'youtube' )
			$mol_assert_equal( kind( 'www.instagram.com/kitten' ), 'instagram' )
			$mol_assert_equal( kind( 'boosty.to/kitten' ), 'web' )
		},

		'Social header hides order link when its network is already listed'() {
			$mol_assert_equal(
				$bog_merchquarium_social_header( '@NaftulKittenArt', [ 'vk.com/kitten', '@nyaftul_kitten_art' ] ),
				[ 'https://vk.com/kitten', 'https://t.me/nyaftul_kitten_art' ],
			)
			$mol_assert_equal(
				$bog_merchquarium_social_header( 'vk.com/kitten_orders', [ 'https://m.vk.com/kitten', 'boosty.to/kitten' ] ),
				[ 'https://m.vk.com/kitten', 'https://boosty.to/kitten' ],
			)
		},

		'Social header keeps order link of a new network first'() {
			$mol_assert_equal(
				$bog_merchquarium_social_header( '@NaftulKittenArt', [ 'vk.com/kitten', 'vk.com/kitten', 'boosty.to/kitten' ] ),
				[ 'https://t.me/NaftulKittenArt', 'https://vk.com/kitten', 'https://boosty.to/kitten' ],
			)
			$mol_assert_equal(
				$bog_merchquarium_social_header( 'kitten.art/shop', [ 'boosty.to/kitten' ] ),
				[ 'https://kitten.art/shop', 'https://boosty.to/kitten' ],
			)
		},

	})
}
