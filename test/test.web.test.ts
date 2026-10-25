namespace $ {

	export function $bog_merchquarium_test_allowed() {
		return /[?&#!/]test=1(?![^&/#])/.test( $mol_dom_context.location.href )
	}

	export function $bog_merchquarium_test_context( $: $ ) {
		return $$ as $
	}

	export async function $bog_merchquarium_test_image( name: string ) {
		const url = new URL( `/bog/merchquarium/assets-test/${ name }`, $mol_dom_context.location.href )
		const blob = await ( await fetch( url ) ).blob()
		return new File( [ blob ], name, { type: blob.type } )
	}

}
