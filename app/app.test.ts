namespace $ {

	$mol_test({

		'product order survives repeated delete and undo': $mol_wire_async( ( $: $ )=> {
			const land = $.$giper_baza_glob.land_grab()
			const catalog = land.Data( $bog_nka_catalog )
			const products = catalog.Products( null )
			if( !products ) throw new Error( 'Products list is missing' )

			const app = $bog_nka_app.make({ $ })
			app.catalog_link = ()=> land.link().str

			const titles = [
				'Product 1',
				'Product 2',
				'Product 3',
				'Product 4',
				'Product 5',
				'Product 6',
				'Product 7',
				'Product 8',
			]

			const links = titles.map( title => {
				const product = products.make( null )
				const atom = product.Title( null )
				if( !atom ) throw new Error( 'Product title is missing' )
				atom.val( title )
				return product.link().str
			} )

			const visible_titles = ()=> app.product_cards()
				.filter( card => card instanceof $bog_nka_product_card )
				.map( card => ( card as $bog_nka_product_card ).title() )

			const check = ( expected: string[] )=> {
				$mol_assert_equal( visible_titles(), expected )
			}

			check( titles )

			app.product_delete( links[ 2 ] )
			check([ 'Product 1', 'Product 2', 'Product 4', 'Product 5', 'Product 6', 'Product 7', 'Product 8' ])

			app.product_delete( links[ 5 ] )
			check([ 'Product 1', 'Product 2', 'Product 4', 'Product 5', 'Product 7', 'Product 8' ])

			app.product_undo( links[ 2 ] )
			check([ 'Product 1', 'Product 2', 'Product 3', 'Product 4', 'Product 5', 'Product 7', 'Product 8' ])

			app.product_delete( links[ 0 ] )
			check([ 'Product 2', 'Product 3', 'Product 4', 'Product 5', 'Product 7', 'Product 8' ])

			app.product_undo( links[ 5 ] )
			check([ 'Product 2', 'Product 3', 'Product 4', 'Product 5', 'Product 6', 'Product 7', 'Product 8' ])

			app.product_undo( links[ 0 ] )
			check( titles )
			
			const app_after_reload = $bog_nka_app.make({ $ })
			app_after_reload.catalog_link = ()=> land.link().str
			
			$mol_assert_equal(
				app_after_reload.product_cards()
					.filter( card => card instanceof $bog_nka_product_card )
					.map( card => ( card as $bog_nka_product_card ).title() ),
				titles,
			)

		} ),

	})

}
