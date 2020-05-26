import {Icon, IconOptions} from 'leaflet'

/**
 * Leaflet plugin to create map icons using Maki Icons from MapBox.
 * MIT: http://jseppi.mit-license.org/
 * See https://www.mapbox.com/maki-icons/ for a list.
 * Adapted for CommonJS/ES6
 */
const apiUrl = 'https://api.tiles.mapbox.com/v3/marker/'

export interface MakiMarkerOptions extends IconOptions {
  icon?: string
  color: string
  size: 's' | 'l' | 'm'
}

class MakiMarker extends Icon {
  options: MakiMarkerOptions = {
    color: '#0a0',
    size: 'm',
    className: 'maki-marker',
    iconUrl: '',
  }

  constructor(opts: MakiMarkerOptions) {
    super(opts)
    this.options = Object.assign(this.options, opts)

    switch (this.options.size) {
      case 's':
        this.options.iconSize = [20, 50]
        this.options.popupAnchor = [0, -20]
        this.options.tooltipAnchor = [0, -20]
        break
      case 'l':
        this.options.iconSize = [36, 90]
        this.options.popupAnchor = [0, -40]
        this.options.tooltipAnchor = [0, -40]
        break
      case 'm':
      default:
        this.options.iconSize = [30, 70]
        this.options.popupAnchor = [0, -30]
        this.options.tooltipAnchor = [0, -30]
        break
    }

    let pin = 'pin-' + this.options.size

    if (this.options.icon != null) {
      pin += '-' + this.options.icon
    }

    if (this.options.color != null) {
      if (this.options.color.charAt(0) === '#') {
        this.options.color = this.options.color.substr(1)
      }

      pin += '+' + this.options.color
    }

    this.options.iconUrl = apiUrl + pin + '.png'
    this.options.iconRetinaUrl = apiUrl + pin + '@2x.png'
  }
}

export default MakiMarker
