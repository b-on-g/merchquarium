namespace $ {

	function fill( $: $ ) {
		const land = $.$giper_baza_glob.land_grab()
		const catalog = land.Data( $bog_nka_catalog )
		catalog.Categories( null )!.items([ 'Открытка', 'Брелок', 'Значок' ])
		catalog.Fandoms( null )!.items([ 'МЛП', 'Genshin' ])

		for( const [ title, kind, fandoms ] of [
			[ 'Открытка Кит', 'Открытка', [ 'МЛП' ] ],
			[ 'Брелок Пинки', 'Брелок', [ 'МЛП' ] ],
			[ 'Значок Паймон', 'Значок', [ 'Genshin' ] ],
		] as const ) {
			const product = catalog.Products( null )!.make( null )
			product.Title( null )!.val( title )
			product.Category( null )!.val( kind )
			product.Fandoms( null )!.items( fandoms )
		}

		const app = $bog_nka_app.make({ $ })
		app.catalog_link = ()=> land.link().str
		return { app, catalog }
	}

	function titles( app: $bog_nka_app ) {
		return app.product_cards().map( card => ( card as $bog_nka_product_card ).title() )
	}

	$mol_test({

		'catalog filters by merch kind, fandom and search': $mol_wire_async( ( $: $ )=> {
			const { app } = fill( $ )

			app.category_filter( 'Значок' )
			$mol_assert_equal( titles( app ), [ 'Значок Паймон' ] )

			app.category_filter( 'all' )
			app.fandom_filter( 'МЛП' )
			$mol_assert_equal( titles( app ), [ 'Открытка Кит', 'Брелок Пинки' ] )

			app.fandom_filter( 'all' )
			app.search( 'пинк' )
			$mol_assert_equal( titles( app ), [ 'Брелок Пинки' ] )

			app.search( '#genshin' )
			$mol_assert_equal( titles( app ), [ 'Значок Паймон' ] )
		} ),

		'tag click on card searches by the tag': $mol_wire_async( ( $: $ )=> {
			const { app } = fill( $ )
			const card = app.product_cards()[ 0 ] as $bog_nka_product_card

			$mol_assert_equal( card.tags().map( ( tag: $mol_button_minor )=> tag.title() ), [ '#Открытка', '#МЛП' ] )

			card.tag_select( 'МЛП' )
			$mol_assert_equal( app.search(), 'МЛП' )
			$mol_assert_equal( titles( app ), [ 'Открытка Кит', 'Брелок Пинки' ] )
		} ),

		'dropping a fandom clears it from products': $mol_wire_async( ( $: $ )=> {
			const { app, catalog } = fill( $ )
			const settings = app.Settings()

			$mol_assert_equal( settings.fandom_usage( 'МЛП' ), 2 )
			settings.fandom_drop( 'МЛП' )

			$mol_assert_equal( catalog.Fandoms()!.items(), [ 'Genshin' ] )
			$mol_assert_equal( settings.fandom_usage( 'МЛП' ), 0 )
			$mol_assert_equal( app.fandom_options(), { all: app.Fandom_all(), Genshin: 'Genshin' } )
		} ),

	})

}
