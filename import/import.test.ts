namespace $ {
	$mol_test({

		'Import parses products and collects categories'() {
			const data = $bog_merchquarium_import_parse( JSON.stringify({
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

		'Import collects fandoms from list or comma separated text'() {
			const data = $bog_merchquarium_import_parse( JSON.stringify({
				fandoms: [ 'MLP' ],
				products: [
					{ title: 'Pin', fandoms: [ ' Genshin ', 'MLP', 'Genshin', '' ] },
					{ title: 'Mat', fandoms: 'Hollow Knight, MLP' },
					{ title: 'Case', tags: [ 'Undertale' ] },
					{ title: 'Cup' },
				],
			}) )
			$mol_assert_equal( data.fandoms, [ 'MLP', 'Genshin', 'Hollow Knight', 'Undertale' ] )
			$mol_assert_equal( data.products.map( product => product.fandoms ), [
				[ 'Genshin', 'MLP' ],
				[ 'Hollow Knight', 'MLP' ],
				[ 'Undertale' ],
				[],
			] )
		},

		'Import accepts json wrapped in code fence'() {
			const data = $bog_merchquarium_import_parse( '```json\n{ "products": [ { "title": "Mat" } ] }\n```' )
			$mol_assert_equal( data.products.length, 1 )
			$mol_assert_equal( data.errors, [] )
		},

		'Import reports broken json and untitled products'() {
			$mol_assert_equal( $bog_merchquarium_import_parse( '{ nope' ).errors.length, 1 )
			const data = $bog_merchquarium_import_parse( '{ "products": [ { "price": 5 } ] }' )
			$mol_assert_equal( data.products.length, 0 )
			$mol_assert_equal( data.errors, [ 'Product 1 has no title' ] )
		},
	})
}
