import L from 'leaflet'

/**
 * Make a point layer given a geojson object and an icon
 * @param  {object} geojson a geojson object
 * @param  {object} icon    a L.Icon instance
 * @return {object}         a L.FeatureLayer instance
 */
export default function makePointLayer(geojson, icon) {
  return L.geoJson(geojson, {
    pointToLayer: function(feature, latlng) {
      return L.marker(latlng, {icon})
    },
    onEachFeature: function(feature, layer) {
      if (feature.properties.logo) {
        layer.bindLabel(`
          <a target="_blank" href="${feature.properties.url}">
            <img class='cvhta-popup-logo' src="${feature.properties.logo}"/>
          </a>`, {clickable: true})
      }
      else {
        layer.bindLabel(feature.properties.name, {clickable: true})
      }
    },
  })
}
