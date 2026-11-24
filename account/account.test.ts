namespace $.$$ {

	$mol_test({

		async 'key is hidden until asked, scanned key needs confirm, garbage is rejected'( $ ) {

			const auth = await $.$giper_baza_auth._generate()
			const key = auth.toString() + auth.toStringPrivate()
			const account = $bog_merchquarium_account.make({ $, grant: ()=> null })
			let entered = ''
			account.enter = auth => { entered = auth.toString() + auth.toStringPrivate() }

			$mol_assert_equal( account.parts().includes( account.Qr() ), false )
			account.Show().checked( true )
			$mol_assert_equal( account.parts().includes( account.Qr() ), true )
			$mol_assert_equal( account.Qr().uri(), account.key() )

			account.Scan().found( 'https://example.org/' )
			$mol_assert_equal( account.error(), account.error_bad() )
			account.import()
			$mol_assert_equal( account.armed(), false )

			account.Scan().found( key )
			$mol_assert_equal( account.error(), '' )
			account.import()
			$mol_assert_equal( account.armed(), true )
			$mol_assert_equal( entered, '' )
			account.import()
			$mol_assert_equal( entered, key )

		},

	})

}
