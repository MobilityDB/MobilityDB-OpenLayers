import 'ol/ol.css';

var file = 'https://raw.githubusercontent.com/SoufianBk/MobilityDB-OL/main/trips.json' ;

ol.proj.useGeographic();

const tileLayer = new ol.layer.Tile({
    source: new ol.source.OSM(),
});

// MAP
var map = new ol.Map({
    layers: [tileLayer],
    target: 'map',
    view:   new ol.View({
        center: [12.568337, 55.676098],
        zoom: 7
    })
});

var SRC_bigJSON = new ol.source.Vector({
    url: file,  // big JSON file
    format: new ol.format.GeoJSON()
});
var bigJSON  = new ol.layer.Vector ({
    source: SRC_bigJSON,
    style: new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgba(255, 255, 255, 0)'
        })
    })
});


map.addLayer(bigJSON);

const ptStyle = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 3,
        fill: new ol.style.Fill({color: 'yellow'}),
        stroke: new ol.style.Stroke({color: 'red', width: 1}),
    }),
});


var features

var tmp = 0

bigJSON.on('postrender', function (event) {
    const vectorContext = ol.render.getVectorContext(event);
    tmp = tmp + 1

    features = SRC_bigJSON.getFeatures();
    var first = features[1200]

    var coordinates = []

    features.forEach((feature) => {
        if(feature.getGeometry().getCoordinates().length > tmp ) {
            coordinates.push(feature.getGeometry().getCoordinates()[tmp])
        }
    });

    console.info(first.getGeometry().getCoordinates().length)

    vectorContext.setStyle(ptStyle);
    vectorContext.drawGeometry(new ol.geom.MultiPoint(coordinates));

    map.render();
});

map.render();
