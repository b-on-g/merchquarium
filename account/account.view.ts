namespace $.$$ {

	export type $bog_merchquarium_account_grant = $bog_id_login_grant & { done?: boolean }

	export class $bog_merchquarium_account extends $.$bog_merchquarium_account {

		auto() {
			this.id_resolving()
		}

		key() {
			const auth = this.$.$giper_baza_auth.current()
			return auth.toString() + auth.toStringPrivate()
		}

		blob() {
			return new Blob( [ this.key() ], { type: 'text/plain' } )
		}

		parts() {
			return [
				this.Id_enter(),
				... this.id_status() ? [ this.Id_status() ] : [],
				... this.id_conflicted() ? [ this.Id_replace() ] : [],
				this.Show(),
				... this.shown() ? [ this.Warning(), this.Qr(), this.Key_text(), this.Keep() ] : [],
				this.Enter(),
				... this.entering() ? [ this.Scan(), this.Field(), this.Load() ] : [],
				... this.error() ? [ this.Error() ] : [],
			]
		}

		grant( next?: $bog_merchquarium_account_grant | null ) {
			return this.$.$mol_state_local.value( 'bog_merchquarium_grant', next ) ?? null
		}

		id_enter() {
			this.error( '' )
			const pass = this.$.$giper_baza_auth.current().pass().toString()
			this.$.$bog_id_login( this.provider(), pass, this.scope() )
				.then( grant => this.grant( grant ) )
				.catch( error => this.error( error.message ) )
		}

		@ $mol_mem
		id_key() {
			const grant = this.grant()
			if( !grant || grant.done ) return ''
			return this.$.$bog_id_key( grant.pointer, this.key() )
		}

		id_key_ready() {
			try {
				return this.id_key()
			} catch( error ) {
				if( !$mol_promise_like( error ) ) $mol_fail_log( error )
				return ''
			}
		}

		id_conflicted() {
			const key = this.id_key_ready()
			return Boolean( key ) && key !== this.key() && this.$.$bog_merchquarium_home_links().length > 0
		}

		@ $mol_mem
		id_resolving() {

			const key = this.id_key_ready()
			if( !key || this.id_conflicted() ) return null

			return new this.$.$mol_after_tick( ()=> this.id_apply( key ) )
		}

		id_apply( key: string ) {
			const auth = this.auth_from( key )
			if( !auth ) return this.error( this.error_bad() )
			this.grant({ ... this.grant()!, done: true })
			if( key !== this.key() ) this.enter( auth )
		}

		id_replace() {
			this.id_apply( this.id_key() )
		}

		id_status() {
			const grant = this.grant()
			if( !grant ) return ''
			if( grant.done ) return this.id_done().replace( '{name}', ()=> grant.name || grant.lord )
			return this.id_conflicted() ? this.id_conflict() : this.id_wait()
		}

		auth_from( str: string ) {
			try {
				const auth = this.$.$giper_baza_auth.from( str )
				return auth.byteLength === 128 ? auth : null
			} catch( error ) {
				if( $mol_promise_like( error ) ) $mol_fail_hidden( error )
				return null
			}
		}

		@ $mol_action
		enter( auth: $giper_baza_auth ) {
			this.$.$giper_baza_auth.current( auth )
			this.$.$mol_dom_context.location.reload()
		}

		@ $mol_mem
		input( next?: string ) {
			if( next !== undefined ) this.armed( false )
			return next ?? ''
		}

		@ $mol_mem
		armed( next?: boolean ) {
			return next ?? false
		}

		import_title() {
			return this.armed() ? this.import_sure() : super.import_title()
		}

		@ $mol_action
		import() {

			const auth = this.auth_from( this.input().trim() )
			this.error( auth ? '' : this.error_bad() )
			if( !auth ) return

			if( !this.armed() ) {
				this.armed( true )
				return
			}

			this.grant( null )
			this.enter( auth )

		}

		@ $mol_action
		scanned( next?: string ) {
			if( next === undefined ) return ''
			const str = next.trim()
			this.input( str )
			this.error( this.auth_from( str ) ? '' : this.error_bad() )
			return str
		}

		file( next?: readonly File[] ) {
			if( next?.length ) $mol_wire_async( this ).file_read( next[ 0 ] )
			return [] as readonly File[]
		}

		file_read( file: File ) {
			this.scanned( $mol_wire_sync( file ).text() )
		}

	}

}
