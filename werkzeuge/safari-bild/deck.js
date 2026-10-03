// Skript für safari-bild: stellt das Deck auf /about (Desktop, ab 1024px) auf die Position aus dem
// Anker der Adresse, #t=7.5 = halb von Folie 8 zu 9 (wie werkzeuge/deck-film, vor der Ruhe-Glättung),
// wartet, bis es nachgeglitten ist, und gibt die Lage jeder Folie zurück (CSS-Pixel).
// #t=7.5&weiss=9 gibt Folie 9 wieder ihren weißen Kasten (Stand vor e031273), zum Vergleich.
await document.fonts.ready
const q = new URLSearchParams(location.hash.slice(1))
const t = parseFloat(q.get('t') ?? '0')
const track = document.querySelector('[data-deck-track]')
const n = Number(track.getAttribute('data-deck-track'))
const cards = [...track.querySelectorAll('.will-change-transform')]
for (const k of (q.get('weiss') ?? '').split(',').filter(Boolean)) {
  cards[Number(k) - 1].querySelector('.bg-hero').style.backgroundColor = '#FEFEFE'
}
const top = track.getBoundingClientRect().top + scrollY
scrollTo({ top: top + ((track.offsetHeight - innerHeight) * t) / (n - 1), behavior: 'instant' })
await new Promise((r) => setTimeout(r, 1500))
return {
  data: cards.map((c) => {
    const r = c.getBoundingClientRect()
    return { x: r.x, y: r.y, w: r.width, h: r.height, transform: c.style.transform, hidden: c.style.visibility === 'hidden' }
  }),
}
