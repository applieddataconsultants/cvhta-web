import L from 'leaflet'
import 'leaflet.label'

import makiMarker from './mapUtils/makiMarker'
import smoothScroll from 'smooth-scroll'
import stamenTileLayer from './mapUtils/stamenTileLayer'
import makePointLayer from './mapUtils/makePointLayer'
import members from './members.json'
import partners from './partners.json'

const center = L.latLng(44.757889670988784, -91.46414062499999)
const zoom = 11

// Create member layer
let memberLayer = makePointLayer(members, makiMarker({
  icon: 'marker',
  color: '#033E5E',
  size: 's'
}))

// Create partner layer
let partnerLayer = makePointLayer(partners, makiMarker({
  icon: 'marker',
  color: '#8A9F5C',
  size: 's'
}))

// Set up map instance
let map = L.map('map', {
  center, zoom,
  layers: [
    stamenTileLayer('toner-lite'),
    memberLayer,
    partnerLayer
  ],
  zoomControl: false,
  scrollWheelZoom: false,
  attributionControl: false
})

// Handle toggling between full and normal map
let fullModeOn = false
map.on('click', evt => {
  if (fullModeOn) return

  document.body.className = 'full-map'
  map.scrollWheelZoom.enable()
  map.zoomIn()
  fullModeOn = true
})

document
  .getElementById('close-map')
  .addEventListener('click', evt => {
    document.body.className = ''
    map.scrollWheelZoom.disable()
    map.setView(center, zoom)
    fullModeOn = false
  })

smoothScroll.init({
  speed: 1000,
  offset: 40,
  easing: 'easeInOutQuart'
})
