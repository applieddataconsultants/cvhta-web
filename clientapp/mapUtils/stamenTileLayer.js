import L from 'leaflet'

/**
 * Adapted from http://maps.stamen.com/js/tile.stamen.js for CommonJS/ES6
 */

const SUBDOMAINS = 'a. b. c. d.'.split(' '),
  MAKE_PROVIDER = function(layer, type, minZoom, maxZoom) {
    return {
      url: ['http://{S}tile.stamen.com/', layer, '/{Z}/{X}/{Y}.', type].join(''),
      type: type,
      subdomains: SUBDOMAINS.slice(),
      minZoom: minZoom,
      maxZoom: maxZoom,
      attribution: [
        'Map tiles by <a href="http://stamen.com/">Stamen Design</a>, ',
        'under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. ',
        'Data by <a href="http://openstreetmap.org/">OpenStreetMap</a>, ',
        'under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.',
      ].join(''),
    }
  },
  PROVIDERS = {
    toner: MAKE_PROVIDER('toner', 'png', 0, 20),
    terrain: MAKE_PROVIDER('terrain', 'jpg', 4, 18),
    watercolor: MAKE_PROVIDER('watercolor', 'jpg', 1, 18),
    'trees-cabs-crime': {
      url: 'http://{S}.tiles.mapbox.com/v3/stamen.trees-cabs-crime/{Z}/{X}/{Y}.png',
      type: 'png',
      subdomains: 'a b c d'.split(' '),
      minZoom: 11,
      maxZoom: 18,
      extent: [
        {lat: 37.853, lon: -122.577},
        {lat: 37.684, lon: -122.313},
      ],
      attribution: [
        'Design by Shawn Allen at <a href="http://stamen.com/">Stamen</a>.',
        'Data courtesy of <a href="http://fuf.net/">FuF</a>,',
        '<a href="http://www.yellowcabsf.com/">Yellow Cab</a>',
        '&amp <a href="http://sf-police.org/">SFPD</a>.',
      ].join(' '),
    },
  }

// set up toner and terrain flavors
setupFlavors('toner', ['hybrid', 'labels', 'lines', 'background', 'lite'])
setupFlavors('terrain', ['background'])
setupFlavors('terrain', ['labels', 'lines'], 'png')

// toner 2010
deprecate('toner', ['2010'])

// toner 2011 flavors
deprecate('toner', ['2011', '2011-lines', '2011-labels', '2011-lite'])

const odbl = [
  'toner',
  'toner-hybrid',
  'toner-labels',
  'toner-lines',
  'toner-background',
  'toner-lite',
]

for (let i = 0; i < odbl.length; i++) {
  const key = odbl[i]

  PROVIDERS[key].retina = true
  PROVIDERS[key].attribution = [
    'Map tiles by <a href="http://stamen.com/">Stamen Design</a>, ',
    'under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. ',
    'Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, ',
    'under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
  ].join('')
}

function deprecate(base, flavors) {
  const provider = getProvider(base)

  for (let i = 0; i < flavors.length; i++) {
    const flavor = [base, flavors[i]].join('-')
    PROVIDERS[flavor] = MAKE_PROVIDER(flavor, provider.type, provider.minZoom, provider.maxZoom)
    PROVIDERS[flavor].deprecated = true
  }
}


/*
 * A shortcut for specifying "flavors" of a style, which are assumed to have the
 * same type and zoom range.
 */
function setupFlavors(base, flavors, type) {
  const provider = getProvider(base)
  for (let i = 0; i < flavors.length; i++) {
    const flavor = [base, flavors[i]].join('-')
    PROVIDERS[flavor] = MAKE_PROVIDER(flavor, type || provider.type, provider.minZoom, provider.maxZoom)
  }
}

/*
 * Get the named provider, or throw an exception if it doesn't exist.
 */
function getProvider(name) {
  if (name in PROVIDERS) {
    const provider = PROVIDERS[name]

    if (provider.deprecated && console && console.warn) {
      console.warn(name + ' is a deprecated style it will be redirected to its replacement. For performance improvements, please change your reference.')
    }

    return provider
  }
  else {
    throw 'No such provider (' + name + ')'
  }
}

const StamenTileLayer = L.TileLayer.extend({
  initialize: function(name, options) {
    const provider = getProvider(name),
      url = provider.url.replace(/({[A-Z]})/g, function(s) {
        return s.toLowerCase()
      }),
      opts = L.Util.extend({}, options, {
        minZoom: provider.minZoom,
        maxZoom: provider.maxZoom,
        subdomains: provider.subdomains,
        scheme: 'xyz',
        attribution: provider.attribution,
        sa_id: name,
      })
    L.TileLayer.prototype.initialize.call(this, url, opts)
  },
})

export default function(options, source) {
  return new StamenTileLayer(options, source)
}
