import membersRaw from './data/members.json'
import partnersRaw from './data/partners.json'
import Leaflet from './leaflet/mapper'
import render from './render'
import * as T from './types'

let members = membersRaw as T.GeoCollection
let partners = partnersRaw as T.GeoCollection

let leaflet = new Leaflet('map')
leaflet.loadData([members, partners])
leaflet.setView([44.757889670988784, -91.46414062499999], 11)
render(members, partners)
