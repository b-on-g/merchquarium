namespace $ {

	export type $bog_nka_theme_preset = {
		hue: number
		spread: number
		round: string
		font: string
	}

	const rounded = 'ui-rounded, system-ui, sans-serif'
	const serif = 'ui-serif, Georgia, serif'

	export const $bog_nka_theme = {
		sakura: { hue: 340, spread: 60, round: '1rem', font: rounded },
		lavender: { hue: 290, spread: 50, round: '1rem', font: rounded },
		mint: { hue: 165, spread: 60, round: '1rem', font: rounded },
		peach: { hue: 30, spread: 40, round: '1rem', font: rounded },
		sky: { hue: 220, spread: 50, round: '1rem', font: rounded },
		milk: { hue: 60, spread: 30, round: '.5rem', font: serif },
		classic: { hue: 240, spread: 90, round: '.25rem', font: 'system-ui, sans-serif' },
	} satisfies Record< string, $bog_nka_theme_preset >

	export type $bog_nka_theme_name = keyof typeof $bog_nka_theme

	export function $bog_nka_theme_of( name: string | null | undefined ): $bog_nka_theme_preset {
		return $bog_nka_theme[ name as $bog_nka_theme_name ] ?? $bog_nka_theme.sakura
	}

	export function $bog_nka_theme_style( name: string | null | undefined ) {
		const preset = $bog_nka_theme_of( name )
		return {
			'--mol_theme_hue': `${ preset.hue }deg`,
			'--mol_theme_hue_spread': `${ preset.spread }deg`,
			'--mol_gap_round': preset.round,
			fontFamily: preset.font,
		}
	}

}
