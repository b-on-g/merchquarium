namespace $ {

	export type $bog_nka_photo_list = {
		make( config: null ): $giper_baza_file
	}

	export class $bog_nka_photo extends $mol_object {

		@ $mol_mem_key
		source( file: File ): Blob {
			const extension = file.name.split( '.' ).pop()?.toLowerCase()
			const detected_type = file.type.toLowerCase()
			const type = detected_type.startsWith( 'image/' )
				? detected_type
				: extension === 'jpg' || extension === 'jpeg'
					? 'image/jpeg'
					: extension === 'png'
						? 'image/png'
						: extension === 'webp'
							? 'image/webp'
							: detected_type
			return new Blob( [ file ], { type } )
		}

		@ $mol_mem_key
		picture( file: File ) {
			return $mol_picture.fit( this.source( file ), 1600 )
		}

		@ $mol_action
		async save( files: readonly File[], list: $bog_nka_photo_list ) {
			const prepared = await Promise.all( files.map( async file => {
				const blob = this.picture( file ).format( 'image/webp', .82 ) as unknown as Blob | null
				if( !blob ) return null

				const buffer = new Uint8Array( await blob.arrayBuffer() )
				const extension = blob.type === 'image/webp' ? 'webp' : blob.type === 'image/jpeg' ? 'jpg' : 'png'
				return { file, blob, buffer, extension }
			} ) )

			return prepared.flatMap( item => {
				if( !item ) return []
				const photo = list.make( null )
				photo.buffer( item.buffer )
				photo.type( item.blob.type || 'image/png' )
				photo.name( `${ item.file.name.replace( /\.[^/.]+$/, '' ) }.${ item.extension }` )
				return [ photo ]
			} )
		}

		@ $mol_mem_key
		url( link: string ): string {
			const file = this.$.$giper_baza_glob.Pawn( new this.$.$giper_baza_link( link ), $giper_baza_file )
			if( !file.filled() ) return ''
			return $yuf_url_object.from_blob( file.blob() ) + ''
		}

	}

}
