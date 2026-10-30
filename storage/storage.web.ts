namespace $ {
	export class $bog_merchquarium_storage extends $mol_storage_web {

		@ $mol_mem
		static override estimate() {
			$mol_state_time.now( 1000 )
			return $mol_wire_sync( this.native() ?? {} ).estimate()
		}

	}
	$.$mol_storage = $bog_merchquarium_storage
}
