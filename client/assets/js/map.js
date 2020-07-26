(function(exports) {
    'use strict';

    var infoWindow;

    // Each marker is labeled with a single alphabetical character.
    var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    exports.labels = labels;
    exports.labelIndex = 0;

    function initMap() {
        exports.map = new google.maps.Map(document.getElementById('map'), {
            center: {
                lat: 40.7128,
                lng: 74.0060,
            },
            zoom: 10,
        });
        
        // Define global infoWindow to display places data
        infoWindow = new google.maps.InfoWindow();

        // Initialize Geoencoder
        var geocoder = new google.maps.Geocoder();
        geocodeAddress(geocoder, map);
    }

    // Geoencode address
    function geocodeAddress(geocoder, map) {
        var stores = document.getElementById('data').innerHTML;
        var json = JSON.parse(stores);

        json.map(store => {
            geocoder.geocode({ address: store.address }, (results, status) => {
                var location = results[0].geometry.location;
                if (status === 'OK') {
                    map.setCenter(location);
                    addMarker(location, map, store);
                } else {
                    alert('Error occured while geoencoding: ' + status);
                }
            });
        });
    }

    // Add Marker
    function addMarker(location, map, store) {
        var colors = ['#fff500', '#4aad4e'];
        exports.marker = new google.maps.Marker({
            position: location,
            label: labels[exports.labelIndex++ % labels.length],
            map: map,
        });

        makeInfoWindowEvent(map, infoWindow, contentFormatter(store), exports.marker);
    }

    // Maker Detail Popup
    function makeInfoWindowEvent(map, infoWindow, infoString, marker) {
        google.maps.event.addListener(marker, 'click', () => {
            infoWindow.setContent(infoString);
            infoWindow.open(map, marker);
        });
    }

    // Detail Content Formatter
    function contentFormatter(info) {
        var contentString = '<div id="popup">' +
                        '<div class="popup-title">' + info.name + '</div>' +
                        '<div class="popup-content">' +
                            '<div class="popup-address">' + info.address + '</div>' + '<br/>' +
                            '<div class="popup-details">Current Capacity: ' + info.details + '</div>' +
                            '<div class="popup-details">Current Wait Time: ' + info.details + '</div>' +
                        '</div>' + 
                    '</div>' +
                    '<div class="popup-link">' +
                        '<a href="/store/' + info.id + '">Store Details</a>' +
                    '</div>';
        return contentString;
    }

    // Export functions
    exports.initMap = initMap;
    exports.addMarker = addMarker;
    exports.makeInfoWindowEvent = makeInfoWindowEvent;

})((this.window = this.window || {}));