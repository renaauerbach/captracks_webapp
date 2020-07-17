// function initMap() {
//     exports.map = new google.maps.Map(document.getElementById('map'), {
//         center: {
//             lat: 40.7128,
//             lng: 74.006,
//         },
//         zoom: 10,
//     });

//     // Define global infoWindow to display places data
//     infoWindow = new google.maps.InfoWindow();

//     // Initialize PlacesService
//     service = new google.maps.places.PlacesService(map);
//     placeDetails(map);
// }



// // Get Details from PlacesService
// function placeDetails(map) {
//     const stores = document.getElementById('data').innerHTML;
//     const json = JSON.parse(stores);

//     var storeInfo = { table : [] };

//     json.map(store => {
//         const request = {
//             query: store.name + ' ' + store.address,
//             fields: ['place_id', 'geometry'],
//         };
//         service.findPlaceFromQuery(request, (results, status) => {
//             if (status === google.maps.places.PlacesServiceStatus.OK) {
//                 const location = results[0].geometry.location;
//                 map.setCenter(location);
//                 addMarker(location, map, store);

//                 const req = {
//                     placeId: results[0].place_id,
//                     fields: [
//                         'formatted_phone_number',
//                         'opening_hours.weekday_text',
//                         'website',
//                     ],
//                 };
//                 service.getDetails(req, (details, status) => {
//                     if (
//                         status === google.maps.places.PlacesServiceStatus.OK
//                     ) {
//                         var obj = details[0];
//                         storeInfo.table.push({ id: store.id, phone: obj.formatted_phone_number, hours: obj.opening_hours.weekday_text, website: obj.website });
//                     } else {
//                         alert(
//                             'Error occured while calling getDetails: ' +
//                                 status
//                         );
//                     }
//                 });
//             } else {
//                 alert(
//                     'Error occured while calling findPlaceFromQuery: ' +
//                         status
//                 );
//             }
//         });
//     });
//     sessionStorage.setItem('contactOptions', JSON.stringify(allDetails));
//     console.log(allDetails);
// }