// API endpoint
let queryUrl= "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
//Get request from API then run createFeatures with data
d3.json(queryUrl).then(function(data){
    createFeatures(data.features);
});

function createFeatures(earthquakeData){
    //Function that runs on each feature in array and creates popup with place, time, magnitude and depth
    function onEachFeature(feature, layer){
        layer.bindPopup(`<h3>Where: ${feature.properties.place}</h3><hr><p>Time: ${new Date(feature.properties.time)}</p><hr><p>Magnitude: ${feature.properties.mag}<p><hr><p>Depth: ${feature.geometry.coordinates[2]}<p>`);
    }
    //Create GeoJSON layer and run on each feature and create the markers
    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: createMarkers
    });
    //Run createMap using earthquakes layer
    createMap(earthquakes);
}
// Loop through features and set color for each marker based on depth
function earthquakeColor(depth){
    if(-10<=depth && depth<=10){
        return '#7CFC00';
    } else if(10<depth && depth<=30){
        return '#ADFF2F';
    } else if(30<depth && depth<=50){
        return '#FFDAB9';
    } else if(50<depth && depth<=70){
        return '#FFA500';
    } else if(70<depth && depth<=90){
        return '#FF8C00';
    } else if(90<depth){
        return '#FF0000';
    }
}

//Create markers
function createMarkers(feature, coordinates){
    //Set modifiers for each marker
    let modifiers ={
        radius: feature.properties.mag*8,
        fillColor: earthquakeColor(feature.geometry.coordinates[2]),
        color: earthquakeColor(feature.geometry.coordinates[2]),
        color: "black",
        fillOpacity: .3
    }
    return L.circleMarker(coordinates, modifiers);
}
//Create Legend
let legend = L.control({
    position: 'bottomright'
});
//Insert a div with the class of info legend to our legend
legend.onAdd = function(map) {

    let div = L.DomUtil.create('div', 'info legend');
    let depth = [-10, 10, 30, 50, 70, 90];
    let labels = [];

    // loop through depth intervals and generate a label with a colored square for each interval
    for (let i = 0; i < depth.length; i++) {
        div.innerHTML += 
            '<i style="background:' + earthquakeColor(depth[i] + 1) + '"></i> ' +
            depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }

return div;

};
//Function for creating Map
function createMap(earthquakes){
    //Define street layer
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'});
    //Define baseMaps object for base layer
    let baseMaps={
        "Street": street
    };
    //Define overlayMaps object for overlay layer
    let overlayMaps = {
        "Earthquakes": earthquakes
    };
    //Create map with base and earthquake layers
    let myMap= L.map("map", {
        center: [
            39.8282, -98.5795
        ],
        zoom: 4,
        layers: [street, earthquakes]
    });
    //Create layer control that has base and overlay layers and add to map
    L.control.layers(baseMaps, overlayMaps).addTo(myMap);
    //Add legend to map
    legend.addTo(myMap);
    
}

