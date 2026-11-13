// flickr album -> list of photo urls
async function flickrPhotos(key, album) {
  if (!key || !album) throw new Error('flickr off')
  const api = params => fetch('https://api.flickr.com/services/rest/?' + new URLSearchParams({
    ...params, api_key: key, format: 'json', nojsoncallback: 1
  })).then(r => r.json())

  const id = (album.match(/(?:albums|sets)\/(\d+)/) || [, album.trim()])[1]
  const params = { method: 'flickr.photosets.getPhotos', photoset_id: id, extras: 'url_l,url_c' }

  // owner id, needed when the url uses a username
  if (/^https?:/.test(album)) {
    const user = await api({ method: 'flickr.urls.lookupUser', url: album })
    if (user.stat === 'ok') params.user_id = user.user.id
  }

  const data = await api(params)
  if (data.stat !== 'ok') throw new Error(data.message)
  const photos = data.photoset.photo.map(p => p.url_l || p.url_c).filter(Boolean)
  if (!photos.length) throw new Error('empty album')
  return photos
}

function slideshow(box, photos, delay) {
  let i = 0
  const next = () => {
    const img = new Image()
    img.onload = () => {
      const old = [...box.querySelectorAll('img')]
      box.append(img)
      img.offsetWidth
      img.classList.add('on')
      setTimeout(() => old.forEach(o => o.remove()), 1500)
    }
    img.alt = ''
    img.src = photos[i++ % photos.length]
  }
  next()
  setInterval(next, delay)
}

function video(box, a) {
  const yt = youtubeId(a.video_youtube)
  if (yt) {
    box.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&mute=1&loop=1&playlist=${yt}&controls=0&playsinline=1"
      title="Vidéo" allow="autoplay; encrypted-media" allowfullscreen></iframe>`
  } else if (a.video) {
    box.innerHTML = `<video src="${esc(asset(a.video))}" autoplay muted loop playsinline></video>`
  } else {
    box.remove()
  }
}

setup('accueil').then(async site => {
  const a = site.accueil || {}
  const box = $('.diaporama')
  try {
    const photos = shuffle(await flickrPhotos(a.flickr_cle_api, a.flickr_album))
    slideshow(box, photos, (a.intervalle || 5) * 1000)
    if (safeUrl(a.flickr_album)) {
      box.insertAdjacentHTML('beforeend', `<a class="credit" href="${esc(a.flickr_album)}" target="_blank" rel="noopener">voir l'album</a>`)
    }
  } catch (e) {
    video(box, a)
  }
})
