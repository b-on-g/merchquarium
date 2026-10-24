namespace $ {

	export function $bog_prilavok_test_allowed() {
		return /[?&#!/]test=1(?![^&/#])/.test( $mol_dom_context.location.href )
	}

	export function $bog_prilavok_test_context( $: $ ) {
		return $$ as $
	}

	export async function $bog_prilavok_test_image( name: string ) {
		const url = new URL( `/bog/prilavok/assets-test/${ name }`, $mol_dom_context.location.href )
		const blob = await ( await fetch( url ) ).blob()
		return new File( [ blob ], name, { type: blob.type } )
	}

}
