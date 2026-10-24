namespace $ {

	export type $bog_prilavok_theme_preset = {
		hue: number
		spread: number
		round: string
		font: string
		pattern: 'none' | 'decor' | 'dots' | 'grid' | 'stripes'
		card: 'soft' | 'dashed' | 'outline'
		photo: 'full' | 'polaroid' | 'round'
		decor: string
	}

	const rounded = 'ui-rounded, system-ui, sans-serif'
	const serif = 'ui-serif, Georgia, serif'

	export const $bog_prilavok_theme = {
		sakura: { hue: 340, spread: 60, round: '1rem', font: rounded, pattern: 'decor', card: 'soft', photo: 'polaroid', decor: '🌸' },
		lavender: { hue: 290, spread: 50, round: '1rem', font: rounded, pattern: 'dots', card: 'dashed', photo: 'round', decor: '🦄' },
		mint: { hue: 165, spread: 60, round: '1rem', font: rounded, pattern: 'grid', card: 'soft', photo: 'full', decor: '🌿' },
		peach: { hue: 30, spread: 40, round: '1rem', font: rounded, pattern: 'stripes', card: 'outline', photo: 'polaroid', decor: '🍑' },
		sky: { hue: 220, spread: 50, round: '1rem', font: rounded, pattern: 'dots', card: 'soft', photo: 'round', decor: '☁️' },
		milk: { hue: 60, spread: 30, round: '.5rem', font: serif, pattern: 'none', card: 'outline', photo: 'polaroid', decor: '🐾' },
		classic: { hue: 240, spread: 90, round: '.25rem', font: 'system-ui, sans-serif', pattern: 'none', card: 'soft', photo: 'full', decor: '' },
	} satisfies Record< string, $bog_prilavok_theme_preset >

	export type $bog_prilavok_theme_name = keyof typeof $bog_prilavok_theme

	export function $bog_prilavok_theme_of( name: string | null | undefined ): $bog_prilavok_theme_preset {
		return $bog_prilavok_theme[ name as $bog_prilavok_theme_name ] ?? $bog_prilavok_theme.sakura
	}

	const tint = ( alpha: number )=> `oklch( 70% .12 var(--mol_theme_hue) / ${ alpha } )`

	function pattern( preset: $bog_prilavok_theme_preset ) {
		switch( preset.pattern ) {
			case 'decor': {
				const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><text x="8" y="28" font-size="18" opacity=".18">${ preset.decor }</text><text x="40" y="60" font-size="14" opacity=".12">${ preset.decor }</text></svg>`
				return { image: `url("data:image/svg+xml,${ encodeURIComponent( svg ) }")`, size: '4rem 4rem' }
			}
			case 'dots': return { image: `radial-gradient( circle, ${ tint( .35 ) } 1.5px, transparent 2px )`, size: '1.25rem 1.25rem' }
			case 'grid': return {
				image: `linear-gradient( ${ tint( .15 ) } 1px, transparent 1px ), linear-gradient( 90deg, ${ tint( .15 ) } 1px, transparent 1px )`,
				size: '1.5rem 1.5rem',
			}
			case 'stripes': return { image: `repeating-linear-gradient( 45deg, ${ tint( .1 ) } 0 .75rem, transparent .75rem 1.5rem )`, size: 'auto' }
			default: return { image: 'none', size: 'auto' }
		}
	}

	const card_border = {
		soft: { style: 'none', width: '0' },
		dashed: { style: 'dashed', width: '2px' },
		outline: { style: 'solid', width: '2px' },
	}

	const photo_frame = {
		full: { inset: '0', round: '0' },
		polaroid: { inset: '.75rem', round: 'var(--mol_gap_round)' },
		round: { inset: '.75rem', round: '50%' },
	}

	export function $bog_prilavok_theme_style( name: string | null | undefined ) {
		const preset = $bog_prilavok_theme_of( name )
		const back = pattern( preset )
		const photo = photo_frame[ preset.photo ]
		const border = card_border[ preset.card ]
		return {
			'--mol_theme_hue': `${ preset.hue }deg`,
			'--mol_theme_hue_spread': `${ preset.spread }deg`,
			'--mol_gap_round': preset.round,
			'--bog_prilavok_pattern': back.image,
			'--bog_prilavok_pattern_size': back.size,
			'--bog_prilavok_card_border_style': border.style,
			'--bog_prilavok_card_border_width': border.width,
			'--bog_prilavok_photo_inset': photo.inset,
			'--bog_prilavok_photo_round': photo.round,
			'--bog_prilavok_decor': JSON.stringify( preset.decor ),
			fontFamily: preset.font,
		}
	}

	export function $bog_prilavok_theme_swatch( name: string ) {
		const { hue } = $bog_prilavok_theme_of( name )
		return {
			background: `linear-gradient( 135deg, oklch( 93% .04 ${ hue } ) 50%, oklch( 72% .15 ${ hue } ) 50% )`,
		}
	}

}
