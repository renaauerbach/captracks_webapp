(function (exports) {
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
			zoom: 12,
		});

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position) => {
				exports.map.setCenter(
					new google.maps.LatLng(
						position.coords.latitude,
						position.coords.longitude
					)
				);
			});
		}

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

		json.map((store) => {
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
		// Default color = purple
		let color = '#ac01d5';

		if (store.details[0]) {
			const capacity = store.details[0].capacity;

			// Green = capacity < 50%
			if (capacity < 50) {
				color = '#009900';
			}
			// Yellow = capacity between 50-80%
			else if (capacity > 50 && capacity < 80) {
				color = '#fff500';
			}
			// Red (default) = if store is at > 80% capacity (or has a line)
			else {
				color = '#fa2043';
			}
		}
		var customIcon = {
			path:
				'M 0,0 c -1.25816,1.34277 -2.04623,3.29881 -2.01563,5.13867 0.0639,3.84476 1.79693,5.3002 4.56836,10.59179 0.99832,2.32851 2.04027,4.79237 3.03125,8.87305 0.13772,0.60193 0.27203,1.16104 0.33416,1.20948 0.0621,0.0485 0.19644,-0.51262 0.33416,-1.11455 0.99098,-4.08068 2.03293,-6.54258 3.03125,-8.87109 2.77143,-5.29159 4.50444,-6.74704 4.56836,-10.5918 0.0306,-1.83986 -0.75942,-3.79785 -2.01758,-5.14062 -1.43724,-1.53389 -3.60504,-2.66908 -5.91619,-2.71655 -2.31115,-0.0475 -4.4809,1.08773 -5.91814,2.62162 z',
			anchor: new google.maps.Point(12, 17),
			fillOpacity: 1,
			fillColor: color,
			strokeWeight: 1,
			strokeColor: '#a0a0a0',
			scale: 1,
		};

		exports.marker = new google.maps.Marker({
			position: location,
			map: map,
			icon: customIcon,
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
			  '<div class="tooltip-details">Current Entry Wait Time: <span class="data">' +
			  info.details[0].waitTime +
			  ' minutes</span></div>' +
			  '</div>' +
			  '</div>' +
			  '<div class="tooltip-link">' +
			  '<a href="/store/' +
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
