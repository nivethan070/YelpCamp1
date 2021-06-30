
// mapboxgl.accessToken = 'pk.eyJ1Ijoibml2ZXRoYW4iLCJhIjoiY2txZHd1ZjZiMWF1aTJvb3Zsd3NtZmt2MyJ9.INkhSKmldGb-_tsmlYJyxg';
mapboxgl.accessToken = mapToken; //mapToken is the name of variable name declared in shows.ejs
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/light-v10', // style URL
center: campground.geometry.coordinates, // starting position [lng, lat]
zoom: 8 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
.setLngLat(campground.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({offset: 25})
    .setHTML(
        `<h3>${campground.title}</h3><p>${campground.location}</p>`
    )
)
.addTo(map)
