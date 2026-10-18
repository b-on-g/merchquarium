namespace $ {

	const AUTH0 = '_7bJySpjwMJr-9xpQtl3XIQhiiHIAJ3mJGJ9Z8XJXOMbKLhjUHMrA4RZzmscCgO0c7xnXnw_UFhwhDN7CRHOTca4x_vAJdIvjnNNRkBaYqJJRHBiLn6Cjf1Iv7ZYsHBZQZ72WxwYK8xKs8L3Kokv5RZ-jqBoozqc8JIFI1DWayJM'
	const AUTH1 = '_zOldFN6un21Kk9V_Z51D84ZJXdDoSfkxZZl5iNdSJ8mN-zcOuKh0tUTajmynoVmYG73krPQXIkIlGLAEwx5n03Fju-SIG0_fENxSNDRH8Pukvibs6nnMDPgXCYRvJi6gL8ZVwedP7LYkwa1qpsaUN7nmjWvhkkgVcVMLYK0Jk7g'

	$mol_test({

		'grant rights to second account by its id, then read rank via debug info': $mol_wire_async( ( $: $ )=> {

			const auth0 = $.$giper_baza_auth.from( AUTH0 )
			const auth1 = $.$giper_baza_auth.from( AUTH1 )

			$giper_baza_auth.current( auth0 )
			const land = $.$giper_baza_glob.land_grab()

			const catalog = land.Data( $bog_nka_catalog )
			const products = catalog.Products( null )
			if( !products ) throw new Error( 'Products list is missing' )

			products.make( null )
			products.make( null )
			products.make( null )

			const available = [ true, false, true ]
			available.forEach( ( is_available, index ) => {
				products.remote_list()[ index ].Available( null )?.val( is_available )
			} )

			const settings_owner = $bog_nka_settings.make({ $ })
			settings_owner.catalog_link = ()=> land.link().str

			$mol_assert_equal( settings_owner.debug_info(), 'Rank: rule; Products: 3 (2 available)' )

			// Owner grants to the second account by its public id
			settings_owner.grant( auth1.pass().toString() )

			// Switch to the second account and check it reads as admin now
			$giper_baza_auth.current( auth1 )
			const settings_guest = $bog_nka_settings.make({ $ })
			settings_guest.catalog_link = ()=> land.link().str

			$mol_assert_equal( settings_guest.debug_info(), 'Rank: rule; Products: 3 (2 available)' )

		} ),

		'grant rejects an invalid account id': $mol_wire_async( ( $: $ )=> {

			$giper_baza_auth.current( $.$giper_baza_auth.from( AUTH0 ) )
			const land = $.$giper_baza_glob.land_grab()

			const settings = $bog_nka_settings.make({ $ })
			settings.catalog_link = ()=> land.link().str

			$mol_assert_equal( settings.grant( 'not-a-valid-id' ), undefined )

		} ),

	})

}