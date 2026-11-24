namespace $ {

	/** Gives full rights on Land to Pass, signed by another key which already rules it */
	export async function $bog_merchquarium_handover( this: $, land: $giper_baza_land, from: $giper_baza_auth, to: $giper_baza_auth_pass ) {

		const colony = this.$giper_baza_land.make({
			$: this,
			link: $mol_const( land.link() ),
			auth: $mol_const( from ),
		})

		const units = await $mol_wire_async( land ).diff_units()
		const rights = units.filter( unit => !( unit instanceof $giper_baza_unit_sand ) )

		await $mol_wire_async( colony ).diff_apply( rights, 'skip_load' )
		await $mol_wire_async( colony ).give( to, $giper_baza_rank_rule )
		await $mol_wire_async( land ).units_steal( colony )

		land.broadcast()

	}

}
