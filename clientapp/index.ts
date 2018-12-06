import members from './data/members.json'
import partners from './data/partners.json'
import Leaflet from './leaflet/mapper'
import render from './render'

members.color = '#033e5e'
partners.color = '#8a9f5c'

let leaflet = new Leaflet('map')
leaflet.loadData([members, partners])
leaflet.setView([44.757889670988784, -91.46414062499999], 11)
render(members, partners)
