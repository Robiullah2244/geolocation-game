



var overlay;
USGSOverlay.prototype = new google.maps.OverlayView();
var enteredCity = {
    lat: null,
    lng: null
};
function initMap() {
    var yourLat = 56.211379240824726, yourLng = -117.77755895147486;
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


    // Overlay map of US, Canada and Mexico
    var swBound = new google.maps.LatLng(14.85, -171.84151589917622);
    var neBound = new google.maps.LatLng(83.0954302181901, -52.69578437143278);
    var bounds = new google.maps.LatLngBounds(swBound, neBound);
    var srcImage = './map.png';
    overlay = new USGSOverlay(bounds, srcImage, map);

    // Norway top = 80.762077
    // ukraine right = 40.169373
    // Bouvet Island bottom = -54.252070
    // Kralendijk left = -68.420964
    
    // Overlay map of Europe
    var swBound = new google.maps.LatLng(-54.252070, -68.420964);
    var neBound = new google.maps.LatLng(80.762077, 40.169373);
    var bounds = new google.maps.LatLngBounds(swBound, neBound);
    var srcImage = './Europe.png';
    overlay = new USGSOverlay(bounds, srcImage, map);

    // Tunisia Top: 37.348335
    // British indian ocean trritory right: 72.507591 --  72.495136
    // French Southern and Antarctic Lands bottom = -49.733519
    // Cape Verde left = -25.361065

    // Overlay map of Africa
    var swBound = new google.maps.LatLng(-49.733519, -25.361065);
    var neBound = new google.maps.LatLng(37.348335, 72.507591);
    var bounds = new google.maps.LatLngBounds(swBound, neBound);
    var srcImage = './Africa.png';
    overlay = new USGSOverlay(bounds, srcImage, map);

    // locateCurrentLocation();

    //Current Location Icon setup
    if(document.getElementById('current-location-icon')){
        var currentLocation = document.getElementById('current-location-icon');
        map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(currentLocation);
        $('#current-location-icon').click(function () {
            locateCurrentLocation();
        })
    }

    //Locate Your Location Start Here
    ///----------------------------------------
    function locateCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var currentPosition = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                var optionsForCurrentLocation = {
                    zoom: 16,
                    center: currentPosition,
                    animation: google.maps.Animation.BOUNCE,
                }
                map.setOptions(optionsForCurrentLocation);
            },
                function () {
                    alert('Error: The Geolocation service failed. Give location access from address bar to get current location');
                });
        }
    }
    //Locate Your Location End Here
    ///----------------------------------------


    if(document.getElementById('pac-input')){
        ///Search option Section Start here----------------
        ///----------------------------------------
        // Create the search box and link it to the UI element.
        var input = document.getElementById('pac-input');
        // var searchBox = new google.maps.places.SearchBox(input, {
        var autocomplete = new google.maps.places.Autocomplete(input, {
            types: ['(cities)'], // Search result limit added only for cities
            // componentRestrictions: { country: ["us", "ca", "mx"] }
        });
    
        // Bind the map's bounds (viewport) property to the autocomplete object,
        // so that the autocomplete requests use the current map bounds for the
        // bounds option in the request.
        autocomplete.bindTo("bounds", map);
    
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        autocomplete.addListener('place_changed', function () {
            var place = autocomplete.getPlace();
    
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
    
            var myLat = place.geometry.location.lat();
            var myLng = place.geometry.location.lng();
    
            enteredCity = {
                lat: myLat,
                lng: myLng
            }
            document.getElementById('enteredCityId').innerHTML = `<br/><br/>Your entered city: <b>${place.formatted_address}</b>`;
            citySelected && citySelected()
        });
        ///Search option Section End here----------------
        ///----------------------------------------
    }


    ///Calculate distance Section Start here----------------
    ///----------------------------------------
    function calculateDistance(destination) {
        // Haversine Formula

        // The math module contains a function
        // named toRadians which converts from
        // degrees to radians.
        lon1 = enteredCity.lng * Math.PI / 180;
        lon2 = destination.lng * Math.PI / 180;
        lat1 = enteredCity.lat * Math.PI / 180;
        lat2 = destination.lat * Math.PI / 180;

        // Haversine formula
        let dlon = lon2 - lon1;
        let dlat = lat2 - lat1;
        let a = Math.pow(Math.sin(dlat / 2), 2)
            + Math.cos(lat1) * Math.cos(lat2)
            * Math.pow(Math.sin(dlon / 2), 2);

        let c = 2 * Math.asin(Math.sqrt(a));

        // Radius of earth in kilometers. Use 3956
        // for miles
        let r = 6371;

        // calculate the result
        let ans = c * r;

        console.log('calculated distance: ', ans)
        distanceCalculationDone && distanceCalculationDone(ans)
    }
    ///Calculate distance Section End here----------------
    ///----------------------------------------


    // Listen for click on map Start here----------------
    ///----------------------------------------

    google.maps.event.addListener(map, 'click', function (event) {
        if (enteredCity.lat == null || enteredCity.lng == null) {
            return Swal.fire('Please enter a city first!', '', 'warning')
        }
        var myLat = event.latLng.lat();
        var myLng = event.latLng.lng();
        // console.log(myLat, myLng)
        geocoder.geocode(
            {
                'latLng': event.latLng
            },
            function (results, status) {
                let isInUSACanadaMexico = false;
                if (status == google.maps.GeocoderStatus.OK) {
                    results.forEach(element => {
                        let countryName = element.address_components[element.address_components.length - 1].long_name;
                        let countryList = ['United States', 'Canada', 'Mexico',
                            /// European countries
                            'Hungary',
                            'Belarus',
                            'Austria',
                            'Serbia',
                            'Switzerland',
                            'Germany',
                            'Holy See',
                            'Andorra',
                            'Bulgaria',
                            'United Kingdom',
                            'France',
                            'Montenegro',
                            'Luxembourg',
                            'Italy',
                            'Denmark',
                            'Finland',
                            'Slovakia',
                            'Norway',
                            'Svalbard and Jan Mayen',
                            'Ireland',
                            'Spain',
                            'Malta',
                            'Ukraine',
                            'Croatia',
                            'Moldova',
                            'Monaco',
                            'Liechtenstein',
                            'Poland',
                            'Iceland',
                            'San Marino',
                            'Bosnia and Herzegovina',
                            'Albania',
                            'Lithuania',
                            'North Macedonia',
                            'Slovenia',
                            'Romania',
                            'Latvia',
                            'Netherlands',
                            'Caribbean Netherlands',
                            'Russia',
                            'Estonia',
                            'Belgium',
                            'Czechia',
                            'Greece',
                            'Portugal',
                            'Sweden',
                            'Isle of Man',
                            'Faeroe Islands',
                            'Gibraltar',
                            'Channel Islands',
                            /// European countries

                            /// African countries
                            'Djibouti',
                            'Seychelles',
                            'DR Congo',
                            'Comoros',
                            'Togo',
                            'Sierra Leone',
                            'Libya',
                            'Tanzania',
                            'South Africa',
                            'Cabo Verde',
                            'Congo',
                            'Kenya',
                            'Liberia',
                            'Central African Republic',
                            'Mauritania',
                            'Uganda',
                            'Algeria',
                            'Sudan',
                            'Morocco',
                            'Eritrea',
                            'Angola',
                            'Mozambique',
                            'Ghana',
                            'Madagascar',
                            'Cameroon',
                            "Côte d'Ivoire",
                            'Namibia',
                            'Niger',
                            'Gambia',
                            'Botswana',
                            'Gabon',
                            'São Tomé and Príncipe',
                            'Lesotho',
                            'Burkina Faso',
                            'Nigeria',
                            'Mali',
                            'Guinea-Bissau',
                            'Malawi',
                            'Zambia',
                            'Senegal',
                            'Chad',
                            'Somalia',
                            'Zimbabwe',
                            'Equatorial Guinea',
                            'Guinea',
                            'Rwanda',
                            'Mauritius',
                            'Benin',
                            'Burundi',
                            'Tunisia',
                            'Eswatini',
                            'Ethiopia',
                            'South Sudan',
                            'Egypt',
                            'Réunion',
                            'Saint Helena',
                            'Western Sahara',
                            'Mayotte',
                            'Cape Verde',
                            'French Southern and Antarctic Lands',
                            'British Indian Ocean Territory',
                            /// African countries
                        ];
                        console.log(countryName)
                        const index = countryList.findIndex( item =>  item.toLowerCase() === countryName.toLowerCase());
                        if (index !== -1) {
                            isInUSACanadaMexico = true;
                            return true;
                        }
                    });
                }
                // console.log('isInUSACanadaMexico: ', isInUSACanadaMexico)
                if (isInUSACanadaMexico) {
                    calculateDistance({ lat: myLat, lng: myLng })
                }
            });

    });

    // Listen for click on map End here----------------
    ///----------------------------------------
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
