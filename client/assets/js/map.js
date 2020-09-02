(function(exports) {
    'use strict';

    let infoWindow;

    // Each marker is labeled with a single alphabetical character.
    const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
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
        const geocoder = new google.maps.Geocoder();
        geocodeAddress(geocoder, exports.map);
    }

    // Geoencode address
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
        const colors = ['#fff500', '#4aad4e'];
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
        console.log("vendor", info);
        const contentString = '<div id="popup">' +
            '<div class="popup-title">' + info.name + '</div>' +
            '<div class="popup-content">' +
            '<div class="popup-address">' + info.address + '</div>' + '<br/>';
        const hasVendor = '<div class="popup-details">Current Capacity: ' + info.details.capacity + '</div>' +
            '<div class="popup-details">Current Wait Time: ' + info.details.waitTime + '</div>' +
            '</div>' +
            '</div>' +
            '<div class="popup-link">' +
            '<a href="/map/store/' + info.id + '">Store Details</a>' +
            '</div>';
        const noVendor = '<div class="popup-waiting">Waiting for vendor to join!</div>';
        return (info.details.length !== 0) ? contentString + hasVendor : contentString + noVendor;
    }

    // Export functions
    exports.initMap = initMap;
    exports.addMarker = addMarker;
    exports.makeInfoWindowEvent = makeInfoWindowEvent;

})((this.window = this.window || {}));