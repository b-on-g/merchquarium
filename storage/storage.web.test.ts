namespace $ {
	$mol_test({

		'Storage estimate override replaces the self rescheduling one'() {
			$mol_assert_equal( $mol_storage, $bog_merchquarium_storage )
			$mol_assert_equal( $bog_merchquarium_storage.estimate.length, 0 )
		},

	})
}
