setup('programmation').then(async site => {
  const p = site.programmation || {}
  $('.titre-page').textContent = p.titre || 'Programmation'
  $('.intro').textContent = p.intro || ''

  const artists = shuffle(await loadArtists())
  const track = $('.piste')

  track.innerHTML = artists.map(a => `
    <a class="carte" href="artiste.html?id=${a.id}">
      <img src="${esc(a.photo)}" alt="" loading="lazy">
      <span class="nom">${esc(a.nom)}</span>
      <span class="info">${esc([a.jour, a.scene].filter(Boolean).join(' · '))}</span>
    </a>`).join('')

  // arrows, back to the other end when reaching the edge
  const step = () => track.clientWidth * 0.8
  const end = () => track.scrollWidth - track.clientWidth - 5

  $('.next').onclick = () => track.scrollLeft >= end()
    ? track.scrollTo({ left: 0, behavior: 'smooth' })
    : track.scrollBy({ left: step(), behavior: 'smooth' })

  $('.prev').onclick = () => track.scrollLeft <= 5
    ? track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' })
    : track.scrollBy({ left: -step(), behavior: 'smooth' })
})
