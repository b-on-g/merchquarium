namespace $ {

	$mol_test({

		'products go to cart from cards and come back from the order link': $mol_wire_async( ( $: $ )=> {
			const land = $.$giper_baza_glob.land_grab()
			const catalog = land.Data( $bog_nka_catalog )
			catalog.Social( null )!.val( '@kitten_art' )

			for( const [ title, price, available ] of [
				[ 'Открытка Кит', 400, true ],
				[ 'Брелок Пинки', 300, true ],
				[ 'Значок Паймон', 200, false ],
			] as const ) {
				const product = catalog.Products( null )!.make( null )
				product.Title( null )!.val( title )
				product.Price( null )!.val( price )
				product.Available( null )!.val( available )
			}

			const app = $bog_nka_app.make({ $ })
			app.catalog_link = ()=> land.link().str
			const [ kit, pinkie, paimon ] = app.product_cards() as $bog_nka_product_card[]

			kit.cart_add()
			kit.Cart_counter().inc()
			pinkie.cart_add()
			paimon.cart_add()

			$mol_assert_equal( kit.cart_count(), 2 )
			$mol_assert_equal( paimon.cart_count(), 0 )
			$mol_assert_equal( app.cart_size_text(), '3' )

			const cart = app.Cart() as $$.$bog_nka_cart
			$mol_assert_equal( cart.total_text(), cart.Total_text().replace( '{total}', '1 100' ) )

			const code = /order=([^\s/&]+)/.exec( cart.message() )![ 1 ]
			$mol_assert_equal( $bog_nka_order_decode( land.link().str, decodeURIComponent( code ) ), {
				[ kit.product_link() ]: 2,
				[ pinkie.product_link() ]: 1,
			} )

			pinkie.Cart_counter().dec()
			$mol_assert_equal( app.cart_size_text(), '2' )
			$mol_assert_equal( pinkie.cart_controls(), [ pinkie.Cart_add() ] )
		} ),

		'non telegram social copies the order first and opens on the second press': $mol_wire_async( ( $: $ )=> {
			const land = $.$giper_baza_glob.land_grab()
			const catalog = land.Data( $bog_nka_catalog )
			catalog.Social( null )!.val( 'vk.com/kitten' )

			const product = catalog.Products( null )!.make( null )
			product.Title( null )!.val( 'Открытка Кит' )
			product.Available( null )!.val( true )

			const opened: string[] = []
			const copied: string[] = []
			const context = Object.create( $.$mol_dom_context )
			Object.defineProperties( context, {
				open: { value: ( url: string )=> opened.push( url ) },
				navigator: { value: { clipboard: { writeText: async ( text: string )=> { copied.push( text ) } } } },
			} )

			const cart = $$.$bog_nka_cart.make({ $: $.$mol_ambient({ $mol_dom_context: context }) })
			cart.catalog_link = ()=> land.link().str
			cart.items = ()=> ({ [ product.link().str ]: 1 })

			$mol_assert_equal( cart.send_title(), cart.Copy_title() )

			cart.send()
			$mol_assert_equal( copied, [ cart.message() ] )
			$mol_assert_equal( opened, [] )
			$mol_assert_equal( cart.send_title(), cart.Copied_title().replace( '{social}', 'VK' ) )

			cart.send()
			$mol_assert_equal( opened, [ 'https://vk.com/kitten' ] )
		} ),

	})

}
