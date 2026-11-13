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

  // arrows
  const step = () => track.clientWidth * 0.8
  $('.prev').onclick = () => track.scrollBy({ left: -step(), behavior: 'smooth' })
  $('.next').onclick = () => track.scrollBy({ left: step(), behavior: 'smooth' })
})
