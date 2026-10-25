namespace $.$$ {
	export class $bog_merchquarium_tags extends $.$bog_merchquarium_tags {

		content() {
			return this.editable() ? [ this.Form(), this.List() ] : [ this.List() ]
		}

		rows() {
			return this.items().map( name => this.Row( name ) )
		}

		name( name: string ) {
			return this.marker() + name
		}

		usage_text( name: string ) {
			return String( this.usage( name ) )
		}

		@ $mol_mem_key
		Remove( name: string ) {
			return this.editable() ? super.Remove( name ) : null!
		}

		@ $mol_mem
		draft( next?: string ) {
			return next ?? ''
		}

		@ $mol_action
		submit() {
			const name = this.draft().trim()
			if( !name ) return
			if( !this.items().includes( name ) ) this.item_add( name, null )
			this.draft( '' )
		}

		@ $mol_action
		remove( name: string ) {
			if( this.usage( name ) ) return this.confirming( name, true )
			this.item_drop( name, null )
		}

		@ $mol_action
		cancel( name: string ) {
			this.confirming( name, false )
		}

		@ $mol_action
		confirm( name: string ) {
			this.confirming( name, false )
			this.item_drop( name, null )
		}

	}
}
