namespace $ {

	function step< Result >( task: ()=> Result ) {
		return $mol_wire_async( task )() as Promise< Result >
	}

	function keep( name: string, land: ()=> $giper_baza_land ) {
		new $mol_wire_atom( name, land ).fresh()
	}

	const run = Date.now().toString( 36 ).slice( -4 )
	const mark = ( name: string )=> `${ name } ${ run }`
	const ours = ( names: readonly string[] )=> names.filter( name => name.endsWith( ` ${ run }` ) )

	const kit = mark( 'Открытка Кит' )
	const pinkie = mark( 'Брелок Пинки' )
	const paimon = mark( 'Значок Паймон' )
	const sticker = mark( 'Наклейка Кит' )
	const postcard = mark( 'Открытка' )
	const keychain = mark( 'Брелок' )
	const badge = mark( 'Значок' )
	const decal = mark( 'Наклейка' )
	const mlp = mark( 'МЛП' )
	const genshin = mark( 'Genshin' )
	const knight = mark( 'Hollow Knight' )

	const order_url = 'https://t.me/NaftulKittenArt'
	const links = [ 'https://vk.com/nyaftulkittenart', 'https://t.me/nyaftul_kitten_art' ]

	function socials( app: $$.$bog_merchquarium_app ) {
		const list = app.social_list()
		return [ ... list.includes( order_url ) ? [ order_url ] : [], ... links.filter( link => list.includes( link ) ) ]
	}

	function titles( app: $$.$bog_merchquarium_app ) {
		return ours( app.product_cards()
			.filter( card => card instanceof $bog_merchquarium_product_card )
			.map( card => ( card as $bog_merchquarium_product_card ).title() ) )
	}

	function card( app: $$.$bog_merchquarium_app, title: string ) {
		return ( app.product_cards() as $$.$bog_merchquarium_product_card[] ).find( card => card.title() === title )!
	}

	function order_code( cart: $$.$bog_merchquarium_cart ) {
		return decodeURIComponent( /order=([^\s/&]+)/.exec( cart.message() )![ 1 ] )
	}

	let link = ''
	let images = false
	let artist: $$.$bog_merchquarium_app
	let settings: $$.$bog_merchquarium_settings
	let guest_context: $
	let guest_land: $giper_baza_land
	let guest: $$.$bog_merchquarium_app

	function land() {
		return artist.$.$giper_baza_glob.Land( new $giper_baza_link( link ) )
	}

	function mock_dom() {
		const opened: string[] = []
		const copied: string[] = []
		const dom = Object.create( guest_context.$mol_dom_context )
		Object.defineProperties( dom, {
			open: { value: ( url: string )=> opened.push( url ) },
			navigator: { value: { clipboard: { writeText: async ( text: string )=> { copied.push( text ) } } } },
		} )
		return { context: guest_context.$mol_ambient({ $mol_dom_context: dom }), opened, copied }
	}

	function want_card( context: $, title: string ) {
		const item = $$.$bog_merchquarium_product_card.make({ $: context })
		item.product_link = ()=> card( guest, title ).product_link()
		item.catalog_link = ()=> link
		return item
	}

	async function sync_guest() {
		await $mol_wire_async( guest_land ).units_steal( land() )
	}

