// API endpoint
let queryUrl= "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(queryUrl).then(function(data){
    createFeatures(data.features);
});

function createFeatures(earthquakeData){
    function onEachFeature(feature, layer){
        layer.bindPopup(`<h3>Where: ${feature.properties.place}</h3><hr><p>Time: ${new Date(feature.properties.time)}</p><hr><p>Magnitude: ${feature.properties.mag}<p><hr><p>Depth: ${feature.geometry.coordinates[2]}<p>`);
    }

    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: createMarkers
    });

    createMap(earthquakes);
}

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


function createMarkers(feature, coordinates){
    let modifiers ={
        radius: feature.properties.mag*8,
        fillColor: earthquakeColor(feature.geometry.coordinates[2]),
        color: earthquakeColor(feature.geometry.coordinates[2]),
        color: "black",
        fillOpacity: .3
    }
    return L.circleMarker(coordinates, modifiers);
}

let legend = L.control({
    position: 'bottomright'
});

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

function createMap(earthquakes){
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'});
    
    let baseMaps={
        "Street": street
    };

    let overlayMaps = {
        "Earthquakes": earthquakes
    };

    let myMap= L.map("map", {
        center: [
            39.8282, -98.5795
        ],
        zoom: 4,
        layers: [street, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps).addTo(myMap);

    legend.addTo(myMap);
    
}

