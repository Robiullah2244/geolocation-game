var overlay;
USGSOverlay.prototype = new google.maps.OverlayView();
var enteredCity = {
    lat: null,
    lng: null
};
function initMap() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const region = urlParams.get('region');

    var yourLat = 52.40754733026861, yourLng = -39.20334020147486;

    // Map options
    var mapOptions = {
        zoom: 2,
        center: { lat: yourLat, lng: yourLng },
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        backgroundColor: '#FFF',
        disableDefaultUI: true,
        // draggable: false,
        // scaleControl: false,
        // scrollwheel: false,
        styles: [
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [
                    { "visibility": "off" }
                ]
            }, {
                "featureType": "landscape",
                "stylers": [
                    { "visibility": "off" }
                ]
            }, {
                "featureType": "road",
                "stylers": [
                    { "visibility": "off" }
                ]
            }, {
                "featureType": "administrative",
                "stylers": [
                    { "visibility": "off" }
                ]
            }, {
                "featureType": "poi",
                "stylers": [
                    { "visibility": "off" }
                ]
            }, {
                "featureType": "administrative",
                "stylers": [
                    { "visibility": "off" }
                ]
            }, {
                "elementType": "labels",
                "stylers": [
                    { "visibility": "off" }
                ]
            }, {
            }
        ]
    };

    // New map
    var map = new google.maps.Map(document.getElementById('map'), mapOptions);
    var geocoder = new google.maps.Geocoder();

    // left = -179.14162753118893  
    // top = 83.07583564181145,
    // right = -52.619445  -52.652175
    // bottom = 14.80
    // Overlay map of US, Canada and Mexico
    var swBound = new google.maps.LatLng(14.80, -179.14162753118893);
    var neBound = new google.maps.LatLng(83.07583564181145, -52.652175);
    var bounds = new google.maps.LatLngBounds(swBound, neBound);
    var srcImage = northAmericaData?.distance > 700 ? './AmericaCanadaMexico_4.png' : northAmericaData?.distance > 350 ? './AmericaCanadaMexico_3.png' : northAmericaData?.distance > 125 ? './AmericaCanadaMexico_2.png' : './AmericaCanadaMexico_1.png';
    overlay = new USGSOverlay(bounds, srcImage, map);

    // Norway top = 80.762077
    // ukraine right = 40.169373
    // Bouvet Island bottom = -54.252070
    // Kralendijk left = -68.420964
    // Overlay map of Europe
    var swBound = new google.maps.LatLng(-54.252070, -68.420964);
    var neBound = new google.maps.LatLng(80.762077, 40.169373);
    var bounds = new google.maps.LatLngBounds(swBound, neBound);
    var srcImage = europeData?.distance > 700 ? './Europe_4.png' : europeData?.distance > 350 ? './Europe_3.png' : europeData?.distance > 125 ? './Europe_2.png' : './Europe_1.png';
    overlay = new USGSOverlay(bounds, srcImage, map);

    // Tunisia Top: 37.348335
    // British indian ocean trritory right: 72.507591 --  72.495136
    // French Southern and Antarctic Lands bottom = -49.733519
    // Cape Verde left = -25.361065
    // Overlay map of Africa
    var swBound = new google.maps.LatLng(-49.733519, -25.361065);
    var neBound = new google.maps.LatLng(37.348335, 72.507591);
    var bounds = new google.maps.LatLngBounds(swBound, neBound);
    var srcImage = africaData?.distance > 700 ? './Africa_4.png' : africaData?.distance > 350 ? './Africa_3.png' : africaData?.distance > 125 ? './Africa_2.png' : './Africa_1.png';
    overlay = new USGSOverlay(bounds, srcImage, map);

    // google.maps.event.addListener(map, 'click', function (event) {
    //    console.log(event.latLng.lat(), event.latLng.lng());
    // });
}
function USGSOverlay(bounds, image, map) {

    // Initialize all properties.
    this.bounds_ = bounds;
    this.image_ = image;
    this.map_ = map;

    // Define a property to hold the image's div. We'll
    // actually create this div upon receipt of the onAdd()
    // method so we'll leave it null for now.
    this.div_ = null;

    // Explicitly call setMap on this overlay.
    this.setMap(map);
}
// [END region_constructor]

// [START region_attachment]
/**
* onAdd is called when the map's panes are ready and the overlay has been
* added to the map.
*/
USGSOverlay.prototype.onAdd = function () {

    var div = document.createElement('div');
    div.style.borderStyle = 'none';
    div.style.borderWidth = '0px';
    div.style.position = 'absolute';

    // Create the img element and attach it to the div.
    var img = document.createElement('img');
    img.src = this.image_;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.position = 'absolute';
    div.appendChild(img);

    this.div_ = div;

    // Add the element to the "overlayLayer" pane.
    var panes = this.getPanes();
    panes.overlayLayer.appendChild(div);
    // panes.overlayMouseTarget.appendChild(div);
};
// [END region_attachment]

// [START region_drawing]
USGSOverlay.prototype.draw = function () {

    // We use the south-west and north-east
    // coordinates of the overlay to peg it to the correct position and size.
    // To do this, we need to retrieve the projection from the overlay.
    var overlayProjection = this.getProjection();

    // Retrieve the south-west and north-east coordinates of this overlay
    // in LatLngs and convert them to pixel coordinates.
    // We'll use these coordinates to resize the div.
    var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
    var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

    // Resize the image's div to fit the indicated dimensions.
    var div = this.div_;
    div.style.left = sw.x + 'px';
    div.style.top = ne.y + 'px';
    div.style.width = (ne.x - sw.x) + 'px';
    div.style.height = (sw.y - ne.y) + 'px';
};
// [END region_drawing]

// [START region_removal]
// The onRemove() method will be called automatically from the API if
// we ever set the overlay's map property to 'null'.
USGSOverlay.prototype.onRemove = function () {
    this.div_.parentNode.removeChild(this.div_);
    this.div_ = null;
};
google.maps.event.addDomListener(window, 'load', initMap);
