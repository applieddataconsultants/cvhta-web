import {Control, GeoJSON, Map, Marker, TileLayer} from 'leaflet'
import {GeoCollection} from '../types'
import MakiMarker from './makiMarker'

class Leaflet {
  private map: Map

  constructor(el: string | HTMLElement) {
    let stamen = new TileLayer(
      'http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}{r}.png'
    )

    this.map = new Map(el, {
      layers: [stamen],
      zoomControl: false,
      scrollWheelZoom: false,
      attributionControl: false,
    })
    this.map.addControl(
      new Control.Zoom({
        position: 'topright',
      })
    )
  }

  public loadData(geos: GeoCollection[]) {
    for (let geo of geos) {
      let group = new GeoJSON(geo, {
        pointToLayer(feature, latlng) {
          return new Marker(latlng, {
            icon: new MakiMarker({
              icon: geo.icon,
              color: geo.color,
              size: 's',
              iconUrl: '',
            }),
          })
        },
      })

      group.bindTooltip((layer: any) => {
        let feature = layer.feature
        return `
            <a target="_blank" href="${feature.properties.url}">
              <img class='cvhta-popup-logo' src="${feature.properties.logo}"/>
            </a>`
      })

      this.map.addLayer(group)
    }
  }

  public setView(ll: [number, number], zoom: number) {
    this.map.setView(ll, zoom)
  }
}

export default Leaflet
