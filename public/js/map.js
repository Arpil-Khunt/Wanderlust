let mapToken = maptoken;
let listingData = JSON.parse(listing);
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  center: listingData.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 9, // starting zoom
});

const marker = new mapboxgl.Marker({ color: "red" })
  //lng..lat is listing.geometry.cordinates
  .setLngLat(listingData.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h4>${listingData.title}</h4><p>Exact location will be  provided after booking.</p>`
    )
  ) // add popup
  .addTo(map);