	const scenario: Record< string, ( $: $ )=> unknown > = {

		async 'e2e 01: catalog is taken from the url or created'( $ ) {
			const context = $bog_merchquarium_test_context( $ )
			link = context.$mol_state_arg.value( 'catalog' ) ?? ''

			artist = $$.$bog_merchquarium_app.make({ $: context })
			artist.catalog_link = ( next?: string )=> {
				if( next === undefined ) return link
				context.$mol_state_arg.value( 'catalog', next )
				return link = next
			}
			artist.focused = ( next?: boolean )=> next ?? false
			settings = artist.Settings() as $$.$bog_merchquarium_settings

			if( !link ) {
				await step( ()=> $mol_assert_equal( artist.content(), [ artist.Catalog_missing() ] ) )
				await step( ()=> {
					artist.catalog_create()
					keep( 'bog_merchquarium_e2e_artist', land )
				} )
			} else {
				keep( 'bog_merchquarium_e2e_artist', land )
			}

			await step( ()=> {
				$mol_assert_equal( link.length > 0, true )
				$mol_assert_equal( artist.content(), [ artist.Catalog_selected() ] )
				$mol_assert_equal( artist.is_admin(), true )
			} )
		},

		async 'e2e 02: artist sets up look, socials, kinds and fandoms'() {
			await step( ()=> {
				settings.catalog_title( 'Nyaftul Kitten Art' )
				settings.theme_select( 'mint' )
				settings.social_link( '@NaftulKittenArt' )
				settings.link_add( 'https://vk.com/nyaftulkittenart' )
				settings.link_add( '@nyaftul_kitten_art' )

				const kinds = settings.Categories() as $$.$bog_merchquarium_tags
				for( const kind of [ ` ${ postcard } `, keychain, keychain, badge ] ) {
					kinds.draft( kind )
					kinds.submit()
				}
				$mol_assert_equal( kinds.draft(), '' )

				settings.fandom_add( mlp )
				settings.fandom_add( genshin )
				const fandoms = settings.Fandoms() as $$.$bog_merchquarium_tags
				fandoms.draft( `#${ genshin }` )
				fandoms.submit()
				$mol_assert_equal( fandoms.name( mlp ), `#${ mlp }` )
				$mol_assert_equal( kinds.name( badge ), badge )
				$mol_assert_equal( artist.fandom_options()[ mlp ], `#${ mlp }` )

				$mol_assert_equal( artist.title(), 'Nyaftul Kitten Art' )
				$mol_assert_equal( artist.style()[ '--mol_theme_hue' ], '165deg' )
				$mol_assert_equal( settings.theme_swatch( 'mint' ).boxShadow, '0 0 0 3px var(--mol_theme_current)' )
				$mol_assert_equal( socials( artist ), links )
				$mol_assert_equal( artist.hero_sub(), [ artist.Profile(), artist.Socials() ] )
				$mol_assert_equal( artist.social_sub( 'https://vk.com/nyaftulkittenart' ), [ artist.Icon_vk( 'https://vk.com/nyaftulkittenart' ) ] )
				$mol_assert_equal( ours( settings.category_items() ), [ postcard, keychain, badge ] )
				$mol_assert_equal( ours( settings.fandom_items() ), [ mlp, genshin ] )
			} )
		},

		async 'e2e 03: hero sits in the page head and images repaint the whole head'() {
			await step( ()=> {
				$mol_assert_equal( artist.head(), [ artist.Hero(), artist.Product_add(), artist.Tools() ] )
				$mol_assert_equal( artist.catalog_rows().includes( artist.Hero() ), false )
			} )

			const keys = [ 'Avatar', 'Cover', 'Back' ] as const
			const files = await Promise.all( keys.map( key => $bog_merchquarium_test_image( `${ key.toLowerCase() }.png` ) ) )
			if( !files[ 0 ] ) {
				$$.$mol_log3_warn({
					place: '$bog_merchquarium_e2e',
					message: 'images skipped without canvas',
					hint: 'run e2e in browser with test=1',
				})
				return
			}

			for( const [ index, key ] of keys.entries() ) {
				await $mol_wire_async( settings ).image_save( key, files[ index ]! )
			}
			images = true

			await step( ()=> {
				for( const key of keys ) $mol_assert_equal( artist.image_url( key ).startsWith( 'blob:' ), true )
				$mol_assert_equal( settings.image_filled( 'Cover' ), true )
				$mol_assert_equal( artist.avatar_empty(), false )
				$mol_assert_equal( artist.style()[ '--bog_merchquarium_cover' ], `url("${ artist.image_url( 'Cover' ) }")` )
				$mol_assert_equal( artist.style()[ '--bog_merchquarium_pattern' ], `url("${ artist.image_url( 'Back' ) }")` )
			} )

			const doc = $mol_dom_context.document
			const host = doc.createElement( 'div' )
			host.style.cssText = 'position: fixed; left: -10000px; width: 800px; height: 600px'
			doc.body.append( host )
			try {
				await step( ()=> {
					host.replaceChildren( artist.dom_tree() )
					const css = ( view: $mol_view )=> getComputedStyle( view.dom_node() as Element ).backgroundImage
					$mol_assert_equal( css( artist.Head() ), `url("${ artist.image_url( 'Cover' ) }")` )
					$mol_assert_equal( css( artist.Avatar() ), `url("${ artist.image_url( 'Avatar' ) }")` )
					$mol_assert_equal( css( artist ), `url("${ artist.image_url( 'Back' ) }")` )
				} )
			} finally {
				host.remove()
			}
		},

		async 'e2e 04: artist adds products and edits them on cards'() {
			await step( ()=> {
				for( const [ title, price, kind, fandoms, status, description ] of [
					[ kit, 400, postcard, [ mlp ], 'available', '' ],
					[ pinkie, 300, keychain, [ mlp ], 'available', 'С блёстками' ],
					[ paimon, 200, badge, [ genshin ], 'hidden', '' ],
				] as const ) {
					const before = artist.product_cards()
					artist.product_add()
					const item = artist.product_cards().find( card => !before.includes( card ) ) as $$.$bog_merchquarium_product_card
					$mol_assert_equal( item.changed(), true )
					$mol_assert_equal( item.info_rows(), [ item.Title(), item.Price(), item.Description(), item.Category(), item.Fandoms() ] )
					$mol_assert_unique( item.Admin(), null )

					item.title( title )
					item.price( price )
					item.description( description )
					item.category( kind )
					item.fandoms( fandoms )
					$mol_assert_equal( item.status(), 'hidden' )
					$mol_assert_equal( item.cart_enabled(), false )

					item.product().Available( 'auto' )!.val( true )
					$mol_assert_equal( item.status(), 'available' )

					item.Status().option_checked( status, true )
					$mol_assert_equal( item.status(), status )
					$mol_assert_equal( item.product().Available()!.val(), status === 'available' )
					$mol_assert_equal( item.cart_enabled(), status === 'available' )
					$mol_assert_equal( item.attr().bog_merchquarium_product_card_state, status )
				}

				const draft = card( artist, paimon )
				draft.Status().option_checked( 'hidden', false )
				$mol_assert_equal( draft.status(), 'hidden' )

				$mol_assert_equal( titles( artist ), [ kit, pinkie, paimon ] )
				$mol_assert_equal( artist.catalog_rows(), [ artist.Filters(), artist.Product_cards() ] )
			} )
		},

		async 'e2e 05: bulk import adds products and new kinds'() {
			await step( ()=> {
				const magnet = mark( 'Магнит' )
				const undertale = mark( 'Undertale' )
				for( const [ json, kinds, fandoms ] of [
					[ { categories: [ magnet ] }, [ magnet ], [] ],
					[ { fandoms: [ `#${ undertale }` ] }, [], [ undertale ] ],
				] as [ object, string[], string[] ][] ) {
					settings.import_json( JSON.stringify( json ) )
					$mol_assert_equal( settings.import_ready(), true )
					$mol_assert_equal( settings.import_new_categories(), kinds )
					$mol_assert_equal( settings.import_new_fandoms(), fandoms )
					settings.import_run()
					$mol_assert_equal( settings.import_ready(), false )
				}
				$mol_assert_equal( settings.category_items().includes( magnet ), true )
				$mol_assert_equal( settings.fandom_items().includes( undertale ), true )
				settings.category_drop( magnet )
				settings.fandom_drop( undertale )

				const youtube = `https://youtube.com/@merch${ run }`
				settings.import_json( '```json\n' + JSON.stringify({
					social: order_url,
					links: [ 'vk.com/nyaftulkittenart', youtube ],
					products: [
						{ title: sticker, price: 100, category: decal, fandoms: [ `#${ genshin }`, knight ] },
						{ price: 5 },
					],
				}) + '\n```' )
				$mol_assert_equal( settings.import_ready(), true )
				$mol_assert_equal( settings.import_new_categories(), [ decal ] )
				$mol_assert_equal( settings.import_new_fandoms(), [ knight ] )
				$mol_assert_equal( settings.import_new_links(), [ youtube ] )
				$mol_assert_equal( settings.import_data().errors, [ 'Product 2 has no title' ] )

				settings.import_run()
				$mol_assert_equal( settings.import_json(), '' )
				$mol_assert_equal( settings.social_link(), '@NaftulKittenArt' )
				$mol_assert_equal( settings.link_items().filter( link => link.endsWith( run ) ), [ youtube ] )
				$mol_assert_equal( artist.social_list().includes( youtube ), true )
				settings.link_drop( youtube )
				$mol_assert_equal( socials( artist ), links )
				$mol_assert_equal( ours( settings.category_items() ), [ postcard, keychain, badge, decal ] )
				$mol_assert_equal( titles( artist ), [ kit, pinkie, paimon, sticker ] )
				$mol_assert_equal( card( artist, sticker ).status(), 'available' )
				$mol_assert_equal( card( artist, sticker ).fandoms(), [ genshin, knight ] )
				$mol_assert_equal( ours( settings.fandom_items() ), [ mlp, genshin, knight ] )
			} )
		},

		async 'e2e 06: artist filters by kind, fandom, search and tag'() {
			await step( ()=> {
				artist.category_filter( badge )
				$mol_assert_equal( titles( artist ), [ paimon ] )

				artist.category_filter( 'all' )
				artist.fandom_filter( mlp )
				$mol_assert_equal( titles( artist ), [ kit, pinkie ] )

				artist.fandom_filter( 'all' )
				artist.search( `пинки ${ run }` )
				$mol_assert_equal( titles( artist ), [ pinkie ] )

				artist.search( `#${ genshin.toLowerCase() }` )
				$mol_assert_equal( titles( artist ), [ paimon, sticker ] )

				artist.search( '' )
				const item = card( artist, kit )
				$mol_assert_equal( item.tags().map( ( tag: $mol_button_minor )=> tag.title() ), [ `#${ postcard }`, `#${ mlp }` ] )
				item.tag_select( mlp )
				$mol_assert_equal( artist.search(), mlp )
				$mol_assert_equal( titles( artist ), [ kit, pinkie ] )
				artist.search( '' )
			} )
		},

		async 'e2e 07: deleted products come back in place after undo'() {
			await step( ()=> {
				const links = [ pinkie, sticker ].map( title => card( artist, title ).product_link() )
				artist.product_delete( links[ 0 ] )
				artist.product_delete( links[ 1 ] )
				$mol_assert_equal( titles( artist ), [ kit, paimon ] )

				artist.product_undo( links[ 0 ] )
				artist.product_undo( links[ 1 ] )
				$mol_assert_equal( titles( artist ), [ kit, pinkie, paimon, sticker ] )
			} )
		},

		async 'e2e 08: used kind is removed only after confirmation'() {
			await step( ()=> {
				const kinds = settings.Categories() as $$.$bog_merchquarium_tags

				kinds.remove( decal )
				$mol_assert_equal( kinds.confirming( decal ), true )
				$mol_assert_equal( kinds.usage_text( decal ), '1' )

				kinds.cancel( decal )
				$mol_assert_equal( kinds.confirming( decal ), false )
				$mol_assert_equal( settings.category_items().includes( decal ), true )

				kinds.remove( decal )
				kinds.confirm( decal )
				$mol_assert_equal( ours( settings.category_items() ), [ postcard, keychain, badge ] )
				$mol_assert_equal( card( artist, sticker ).category(), '' )
			} )
		},

		async 'e2e 09: visitor receives the catalog'( $ ) {
			const base = $bog_merchquarium_test_context( $ )
			const embryo = base.$giper_baza_auth.embryos[ 0 ]
			const auth = embryo ? base.$giper_baza_auth.from( embryo ) : await base.$giper_baza_auth._generate()
			guest_context = base.$mol_ambient({})

			class Auth extends base.$giper_baza_auth {
				static current() { return auth }
			}
			class Glob extends base.$giper_baza_glob {
				static $ = guest_context
			}
			Object.assign( guest_context, { $giper_baza_auth: Auth, $giper_baza_glob: Glob } )

			guest_land = Glob.Land( new $giper_baza_link( link ) )
			keep( 'bog_merchquarium_e2e_guest', ()=> Glob.Land( new $giper_baza_link( link ) ) )
			await sync_guest()

			guest = $$.$bog_merchquarium_app.make({ $: guest_context })
			guest.catalog_link = ()=> link

			await step( ()=> {
				$mol_assert_unique( auth.pass().lord().str, new $giper_baza_link( link ).lord().str, base.$giper_baza_auth.current().pass().lord().str )
				$mol_assert_equal( guest.is_admin(), false )
				$mol_assert_equal( guest.title(), 'Nyaftul Kitten Art' )
				$mol_assert_equal( guest.style()[ '--mol_theme_hue' ], '165deg' )
				$mol_assert_equal( socials( guest ), links )
				$mol_assert_equal( guest.head(), [ guest.Hero(), guest.Product_add(), guest.Tools() ] )
				$mol_assert_equal( guest.avatar_empty(), !images )
				$mol_assert_equal( guest.style()[ '--bog_merchquarium_cover' ] !== 'none', images )
			} )
		},

		async 'e2e 10: visitor does not see hidden products and admin controls'() {
			await step( ()=> {
				$mol_assert_equal( titles( guest ), [ kit, pinkie, sticker ] )
				$mol_assert_equal( ours( Object.keys( guest.kind_options() ) ), [ postcard, keychain ] )
				$mol_assert_equal( ours( Object.keys( guest.fandom_options() ) ), [ mlp, genshin, knight ] )

				$mol_assert_equal( guest.Product_add().hidden(), true )
				$mol_assert_equal( guest.Settings_button(), null )
				const item = card( guest, kit )
				$mol_assert_equal( item.changed(), false )
				$mol_assert_equal( item.Admin(), null )

				const guest_settings = guest.Settings() as $$.$bog_merchquarium_settings
				$mol_assert_equal( guest_settings.body(), [ guest_settings.Account_section(), guest_settings.Categories_section(), guest_settings.Fandoms_section() ] )
				$mol_assert_equal( guest_settings.Categories().content(), [ guest_settings.Categories().List() ] )
			} )
		},

		async 'e2e 11: visitor card shows price and tags but hides empty description'() {
			await step( ()=> {
				const first = card( guest, kit )
				const second = card( guest, pinkie )
				$mol_assert_equal( first.info_rows(), [ first.Title(), first.Price_text(), first.Tags() ] )
				$mol_assert_equal( first.price_text(), '400 ₽' )
				$mol_assert_equal( second.info_rows(), [ second.Title(), second.Price_text(), second.Description_text(), second.Tags() ] )
			} )
		},

		async 'e2e 12: visitor fills the cart from cards'() {
			await step( ()=> {
				const cart = guest.Cart() as $$.$bog_merchquarium_cart
				cart.clear()

				const first = card( guest, kit )
				const second = card( guest, pinkie )
				first.cart_add()
				first.Cart_counter().inc()
				second.cart_add()
				second.Cart_counter().inc()
				second.Cart_counter().dec()
				$mol_assert_equal( first.cart_controls(), [ first.Cart_counter() ] )
				$mol_assert_equal( guest.cart_size_text(), '3' )

				const third = card( guest, sticker )
				third.cart_add()
				third.Cart_counter().dec()
				$mol_assert_equal( third.cart_controls(), [ third.Cart_add() ] )

				$mol_assert_equal( cart.lines().length, 2 )
				$mol_assert_equal( cart.total_text(), cart.Total_text().replace( '{total}', '1 100' ) )
				$mol_assert_equal( cart.send_title(), cart.Send_title() )
				$mol_assert_equal( $bog_merchquarium_order_decode( link, order_code( cart ) ), {
					[ first.product_link() ]: 2,
					[ second.product_link() ]: 1,
				} )
			} )
		},

		async 'e2e 13: sold out product stays in place for the author, muted at the end for the visitor and drops out of the order'() {
			await step( ()=> {
				card( artist, pinkie ).Status().option_checked( 'sold', true )
				$mol_assert_equal( titles( artist ), [ kit, pinkie, paimon, sticker ] )
			} )
			await sync_guest()

			await step( ()=> {
				const item = card( guest, pinkie )
				$mol_assert_equal( titles( guest ), [ kit, sticker, pinkie ] )
				$mol_assert_equal( item.attr().bog_merchquarium_product_card_state, 'sold' )
				$mol_assert_equal( item.cover().includes( item.Sold_badge() ), true )
				$mol_assert_equal( item.cart_controls(), [ item.Want() ] )
				$mol_assert_equal( item.want_title(), item.Want_title() )
				$mol_assert_equal( card( guest, kit ).cover().includes( card( guest, kit ).Sold_badge() ), false )

				$mol_assert_equal( guest.filters().includes( guest.In_stock() ), true )
				guest.in_stock_only( true )
				$mol_assert_equal( titles( guest ), [ kit, sticker ] )
				guest.in_stock_only( false )
				$mol_assert_equal( titles( guest ), [ kit, sticker, pinkie ] )
			} )

			const telegram = mock_dom()
			const want = want_card( telegram.context, pinkie )
			await step( ()=> {
				want.want()
				$mol_assert_equal( telegram.opened, [ `https://t.me/NaftulKittenArt?text=${ encodeURIComponent( want.want_message() ) }` ] )
				$mol_assert_equal( want.title(), pinkie )
			} )

			await step( ()=> {
				const cart = guest.Cart() as $$.$bog_merchquarium_cart
				const first = card( artist, kit )
				const second = card( artist, pinkie )
				$mol_assert_equal( cart.line_title( second.product_link() ), `${ pinkie } · ${ cart.Unavailable() }` )
				$mol_assert_equal( cart.line_sum( second.product_link() ), '' )
				$mol_assert_equal( cart.total_text(), cart.Total_text().replace( '{total}', '800' ) )
				$mol_assert_equal( $bog_merchquarium_order_decode( link, order_code( cart ) ), { [ first.product_link() ]: 2 } )
			} )
		},

		async 'e2e 14: author previews the catalog as a visitor and opens help'() {
			await step( ()=> {
				$mol_assert_equal( guest.Preview(), null )
				$mol_assert_equal( guest.Help_button(), null )
				$mol_assert_unique( artist.Preview(), null )

				artist.preview( true )
				const item = card( artist, kit )
				$mol_assert_equal( titles( artist ), [ kit, sticker, pinkie ] )
				$mol_assert_equal( artist.Product_add().hidden(), true )
				$mol_assert_equal( item.changed(), false )
				$mol_assert_equal( item.Admin(), null )
				$mol_assert_equal( item.info_rows(), [ item.Title(), item.Price_text(), item.Tags() ] )
				$mol_assert_equal( ours( Object.keys( artist.kind_options() ) ), [ postcard, keychain ] )

				artist.preview( false )
				$mol_assert_equal( titles( artist ), [ kit, pinkie, paimon, sticker ] )
				$mol_assert_equal( artist.Product_add().hidden(), false )
				$mol_assert_equal( card( artist, kit ).changed(), true )

				artist.settings_toggle()
				artist.Help_button().checked( true )
				$mol_assert_equal( artist.settings_open(), false )
				$mol_assert_equal( artist.content(), [ artist.Help() ] )
				$mol_assert_equal( artist.head(), [ artist.Title(), artist.Product_add(), artist.Tools() ] )
				$mol_assert_equal( artist.Help().rows().length, 9 )
				$mol_assert_equal( artist.Preview(), null )

				artist.Help_button().checked( false )
				$mol_assert_equal( artist.content(), [ artist.Catalog_selected() ] )
			} )
		},

		async 'e2e 15: artist opens the order link'() {
			await step( ()=> {
				const code = order_code( guest.Cart() as $$.$bog_merchquarium_cart )
				const first = card( artist, kit )
				const order = artist.Order() as $$.$bog_merchquarium_cart
				order.items = ()=> $bog_merchquarium_order_decode( link, code )
				$mol_assert_equal( order.heading(), order.Order_title() )
				$mol_assert_equal( order.lines().length, 1 )
				$mol_assert_equal( order.line_sum( first.product_link() ), '800 ₽' )
				$mol_assert_equal( order.rows().includes( order.Actions() ), false )
			} )
		},

		async 'e2e 16: request to VK is copied first and opened on the second press'() {
			await step( ()=> settings.social_link( 'https://vk.com/nyaftulkittenart' ) )
			await sync_guest()

			const { context, opened, copied } = mock_dom()
			const cart = $$.$bog_merchquarium_cart.make({ $: context })
			cart.catalog_link = ()=> link
			cart.items = ()=> guest.cart()
			const want = want_card( context, pinkie )

			await step( ()=> {
				want.want()
				$mol_assert_equal( copied, [ want.want_message() ] )
				$mol_assert_equal( opened, [] )
				$mol_assert_equal( want.want_title(), want.Want_copied_title().replace( '{social}', 'VK' ) )
				want.want()
				$mol_assert_equal( opened, [ 'https://vk.com/nyaftulkittenart' ] )
				opened.length = copied.length = 0
			} )

			await step( ()=> {
				$mol_assert_equal( cart.send_title(), cart.Copy_title() )

				cart.send()
				$mol_assert_equal( copied, [ cart.message() ] )
				$mol_assert_equal( opened, [] )
				$mol_assert_equal( cart.send_title(), cart.Copied_title().replace( '{social}', 'VK' ) )
				$mol_assert_equal( cart.rows().includes( cart.Send_hint() ), true )

				cart.send()
				$mol_assert_equal( opened, [ 'https://vk.com/nyaftulkittenart' ] )
			} )

			await step( ()=> settings.social_link( '@NaftulKittenArt' ) )
			await sync_guest()
			await step( ()=> {
				$mol_assert_equal( cart.send_title(), cart.Send_title() )
				cart.send()
				$mol_assert_equal( opened.at( -1 ), `https://t.me/NaftulKittenArt?text=${ encodeURIComponent( cart.message() ) }` )
			} )
		},

		async 'e2e 17: dropping a fandom clears it everywhere'() {
			await step( ()=> {
				$mol_assert_equal( settings.fandom_usage( mlp ), 2 )
				settings.fandom_drop( mlp )
				$mol_assert_equal( ours( settings.fandom_items() ), [ genshin, knight ] )
				$mol_assert_equal( settings.fandom_usage( mlp ), 0 )
				$mol_assert_equal( card( artist, kit ).fandoms(), [] )
			} )
			await sync_guest()
			await step( ()=> $mol_assert_equal( ours( Object.keys( guest.fandom_options() ) ), [ genshin, knight ] ) )
		},

		async 'e2e 18: hiding from search engines reaches the visitor and is undone'() {
			await step( ()=> settings.listed( false ) )
			await sync_guest()
			await step( ()=> $mol_assert_equal( guest.catalog()!.Hidden()!.val(), true ) )

			await step( ()=> settings.listed( true ) )
			await sync_guest()
			await step( ()=> $mol_assert_equal( guest.catalog()!.Hidden()!.val(), false ) )

			$$.$mol_log3_done({
				place: '$bog_merchquarium_e2e',
				message: 'e2e catalog',
				url: artist.$.$mol_state_arg.make_link({ catalog: link }),
			})
		},

	}

	$mol_test({

		async 'e2e runs with test=1 in browser and only when Giper Baza responds'( $ ) {
			if( !$bog_merchquarium_test_allowed() ) {
				$$.$mol_log3_warn({
					place: '$bog_merchquarium_e2e',
					message: 'e2e skipped in browser without test=1',
					hint: 'add test=1 to the url',
				})
				return
			}

			const master = $.$giper_baza_yard.masters()[ 0 ]
			const alive = await fetch( master, { signal: AbortSignal.timeout( 700 ) } ).then( res => res.ok, ()=> false )

			if( !alive ) {
				$$.$mol_log3_warn({
					place: '$bog_merchquarium_e2e',
					message: 'Giper Baza is not responding, e2e skipped',
					hint: master,
				})
				return
			}

			$mol_test_all.push( ... Object.values( scenario ) )
		},

	})

}
