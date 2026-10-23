namespace $ {

	function artist( $: $ ) {
		const land = $.$giper_baza_glob.land_grab()
		new $mol_wire_atom( 'bog_nka_test_artist', ()=> $.$giper_baza_glob.Land( land.link() ) ).fresh()
		const app = $$.$bog_nka_app.make({ $ })
		app.catalog_link = ()=> land.link().str
		return { land, app, settings: app.Settings() as $$.$bog_nka_settings }
	}

	function titles( app: $$.$bog_nka_app ) {
		return app.product_cards().map( card => ( card as $bog_nka_product_card ).title() )
	}

	$mol_test({

		async 'empty page offers to create a catalog and opens it'( $: $ ) {
			const app = $$.$bog_nka_app.make({ $ })
			let link = ''
			app.catalog_link = ( next?: string )=> next === undefined ? link : link = next
			$mol_assert_equal( app.content(), [ app.Catalog_missing() ] )

			await $mol_wire_async( app ).catalog_create()
			$mol_assert_equal( link.length > 0, true )
			$mol_assert_equal( app.content(), [ app.Catalog_selected() ] )
		},

		'artist adds a product and edits it on the card': $mol_wire_async( ( $: $ )=> {
			const { app, settings } = artist( $ )
			settings.category_add( 'Брелок' )
			settings.fandom_add( 'МЛП' )

			app.product_add()
			const card = app.product_cards()[ 0 ] as $$.$bog_nka_product_card
			$mol_assert_equal( card.changed(), true )
			$mol_assert_equal( card.info_rows(), [ card.Title(), card.Price(), card.Description(), card.Category(), card.Fandoms() ] )
			$mol_assert_unique( card.Admin(), null )

			card.title( 'Брелок Пинки' )
			card.price( 300 )
			card.category( 'Брелок' )
			card.fandoms([ 'МЛП' ])
			$mol_assert_equal( card.cart_enabled(), false )

			card.available( true )
			$mol_assert_equal( card.cart_enabled(), true )

			const product = app.catalog()!.Products()!.remote_list()[ 0 ]
			$mol_assert_equal( product.Title()!.val(), 'Брелок Пинки' )
			$mol_assert_equal( product.Price()!.val(), 300 )
			$mol_assert_equal( product.Category()!.val(), 'Брелок' )
			$mol_assert_equal( product.Fandoms()!.items(), [ 'МЛП' ] )
			$mol_assert_equal( settings.debug_info().endsWith( 'Products: 1 (1 available)' ), true )
		} ),

		'used merch kind is removed only after confirmation': $mol_wire_async( ( $: $ )=> {
			const { app, settings } = artist( $ )
			const kinds = settings.Categories() as $$.$bog_nka_tags

			kinds.draft( ' Брелок ' )
			kinds.submit()
			kinds.draft( 'Брелок' )
			kinds.submit()
			kinds.draft( 'Значок' )
			kinds.submit()
			$mol_assert_equal( settings.category_items(), [ 'Брелок', 'Значок' ] )
			$mol_assert_equal( kinds.draft(), '' )

			app.product_add()
			const card = app.product_cards()[ 0 ] as $$.$bog_nka_product_card
			card.category( 'Брелок' )

			kinds.remove( 'Значок' )
			$mol_assert_equal( settings.category_items(), [ 'Брелок' ] )

			kinds.remove( 'Брелок' )
			$mol_assert_equal( kinds.confirming( 'Брелок' ), true )
			$mol_assert_equal( kinds.usage_text( 'Брелок' ), '1' )
			$mol_assert_equal( settings.category_items(), [ 'Брелок' ] )

			kinds.cancel( 'Брелок' )
			$mol_assert_equal( kinds.confirming( 'Брелок' ), false )
			$mol_assert_equal( settings.category_items(), [ 'Брелок' ] )

			kinds.remove( 'Брелок' )
			kinds.confirm( 'Брелок' )
			$mol_assert_equal( settings.category_items(), [] )
			$mol_assert_equal( card.category(), '' )
		} ),

		'socials in the header follow settings': $mol_wire_async( ( $: $ )=> {
			const { app, settings } = artist( $ )
			$mol_assert_equal( app.hero_sub(), [ app.Profile() ] )

			settings.social_link( 'NaftulKittenArt' )
			settings.link_add( 'https://www.youtube.com/@nyaftul' )
			settings.link_add( 't.me/NaftulKittenArt' )
			$mol_assert_equal( app.social_list(), [ 'https://t.me/NaftulKittenArt', 'https://www.youtube.com/@nyaftul' ] )
			$mol_assert_equal( app.hero_sub(), [ app.Profile(), app.Socials() ] )
			$mol_assert_equal( app.social_sub( 'https://www.youtube.com/@nyaftul' ), [ app.Icon_youtube( 'https://www.youtube.com/@nyaftul' ) ] )

			settings.link_drop( 'https://www.youtube.com/@nyaftul' )
			$mol_assert_equal( app.social_list(), [ 'https://t.me/NaftulKittenArt' ] )
		} ),

		'bulk import from settings creates products and kinds': $mol_wire_async( ( $: $ )=> {
			const { app, settings } = artist( $ )
			settings.category_add( 'Брелок' )

			settings.import_json( JSON.stringify({
				products: [
					{ title: 'Брелок Пинки', price: 300, category: 'Брелок' },
					{ title: 'Значок Паймон', price: 200, category: 'Значок', available: false },
					{ price: 5 },
				],
			}) )
			$mol_assert_equal( settings.import_ready(), true )
			$mol_assert_equal( settings.import_new_categories(), [ 'Значок' ] )
			$mol_assert_equal( settings.import_data().errors, [ 'Product 3 has no title' ] )

			settings.import_run()
			$mol_assert_equal( settings.import_json(), '' )
			$mol_assert_equal( titles( app ), [ 'Брелок Пинки', 'Значок Паймон' ] )
			$mol_assert_equal( settings.category_items(), [ 'Брелок', 'Значок' ] )
		} ),

		'chosen theme is marked and applied to the catalog': $mol_wire_async( ( $: $ )=> {
			const { app, settings } = artist( $ )
			$mol_assert_equal( settings.theme(), 'sakura' )
			$mol_assert_equal( app.style()[ '--mol_theme_hue' ], '340deg' )

			settings.theme_select( 'sky' )
			$mol_assert_equal( settings.theme_swatch( 'sky' ).boxShadow, '0 0 0 3px var(--mol_theme_current)' )
			$mol_assert_equal( settings.theme_swatch( 'sakura' ).boxShadow, '0 0 0 1px var(--mol_theme_line)' )
			$mol_assert_equal( app.style()[ '--mol_theme_hue' ], '220deg' )
		} ),

	})

}
