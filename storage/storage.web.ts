namespace $ {
	export class $bog_merchquarium_storage extends $mol_storage_web {

		@ $mol_mem
		static override estimate( next?: null ) {
			try {
				const estimate = $mol_wire_sync( this.native() ?? {} ).estimate()
				new this.$.$mol_after_timeout( 1000, $mol_wire_async( ()=> this.estimate( null ) ) )
				return estimate
			} catch( error ) {
				if( !$mol_promise_like( error ) ) new this.$.$mol_after_timeout( 1000, $mol_wire_async( ()=> this.estimate( null ) ) )
				$mol_fail_hidden( error )
			}
		}

	}
	$.$mol_storage = $bog_merchquarium_storage
}
