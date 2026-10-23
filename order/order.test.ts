namespace $ {
	$mol_test({

		'Order code keeps products and counts of this catalog only'() {
			const catalog = 'AAAAAAAA_BBBBBBBB'
			const items = { [ catalog + '_one' ]: 2, [ catalog + '__two' ]: 1, 'CCCCCCCC_DDDDDDDD_x': 5, [ catalog + '_zero' ]: 0 }
			const code = $bog_nka_order_encode( catalog, items )
			$mol_assert_equal( code, '_one.2~__two.1' )
			$mol_assert_equal( $bog_nka_order_decode( catalog, code ), { [ catalog + '_one' ]: 2, [ catalog + '__two' ]: 1 } )
		},

		'Order code ignores garbage'() {
			$mol_assert_equal( $bog_nka_order_decode( 'X', '_a.0~<b>.1~_c.99999~_d.3' ), { X_d: 3 } )
		},

		'Order message fills placeholders and always has the link'() {
			const order = { titles: [ 'Кит', 'Пинки' ], count: 3, total: 1000, link: 'https://x/#!order=1' }
			$mol_assert_equal(
				$bog_nka_order_message( 'Хочу {count} шт. на {total} ₽: {link}', order ),
				'Хочу 3 шт. на 1\u00a0000 ₽: https://x/#!order=1',
			)
			$mol_assert_equal(
				$bog_nka_order_message( 'Хочу купить {title}!', order ),
				'Хочу купить Кит, Пинки! https://x/#!order=1',
			)
		},

	})
}
