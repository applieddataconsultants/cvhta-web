import './styles/index.less'
import L from 'leaflet'
import 'leaflet.label'
import makiMarker from './mapUtils/makiMarker'
import stamenTileLayer from './mapUtils/stamenTileLayer'
import $ from 'jquery'

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
  color: '#033E5E', //'#8A9F5C',
  size: 's'
})

let markers

$.getJSON('https://gist.githubusercontent.com/levifelling/5e610138aba3b9a20f34/raw/map.geojson')
  .then(geojson => {
    geojson.features = shuffle(geojson.features)
    markers = L.geoJson(geojson, {
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: markerIcon })
      },
      onEachFeature: function (feature, layer) {
        if (feature.properties.logo) {
          layer.bindLabel(`
            <a target="_blank" href="${feature.properties.url}">
              <img class='popup-img' src="${feature.properties.logo}"/>
            </a>`, { clickable: true })
        }
        else {
          layer.bindLabel(feature.properties.name, { clickable: true })
        }
        addMember(feature)
      }
    }).addTo(map)

    // map.fitBounds(markers.getBounds())
  })

function addMember (feature) {
  let $colEl = $('<div class="col-md-4 col-sm-6"></div>')
  let $blockEl = $('<div class="well center-block"></div>')

  let $infoEl = $('<div class="company-info"></div>')
  $infoEl
    .append('<h3><a href="' + feature.properties.url + '">' + feature.properties.name + '</a></h3>')
    .append('<p>' + feature.properties.description + '</p>')

  if (feature.properties.logo) {
    // Hide the .company-info until mouse over (handled below)
    $infoEl.hide()

    // Create photo container for centering the photo
    let $photo = $('<div class="photo"></div>')
    $photo.append('<img class="img-responsive" src="' + feature.properties.logo + '" />')

    // Append the main photo container to the .well
    let $photoContainer = $('<div class="photo-container"></div>').append($photo)
    $($blockEl).append($photoContainer)

    // Set hover transitions for images to display .company-info
    $blockEl.hover(function () { // Mouse Enter
      $photoContainer.fadeOut(150, function () {
        $infoEl.fadeIn(100)
      })
    }, function () { // Mouse Leave
        $infoEl.fadeOut(150, function () {
          $photoContainer.fadeIn(100)
        })
      }
    )
  }

  $blockEl.append($infoEl)
  $colEl.append($blockEl)
  $('#bios').append($colEl)
}

function shuffle (array) {
  let currentIndex = array.length, temporaryValue, randomIndex

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}
