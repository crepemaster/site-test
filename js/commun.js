const $ = (sel, el = document) => el.querySelector(sel)

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[c]))

// paths from the cms start with "/", we keep them relative for github pages
const asset = p => !p ? '' : /^https?:/.test(p) ? p : p.replace(/^\/+/, '')

const safeUrl = u => /^https?:\/\//.test(u || '') ? u : ''

// no cache, so edits show up right away
async function load(url) {
  const res = await fetch(url + '?v=' + Date.now())
  if (!res.ok) throw new Error(url)
  return res
}

function shuffle(list) {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]]
  }
  return list
}

const slug = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

function youtubeId(url) {
  const m = (url || '').match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/)
  return m ? m[1] : null
}

// csv: comma or semicolon (excel), quotes, line breaks in cells
function parseCSV(text) {
  text = text.replace(/^﻿/, '')
  const head = text.split('\n')[0]
  const sep = (head.split(';').length > head.split(',').length) ? ';' : ','

  const rows = []
  let row = [], cell = '', quoted = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++ }
      else if (c === '"') quoted = false
      else cell += c
    }
    else if (c === '"') quoted = true
    else if (c === sep) { row.push(cell); cell = '' }
    else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = '' }
    else if (c !== '\r') cell += c
  }
  if (cell || row.length) { row.push(cell); rows.push(row) }

  const keys = rows.shift().map(k => k.trim().toLowerCase())
  return rows
    .filter(r => r.some(c => c.trim()))
    .map(r => Object.fromEntries(keys.map((k, i) => [k, (r[i] || '').trim()])))
}

async function loadArtists() {
  const rows = parseCSV(await (await load('data/artistes.csv')).text())
  return rows.filter(a => a.nom).map(a => ({
    ...a,
    id: slug(a.nom),
    photo: !a.photo ? '' : a.photo.includes('/') ? asset(a.photo) : 'images/artistes/' + a.photo
  }))
}

// banner, colours, footer
async function setup(page) {
  const site = await (await load('data/site.json')).json()
  const c = site.couleurs || {}
  const css = document.documentElement.style
  if (c.fond) css.setProperty('--fond', c.fond)
  if (c.texte) css.setProperty('--texte', c.texte)
  if (c.accent) css.setProperty('--accent', c.accent)
  if (c.banniere) css.setProperty('--banniere', c.banniere)

  const section = site[page] || {}
  document.title = section.titre ? `${section.titre} — ${site.nom}` : site.nom

  const banner = $('.banniere')
  if (section.banniere) banner.style.backgroundImage = `url("${asset(section.banniere)}")`
  const logo = $('.logo', banner)
  if (site.logo) { logo.src = asset(site.logo); logo.alt = site.nom }
  else logo.replaceWith(Object.assign(document.createElement('h1'), { textContent: site.nom }))
  $('.dates', banner).textContent = [site.dates, site.lieu].filter(Boolean).join(' · ')

  footer(site)
  return site
}

function footer(site) {
  const r = site.reseaux || {}
  const color = (site.couleurs?.texte || '#000').replace('#', '')
  const icons = ['instagram', 'flickr', 'facebook']
    .filter(n => safeUrl(r[n]))
    .map(n => `<a href="${esc(r[n])}" target="_blank" rel="noopener" aria-label="${n}">
      <img src="https://cdn.simpleicons.org/${n}/${color}" alt="${n}" width="22" height="22"></a>`)
    .join('')
  const mails = (site.contacts || [])
    .filter(c => c.email)
    .map(c => `<li>${c.label ? esc(c.label) + ' : ' : ''}<a href="mailto:${esc(c.email)}">${esc(c.email)}</a></li>`)
    .join('')
  $('footer').innerHTML = `<div class="reseaux">${icons}</div><ul class="contacts">${mails}</ul>`
}
