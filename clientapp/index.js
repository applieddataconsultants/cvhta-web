import L from 'leaflet'
import 'leaflet.label'
import makiMarker from './mapUtils/makiMarker'
import stamenTileLayer from './mapUtils/stamenTileLayer'
import members from './members.json'
import partners from './partners.json'

let map = new L.Map('map', {
  center: new L.LatLng(44.757889670988784, -91.46414062499999),
  zoom: 11,
  layers: [ stamenTileLayer('toner-lite') ],
  zoomControl: false,
  scrollWheelZoom: false,
  attributionControl: false
})

let memberIcon = makiMarker({
  icon: 'marker',
  color: '#033E5E',
  size: 's'
})

let partnerIcon = makiMarker({
  icon: 'marker',
  color: '#8A9F5C',
  size: 's'
})

let memberLayer = L.geoJson(members, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, { icon: memberIcon })
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
})

memberLayer.addTo(map)

let partnerLayer = L.geoJson(partners, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, { icon: partnerIcon })
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
})

partnerLayer.addTo(map)
