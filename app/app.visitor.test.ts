namespace $ {

	function step< Result >( task: ()=> Result ) {
		return $mol_wire_async( task )() as Promise< Result >
	}

	function artist( $: $ ) {
		const land = $.$giper_baza_glob.land_grab()
		new $mol_wire_atom( 'bog_nka_test_artist', ()=> $.$giper_baza_glob.Land( land.link() ) ).fresh()
		const app = $$.$bog_nka_app.make({ $ })
		app.catalog_link = ()=> land.link().str
		return { land, app, settings: app.Settings() as $$.$bog_nka_settings }
	}

	function product( app: $$.$bog_nka_app, config: { title: string, price?: number, description?: string, kind?: string, fandoms?: string[], available?: boolean } ) {
		app.product_add()
		const card = app.product_cards().at( -1 ) as $$.$bog_nka_product_card
		card.title( config.title )
		card.price( config.price ?? 0 )
		card.description( config.description ?? '' )
		if( config.kind ) card.category( config.kind )
		card.fandoms( config.fandoms ?? [] )
		card.available( config.available ?? true )
		return card
	}

	async function visitor( $: $, land: $giper_baza_land ) {
		const auth = $.$giper_baza_auth.grab()
		const context = $.$mol_ambient({})

		class Auth extends $.$giper_baza_auth {
			static current() { return auth }
		}
		class Glob extends $.$giper_baza_glob {
			static $ = context
		}
		Object.assign( context, { $giper_baza_auth: Auth, $giper_baza_glob: Glob } )

		new $mol_wire_atom( 'bog_nka_test_visitor', ()=> Glob.Land( land.link() ) ).fresh()
		await $mol_wire_async( Glob.Land( land.link() ) ).units_steal( land )

		const app = $$.$bog_nka_app.make({ $: context })
		app.catalog_link = ()=> land.link().str
		return app
	}

	function titles( app: $$.$bog_nka_app ) {
		return app.product_cards().map( card => ( card as $bog_nka_product_card ).title() )
	}

	$mol_test({

		async 'visitor sees only available products and their kinds and fandoms'( $: $ ) {
			const { land, app } = await step( ()=> {
				const artwork = artist( $ )
				for( const kind of [ 'Открытка', 'Брелок', 'Значок' ] ) artwork.settings.category_add( kind )
				for( const fandom of [ 'МЛП', 'Genshin' ] ) artwork.settings.fandom_add( fandom )
				product( artwork.app, { title: 'Открытка Кит', kind: 'Открытка', fandoms: [ 'МЛП' ] } )
				product( artwork.app, { title: 'Брелок Пинки', kind: 'Брелок', fandoms: [ 'МЛП' ] } )
				product( artwork.app, { title: 'Значок Паймон', kind: 'Значок', fandoms: [ 'Genshin' ], available: false } )
				return artwork
			} )

			const guest = await visitor( $, land )

			await step( ()=> {
				$mol_assert_equal( titles( app ), [ 'Открытка Кит', 'Брелок Пинки', 'Значок Паймон' ] )
				$mol_assert_equal( guest.is_admin(), false )
				$mol_assert_equal( titles( guest ), [ 'Открытка Кит', 'Брелок Пинки' ] )
				$mol_assert_equal( Object.keys( guest.kind_options() ), [ 'all', 'Открытка', 'Брелок' ] )
				$mol_assert_equal( Object.keys( guest.fandom_options() ), [ 'all', 'МЛП' ] )
			} )
		},

		async 'visitor gets no admin controls'( $: $ ) {
			const { land } = await step( ()=> {
				const artwork = artist( $ )
				product( artwork.app, { title: 'Открытка Кит', price: 400 } )
				return artwork
			} )

			const guest = await visitor( $, land )

			await step( ()=> {
				const card = guest.product_cards()[ 0 ] as $$.$bog_nka_product_card
				$mol_assert_equal( guest.is_not_admin(), true )
				$mol_assert_equal( guest.Product_add().hidden(), true )
				$mol_assert_equal( guest.Settings_button(), null )
				$mol_assert_equal( card.changed(), false )
				$mol_assert_equal( card.Admin(), null )

				const settings = guest.Settings() as $$.$bog_nka_settings
				$mol_assert_equal( settings.body(), [ settings.Account_section(), settings.Categories_section(), settings.Fandoms_section() ] )
				$mol_assert_equal( settings.Categories().content(), [ settings.Categories().List() ] )
			} )
		},

		async 'visitor card shows price and tags but hides empty description'( $: $ ) {
			const { land } = await step( ()=> {
				const artwork = artist( $ )
				artwork.settings.category_add( 'Брелок' )
				product( artwork.app, { title: 'Брелок Пинки', price: 1000, kind: 'Брелок' } )
				product( artwork.app, { title: 'Открытка Кит', description: 'С блёстками' } )
				return artwork
			} )

			const guest = await visitor( $, land )

			await step( ()=> {
				const [ pinkie, kit ] = guest.product_cards() as $$.$bog_nka_product_card[]
				$mol_assert_equal( pinkie.info_rows(), [ pinkie.Title(), pinkie.Price_text(), pinkie.Tags() ] )
				$mol_assert_equal( pinkie.price_text(), '1 000 ₽' )
				$mol_assert_equal( kit.info_rows(), [ kit.Title(), kit.Description_text() ] )
			} )
		},

		async 'catalog look and socials set in settings reach the visitor'( $: $ ) {
			const { land } = await step( ()=> {
				const artwork = artist( $ )
				artwork.settings.catalog_title( 'Nyaftul Kitten Art' )
				artwork.settings.theme_select( 'mint' )
				artwork.settings.social_link( '@NaftulKittenArt' )
				artwork.settings.link_add( 'vk.com/nyaftul' )
				artwork.settings.listed( false )
				return artwork
			} )

			const guest = await visitor( $, land )

			await step( ()=> {
				$mol_assert_equal( guest.title(), 'Nyaftul Kitten Art' )
				$mol_assert_equal( guest.style()[ '--mol_theme_hue' ], '165deg' )
				$mol_assert_equal( guest.social_list(), [ 'https://t.me/NaftulKittenArt', 'https://vk.com/nyaftul' ] )
				$mol_assert_equal( guest.catalog()!.Hidden()!.val(), true )
			} )
		},

		async 'visitor orders from cards and the artist opens the same order'( $: $ ) {
			const { land, app } = await step( ()=> {
				const artwork = artist( $ )
				artwork.settings.social_link( '@kitten_art' )
				product( artwork.app, { title: 'Открытка Кит', price: 400 } )
				product( artwork.app, { title: 'Значок Паймон', price: 200, available: false } )
				return artwork
			} )

			const guest = await visitor( $, land )

			await step( ()=> {
				const cards = guest.product_cards() as $$.$bog_nka_product_card[]
				$mol_assert_equal( cards.length, 1 )

				const kit = cards[ 0 ]
				kit.cart_add()
				kit.Cart_counter().inc()
				kit.Cart_counter().inc()

				const cart = guest.Cart() as $$.$bog_nka_cart
				$mol_assert_equal( cart.send_title(), cart.Send_title() )
				const code = /order=([^\s/&]+)/.exec( cart.message() )![ 1 ]

				const order = app.Order() as $$.$bog_nka_cart
				order.items = ()=> $bog_nka_order_decode( land.link().str, decodeURIComponent( code ) )
				$mol_assert_equal( order.lines().length, 1 )
				$mol_assert_equal( order.line_sum( kit.product_link() ), '1 200 ₽' )
				$mol_assert_equal( order.rows().includes( order.Actions() ), false )
			} )
		},

	})

}
