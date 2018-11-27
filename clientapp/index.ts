import members from './data/members.json'
import partners from './data/partners.json'
import './images/*.png'
import Leaflet from './leaflet/mapper'
import render from './render'

let leaflet = new Leaflet('map')
leaflet.loadData([
  {
    icon: 'marker',
    color: '#033e5e',
    geojson: members,
  },
  {
    icon: 'marker',
    color: '#8a9f5c',
    geojson: partners,
  },
])
leaflet.setView([44.757889670988784, -91.46414062499999], 11)
render(members, partners)
