var layer = new L.StamenTileLayer("toner"); 
var map = new L.Map("map", {
    center: new L.LatLng(44.817889670988784, -91.49414062499999),
    zoom: 12,
    layers: [layer],
    zoomControl: false
});

var markerIcon = L.MakiMarkers.icon({
    icon: "marker",
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
                if(feature.properties.logo){
                    layer.bindPopup('<a target="_blank" href="'
                    +feature.properties.url
                    +'"><img src="'+feature.properties.logo+'">'
                    +'</a></img>')
                }else{
                    layer.bindPopup(feature.properties.name);
                }
		        addMember(feature)
		    }
		}).addTo(map);
		map.fitBounds(markers.getBounds());
    }
});

function addMember(feature) {
    if(feature.properties.logo){
        $('#bios').append('<div class="col-md-4"><a href="'
        +feature.properties.url+'"><div class="well center-block"><img src="'+feature.properties.logo+'">'
        +'</img></div></a></div>')
    
    }else{
	   $('#bios').append('<div class="col-md-4"><div class="well"><h3><a href="'
		+feature.properties.url+'">'
		+feature.properties.name+'</a></h3><p>'
		+feature.properties.description+'</p></div></div>')
    }   
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

