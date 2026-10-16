namespace $ {

	$mol_test({

// 		'head button DOM follows visibility after tools button renders'($) {
// 			class TestApp extends $bog_nka_app {
// 				static $ = $
// 
// 				@ $mol_mem
// 				not_admin(next?: boolean) {
// 					return next ?? true
// 				}
// 
// 				is_not_admin() {
// 					return this.not_admin()
// 				}
// 			}
// 
// 			const app = TestApp.make({ $ })
// 			app.plugins = () => []
// 			app.body = () => []
// 			app.title = () => 'Catalog'
// 			app.Product_add().title = () => 'Add product'
// 			app.Settings_button().title = () => 'Settings'
// 			app.Category_filter().options = () => ({ all: 'All' })
// 			app.category_filter = () => 'all'
// 
// 			app.dom_tree()
// 
// 			const add_node = app.Product_add().dom_node() as HTMLElement
// 			const settings_node = app.Settings_button().dom_node() as HTMLElement
// 			$mol_assert_equal( add_node.style.display, 'none' )
// 			$mol_assert_equal( settings_node.style.display, 'none' )
// 
// 			app.not_admin( false )
// 			app.Settings_button().dom_tree()
// 
// 			$mol_assert_equal( app.Product_add().style().display, '' )
// 			$mol_assert_equal( add_node.style.display, app.Product_add().style().display )
// 			$mol_assert_equal( settings_node.style.display, '' )
// 		},
// 
		'product order survives repeated delete and undo': $mol_wire_async( ( $: $ )=> {
			const land = $.$giper_baza_glob.land_grab()
			const catalog = land.Data( $bog_nka_catalog )
			const products = catalog.Products( null )
			if( !products ) throw new Error( 'Products list is missing' )

			const app = $bog_nka_app.make({ $ })
			// app.focused = () => false
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

			app.product_delete( links[ 2 ] )
			app.product_delete( links[ 5 ] )
			app.product_undo( links[ 2 ] )
			app.product_delete( links[ 0 ] )
			app.product_undo( links[ 5 ] )
			app.product_undo( links[ 0 ] )
			
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
