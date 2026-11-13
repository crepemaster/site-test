const line = (label, value) => value ? `<dt>${label}</dt><dd>${esc(value)}</dd>` : ''

setup('programmation').then(async site => {
  const box = $('.artiste')
  const id = new URLSearchParams(location.search).get('id')
  const artists = await loadArtists()
  const index = artists.findIndex(a => a.id === id)
  const a = artists[index]

  if (!a) {
    box.innerHTML = `<p>Artiste introuvable. <a href="programmation.html">Retour à la programmation</a></p>`
    return
  }

  document.title = `${a.nom} — ${site.nom}`
  const yt = youtubeId(a.youtube)
  const link = safeUrl(a.lien)
  const next = artists[(index + 1) % artists.length]

  box.innerHTML = `
    <a class="retour" href="programmation.html">&larr; Programmation</a>

    <article class="fiche">
      ${a.photo ? `<img src="${esc(a.photo)}" alt="${esc(a.nom)}">` : ''}
      <div>
        <h1>${esc(a.nom)}</h1>
        ${a.style ? `<p class="style">${esc(a.style)}</p>` : ''}
        <dl>
          ${line('Scène', a.scene)}
          ${line('Jour', a.jour)}
          ${line('Heure', a.heure)}
        </dl>
        <p class="description">${esc(a.description)}</p>
        ${link ? `<a class="lien" href="${esc(link)}" target="_blank" rel="noopener">En savoir plus &nearr;</a>` : ''}
      </div>
    </article>

    ${yt ? `<div class="video">
      <iframe src="https://www.youtube-nocookie.com/embed/${yt}" title="${esc(a.nom)}"
        allow="encrypted-media; picture-in-picture" allowfullscreen></iframe>
    </div>` : ''}

    ${next !== a ? `<a class="suivant" href="artiste.html?id=${next.id}">${esc(next.nom)} &rarr;</a>` : ''}`
})
