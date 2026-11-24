namespace $ {

	$mol_test({

		async 'old key hands catalog over to app key'( $ ) {

			const land = await $mol_wire_async( $.$giper_baza_glob ).land_grab()
			new $mol_wire_atom( 'bog_merchquarium_handover_test', ()=> $.$giper_baza_glob.Land( land.link() ) ).fresh()

			const data = land.Data( $bog_merchquarium_catalog )
			await $mol_wire_async( ()=> { data.Title( null )!.val( 'Киты' ) } )()

			const old = $.$giper_baza_auth.current()
			const fresh = await $.$giper_baza_auth._generate()
			$mol_assert_equal( land.lord_rank( fresh.pass().lord() ), $giper_baza_rank_read )

			await $.$bog_merchquarium_handover( land, old, fresh.pass() )

			$mol_assert_equal( land.lord_rank( fresh.pass().lord() ), $giper_baza_rank_rule )
			$mol_assert_equal( land.lord_rank( old.pass().lord() ), $giper_baza_rank_rule )
			$mol_assert_equal( data.Title()!.val(), 'Киты' )

		},

	})

}
