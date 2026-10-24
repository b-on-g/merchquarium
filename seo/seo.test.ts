namespace $ {

	const template = `<!doctype html>
<html lang="ru" mol_view_root>
	<head>
		<meta charset="utf-8" />
		<title>Old</title>
		<meta name="description" content="Old" />
		<link rel="canonical" href="https://old/" />
		<meta
			property="og:title"
			content="Old"
		/>
	</head>
	<body mol_view_root>
		<div mol_view_root="$bog_prilavok_app"></div>
		<script src="web.js"></script>
	</body>
</html>`

	const catalog: $bog_prilavok_seo_catalog = {
		link: 'AAAAAAAA_BBBBBBBB',
		url: 'https://prilavok.example/?catalog=AAAAAAAA_BBBBBBBB',
		title: 'Kitten <Art>',
		products: [
			{ title: 'Mat', price: 1200, description: 'Soft', category: 'Mats', available: true, cover: 'https://prilavok.example/mat.webp?BAZA:file=X' },
			{ title: 'Case', price: 0, description: '', category: '', available: false, cover: '' },
		],
	}

	$mol_test({

		'SEO page replaces meta and keeps one title'() {
			const html = $bog_prilavok_seo_page( template, catalog )
			$mol_assert_equal( html.match( /<title>/g )!.length, 1 )
			$mol_assert_equal( html.includes( 'Old' ), false )
			$mol_assert_equal( html.includes( '<title>Kitten &#60;Art&#62;</title>' ), true )
			$mol_assert_equal( html.includes( '<link rel="canonical" href="https://prilavok.example/?catalog=AAAAAAAA_BBBBBBBB" />' ), true )
			$mol_assert_equal( html.includes( '<meta property="og:image" content="https://prilavok.example/mat.webp?BAZA:file=X" />' ), true )
		},

		'SEO page prerenders products into app root'() {
			const html = $bog_prilavok_seo_page( template, catalog )
			$mol_assert_equal( html.includes( '<div mol_view_root="$bog_prilavok_app"><main><h1>Kitten &#60;Art&#62;</h1>' ), true )
			$mol_assert_equal( html.includes( '<h2>Mat</h2><p>1200 ₽</p><p>Soft</p><p>Mats</p>' ), true )
			$mol_assert_equal( html.includes( '<article><h2>Case</h2><p>Товар закончился</p></article>' ), true )
		},

		'SEO page boots app with catalog hash before bundle'() {
			const html = $bog_prilavok_seo_page( template, catalog )
			const boot = html.indexOf( '#!catalog=AAAAAAAA_BBBBBBBB' )
			$mol_assert_equal( boot > 0 && boot < html.indexOf( '<script src="web.js"' ), true )
		},

		'SEO structured data lists offers'() {
			const ld = $bog_prilavok_seo_ld( catalog )
			$mol_assert_equal( ld.itemListElement.length, 2 )
			$mol_assert_equal( ld.itemListElement[0].item.offers.price, 1200 )
			$mol_assert_equal( ld.itemListElement[1].item.offers.availability, 'https://schema.org/OutOfStock' )
		},

		'SEO sitemap escapes urls'() {
			$mol_assert_equal(
				$bog_prilavok_seo_sitemap([ 'https://a/?x=1&y=2' ]),
				'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://a/?x=1&#38;y=2</loc></url></urlset>',
			)
		},

	})
}
