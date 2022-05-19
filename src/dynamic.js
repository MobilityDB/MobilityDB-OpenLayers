import 'ol/ol.css';

const tileLayer = new ol.layer.Tile({
    source: new ol.source.OSM(),
});

const map = new ol.Map({
    layers: [tileLayer],
    target: 'map',
    view: new ol.View({
        center: [0, 0],
        zoom: 2,
    }),
});

const imageStyle = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 5,
        fill: new ol.style.Fill({color: 'yellow'}),
        stroke: new ol.style.Stroke({color: 'red', width: 1}),
    }),
});

const headInnerImageStyle = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 2,
        fill: new ol.style.Fill({color: 'blue'}),
    }),
});

const headOuterImageStyle = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 5,
        fill: new ol.style.Fill({color: 'black'}),
    }),
});

const n = 200;
const omegaTheta = 30000; // Rotation period in ms
const R = 7e6;
const r = 2e6;
const p = 2e6;
tileLayer.on('postrender', function (event) {
    const vectorContext = ol.render.getVectorContext(event);
    const frameState = event.frameState;
    const theta = (2 * Math.PI * frameState.time) / omegaTheta;
    const coordinates = [];
    let i;
    for (i = 0; i < n; ++i) {
        const t = theta + (2 * Math.PI * i) / n;
        const x = (R + r) * Math.cos(t) + p * Math.cos(((R + r) * t) / r);
        const y = (R + r) * Math.sin(t) + p * Math.sin(((R + r) * t) / r);
        coordinates.push([x, y]);
    }
    vectorContext.setStyle(imageStyle);
    vectorContext.drawGeometry(new ol.geom.MultiPoint(coordinates));

    const headPoint = new ol.geom.Point(coordinates[coordinates.length - 1]);

    vectorContext.setStyle(headOuterImageStyle);
    vectorContext.drawGeometry(headPoint);

    vectorContext.setStyle(headInnerImageStyle);
    vectorContext.drawGeometry(headPoint);

    map.render();
});
map.render();
