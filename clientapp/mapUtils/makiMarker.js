import L from 'leaflet'

/**
 * Leaflet plugin to create map icons using Maki Icons from MapBox.
 * MIT: http://jseppi.mit-license.org/
 * Adapted for CommonJS/ES6
 */

let MakiMarkers = {
  icons: [ 'airfield', 'airport', 'alcohol-shop', 'america-football', 'art-gallery', 'bakery', 'bank', 'bar',
    'baseball', 'basketball', 'beer', 'bicycle', 'building', 'bus', 'cafe', 'camera', 'campsite', 'car',
    'cemetery', 'chemist', 'cinema', 'circle-stroked', 'circle', 'city', 'clothing-store', 'college',
    'commercial', 'cricket', 'cross', 'dam', 'danger', 'disability', 'dog-park', 'embassy',
    'emergency-telephone', 'entrance', 'farm', 'fast-food', 'ferry', 'fire-station', 'fuel', 'garden',
    'golf', 'grocery', 'hairdresser', 'harbor', 'heart', 'heliport', 'hospital', 'industrial',
    'land-use', 'laundry', 'library', 'lighthouse', 'lodging', 'logging', 'london-underground',
    'marker-stroked', 'marker', 'minefield', 'mobilephone', 'monument', 'museum', 'music', 'oil-well',
    'park2', 'park', 'parking-garage', 'parking', 'pharmacy', 'pitch', 'place-of-worship',
    'playground', 'police', 'polling-place', 'post', 'prison', 'rail-above', 'rail-light',
    'rail-metro', 'rail-underground', 'rail', 'religious-christian', 'religious-jewish',
    'religious-muslim', 'restaurant', 'roadblock', 'rocket', 'school', 'scooter', 'shop', 'skiing',
    'slaughterhouse', 'soccer', 'square-stroked', 'square', 'star-stroked', 'star', 'suitcase',
    'swimming', 'telephone', 'tennis', 'theatre', 'toilets', 'town-hall', 'town', 'triangle-stroked',
    'triangle', 'village', 'warehouse', 'waste-basket', 'water', 'wetland', 'zoo'
  ],
  defaultColor: '#0a0',
  defaultIcon: 'circle-stroked',
  defaultSize: 'm',
  apiUrl: 'https://api.tiles.mapbox.com/v3/marker/',
  smallOptions: {
    iconSize: [ 20, 50 ],
    popupAnchor: [ 0, -20 ]
  },
  mediumOptions: {
    iconSize: [ 30, 70 ],
    popupAnchor: [ 0, -30 ]
  },
  largeOptions: {
    iconSize: [ 36, 90 ],
    popupAnchor: [ 0, -40 ]
  }
}

MakiMarkers.Icon = L.Icon.extend({
  options: {
    icon: MakiMarkers.defaultIcon,
    color: MakiMarkers.defaultColor,
    //Marker size: "s" (small), "m" (medium), or "l" (large)
    size: MakiMarkers.defaultSize,
    shadowAnchor: null,
    shadowSize: null,
    shadowUrl: null,
    className: 'maki-marker'
  },

  initialize: function (options) {
    let pin

    options = L.setOptions(this, options)

    switch (options.size) {
      case 's':
        L.extend(options, MakiMarkers.smallOptions)
        break
      case 'l':
        L.extend(options, MakiMarkers.largeOptions)
        break
      default:
        options.size = 'm'
        L.extend(options, MakiMarkers.mediumOptions)
        break
    }


    pin = 'pin-' + options.size

    if (options.icon !== null) {
      pin += '-' + options.icon
    }

    if (options.color !== null) {
      if (options.color.charAt(0) === '#') {
        options.color = options.color.substr(1)
      }

      pin += '+' + options.color
    }

    options.iconUrl = '' + MakiMarkers.apiUrl + pin + '.png'
    options.iconRetinaUrl = MakiMarkers.apiUrl + pin + '@2x.png'
  }
})

export default function(options) {
  return new MakiMarkers.Icon(options)
}
