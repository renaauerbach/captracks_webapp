(function(exports) {
    'use strict';

    let infoWindow;

    // Each marker is labeled with a single alphabetical character
    exports.labelIndex = 0;

    // Initiate Google Map
    function initMap() {
        exports.map = new google.maps.Map(document.getElementById('map'), {
            center: {
                lat: 40.7128,
                lng: 74.006,
            },
            zoom: 10,
        });

        // Define global infoWindow to display places data
        infoWindow = new google.maps.InfoWindow();

        // Initialize Geoencoder
        const geocoder = new google.maps.Geocoder();
        geocodeAddress(geocoder, exports.map);
    }

    // Geoencode Address
    function geocodeAddress(geocoder, map) {
        const stores = document.getElementById('data').innerHTML;
        const json = JSON.parse(stores);

        json.map(store => {
            geocoder.geocode({ address: store.address }, (results, status) => {
                const location = results[0].geometry.location;
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
        const red = new google.maps.MarkerImage(
            'http://www.googlemapsmarkers.com/v1/A/FA2043/FA2043/A0A0A0/'
        );
        const yellow = new google.maps.MarkerImage(
            'http://www.googlemapsmarkers.com/v1/A/FFF500/FFF500/A0A0A0/'
        );
        const green = new google.maps.MarkerImage(
            'http://www.googlemapsmarkers.com/v1/A/009900/009900/A0A0A0/'
        );

        // Default icon = purple
        let icon = new google.maps.MarkerImage(
            'http://www.googlemapsmarkers.com/v1/A/AC01D5/AC01D5/A0A0A0/'
        );
        if (store.details[0]) {
            const capacity = store.details[0].capacity;

            // Green Marker = capacity < 50%
            if (capacity < 50) {
                icon = green;
            }
            // Yellow Marker = capacity between 50-80%
            else if (capacity < 80 && capacity > 50) {
                icon = yellow;
            }
            // Red Marker (default) = if there is a wait or store is at > 80% capacity
            else {
                icon = red;
            }
        }

        exports.marker = new google.maps.Marker({
            position: location,
            map: map,
            icon: icon,
        });

        makeInfoWindowEvent(
            map,
            infoWindow,
            contentFormatter(store),
            exports.marker
        );
    }

    // Maker Detail Tooltip
    function makeInfoWindowEvent(map, infoWindow, infoString, marker) {
        google.maps.event.addListener(marker, 'click', () => {
            infoWindow.setContent(infoString);
            infoWindow.open(map, marker);
        });
    }

    // Detail Content Formatter
    function contentFormatter(info) {
        let contentString =
            '<div id="tooltip">' +
            '<div class="tooltip-title">' +
            info.name +
            '</div>' +
            '<div class="tooltip-content">' +
            '<div class="tooltip-address">' +
            info.address +
            '</div>' +
            '<br/>';
        contentString += info.details[0]
            ? '<div class="tooltip-details">Current Capacity: <span class="data">' +
            info.details[0].capacity +
            '%</span></div>' +
            '<div class="tooltip-details">Current Wait Time: <span class="data">' +
            info.details[0].waitTime +
            ' minutes</span></div>' +
            '</div>' +
            '</div>' +
            '<div class="tooltip-link">' +
            '<a href="/map/store/' +
            info.id +
            '">Store Details & Updates</a>' +
            '</div>'
            : '<div class="tooltip-waiting">Waiting for vendor to join!</div>';
        return contentString;
    }

    // Export functions
    exports.initMap = initMap;
    exports.addMarker = addMarker;
    exports.makeInfoWindowEvent = makeInfoWindowEvent;
})((this.window = this.window || {}));
