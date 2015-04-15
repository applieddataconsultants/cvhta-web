var layer = new L.StamenTileLayer("toner"); 
var map = new L.Map("map", {
    center: new L.LatLng(44.817889670988784, -91.49414062499999),
    zoom: 12,
    layers: [layer],
    zoomControl: false
});

var markerIcon = L.MakiMarkers.icon({
    icon: "warehouse",
    color: "#0a0",
    size: "s"
});

var markers;

$.ajax({
    type: "GET",
    url: "https://gist.githubusercontent.com/levifelling/5e610138aba3b9a20f34/raw/map.geojson",
    dataType: 'json',
    success: function (response) {
    	response.features = shuffle(response.features)
        markers = L.geoJson(response, {
        	pointToLayer: function(feature, latlng) {
			   return L.marker(latlng, {icon: markerIcon});
			},
		    onEachFeature: function (feature, layer) {
		        layer.bindPopup(feature.properties.name);
		        addMember(feature)
		    }
		}).addTo(map);
		map.fitBounds(markers.getBounds());
    }
});

function addMember(feature) {
	$('#bios').append('<div class="col-md-4"><h3><a href="'
		+feature.properties.url+'">'
		+feature.properties.name+'</a></h3><p>'
		+feature.properties.description+'</p></div>')
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

