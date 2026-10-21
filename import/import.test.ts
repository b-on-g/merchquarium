namespace $ {
	$mol_test({

		'Import parses products and collects categories'() {
			const data = $bog_nka_import_parse( JSON.stringify({
				title: ' Kitten ',
				categories: [ 'Mats' ],
				products: [
					{ title: 'Mat', price: 1200, category: 'Mats' },
					{ title: 'Case', price: '650', category: 'Cases', available: false },
				],
			}) )
			$mol_assert_equal( data.title, 'Kitten' )
			$mol_assert_equal( data.categories, [ 'Mats', 'Cases' ] )
			$mol_assert_equal( data.products.length, 2 )
			$mol_assert_equal( data.products[1].price, 650 )
			$mol_assert_equal( data.products[0].available, true )
			$mol_assert_equal( data.products[1].available, false )
			$mol_assert_equal( data.errors, [] )
		},

		'Import accepts json wrapped in code fence'() {
			const data = $bog_nka_import_parse( '```json\n{ "products": [ { "title": "Mat" } ] }\n```' )
			$mol_assert_equal( data.products.length, 1 )
			$mol_assert_equal( data.errors, [] )
		},

		'Import reports broken json and untitled products'() {
			$mol_assert_equal( $bog_nka_import_parse( '{ nope' ).errors.length, 1 )
			const data = $bog_nka_import_parse( '{ "products": [ { "price": 5 } ] }' )
			$mol_assert_equal( data.products.length, 0 )
			$mol_assert_equal( data.errors, [ 'Product 1 has no title' ] )
		},

		'Import creates products in catalog'( $ ) {
			const land = $giper_baza_land.make({ $ })
			const catalog = land.Data( $bog_nka_catalog )
			$bog_nka_import_apply( catalog, $bog_nka_import_parse( JSON.stringify({
				title: 'Kitten',
				products: [ { title: 'Mat', price: 1200, category: 'Mats', description: 'Soft' } ],
			}) ) )
			const [ link ] = catalog.Products()!.items()
			const product = land.Pawn( $bog_nka_product ).Head( link!.head() )
			$mol_assert_equal( catalog.Title()!.val(), 'Kitten' )
			$mol_assert_equal( catalog.Categories()!.items(), [ 'Mats' ] )
			$mol_assert_equal( product.Title()!.val(), 'Mat' )
			$mol_assert_equal( product.Price()!.val(), 1200 )
			$mol_assert_equal( product.Available()!.val(), true )
		},

	})
}
