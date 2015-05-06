import L from 'leaflet'
import 'leaflet.label'
import makiMarker from './mapUtils/makiMarker'
import stamenTileLayer from './mapUtils/stamenTileLayer'
import members from './members.json'

let map = new L.Map('map', {
  center: new L.LatLng(44.757889670988784, -91.46414062499999),
  zoom: 11,
  layers: [ stamenTileLayer('toner-lite') ],
  zoomControl: false,
  scrollWheelZoom: false,
  attributionControl: false
})

let markerIcon = makiMarker({
  icon: 'marker',
  color: '#033E5E',
  size: 's'
})

L.geoJson(members, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, { icon: markerIcon })
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties.logo) {
      layer.bindLabel(`
        <a target="_blank" href="${feature.properties.url}">
          <img class='cvhta-popup-logo' src="${feature.properties.logo}"/>
        </a>`, { clickable: true })
    }
    else {
      layer.bindLabel(feature.properties.name, { clickable: true })
    }
  }
}).addTo(map)