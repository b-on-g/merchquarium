namespace $ {
	export class $bog_merchquarium_storage extends $mol_storage_web {

		@ $mol_mem
		static override estimate( next?: null ) {
			const estimate = $mol_wire_sync( this.native() ?? {} ).estimate()
			new this.$.$mol_after_timeout( 1000, $mol_wire_async( ()=> this.estimate( null ) ) )
			return estimate
		}

	}
	$.$mol_storage = $bog_merchquarium_storage
}
