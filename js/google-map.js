var myLatLng1 = [];
var randomLat = [];
var randomLong = [];
var responseData;
var responseMonthData;
var clickLatLan = [];
var selectMarkers = [];
var centralMarkers = [];
var responseDataLocation;
var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;
var markerColor = ["red", "green", "blue", "yellow", "purple", "orange", "pink"];
var same;
var info;
var map;

var slider = document.getElementById("ranger");
var output = document.getElementById("rangeValue");
output.innerHTML = slider.value;
slider.oninput = function() {
    output.innerHTML = this.value;
}

var selectedValue = document.getElementById('data');


for (i = 0; i < 30; i++) {
    randomLat[i] = Math.random() * (13.802012 - 12.227601) + 12.227601;
    //  13.409527 - 12.420680
    randomLong[i] = Math.random() * (76.104601 - 79.064102) + 79.064102;
    //  78.59818
    myLatLng1[i] = { lat: randomLat[i], lng: randomLong[i] };
}

function sendRequest() {
    if (slider.value == 1) {
        sendJSON();
    } else {
        sendJSONAhead();
    }
}

function sendJSON() {
    // Creating a XHR object 
    let xhr = new XMLHttpRequest();
    let url = "http://192.168.43.126:5000/get_predictions";

    // open a connection 
    xhr.open("POST", url, true);

    // Set the request header i.e. which type of content you are sending 
    xhr.setRequestHeader("Content-Type", "application/json");

    // Create a state change callback 
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            responseData = JSON.parse(this.responseText);
            clickLatLan = [];
            console.log(responseData.pred);
            if (selectedValue.value == "dengue") {
                getDengue();
            } else if (selectedValue.value == "yellowfever") {
                getYellowFever();
            } else if (selectedValue.value == "zika") {
                getZika();
            }
        }
    };

    // Converting JSON data to string 
    var data = JSON.stringify({ "map_points": myLatLng1 });
    console.log(data);
    // Sending data with the request 
    xhr.send(data);

}

function sendJSONAhead() {
    // Creating a XHR object 
    let xhr = new XMLHttpRequest();
    let url = "http://192.168.43.126:5000/get_predictions_future";

    // open a connection 
    xhr.open("POST", url, true);

    // Set the request header i.e. which type of content you are sending 
    xhr.setRequestHeader("Content-Type", "application/json");

    // Create a state change callback 
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            responseData = JSON.parse(this.responseText);
            console.log(responseData.pred);
            clickLatLan = [];
            if (selectedValue.value == "dengue") {
                getDengue();
            } else if (selectedValue.value == "yellowfever") {
                getYellowFever();
            } else if (selectedValue.value == "zika") {
                getZika();
            }
        }
    };

    // Converting JSON data to string 
    var data = JSON.stringify({ "map_points": myLatLng1, "ahead": slider.value });
    console.log(data);
    // Sending data with the request 
    xhr.send(data);
}


var google;

function init() {
    var MAP_BOUND = {
        north: 13.802012,
        south: 12.227601,
        west: 76.104601,
        east: 79.064102,
    };
    var vellore = new google.maps.LatLng(12.971599, 77.594566);
    //13.802012 upper left  13.802012
    //76.274601              76.104601

    //12.227601 Lower right
    //79.064102
    var mapOptions = {
        restriction: {
            latLngBounds: MAP_BOUND,
            strictBounds: false,
        },
        zoom: 9,

        center: vellore,
        scrollwheel: false,
        styles: [{
            "featureType": "administrative.country",
            "elementType": "geometry",
            "stylers": [{
                    "visibility": "simplified"
                },
                {
                    "hue": "#ff0000"
                }
            ]
        }]
    };




    // Get the HTML DOM element that will contain your map 
    // We are using a div with id="map" seen below in the <body>
    var mapElement = document.getElementById('map');

    // Create the Google Map using out element and options defined above
    var map = new google.maps.Map(mapElement, mapOptions);

    var myLatLng = { lat: 12.227601, lng: 79.064102 };
    // google.maps.event.addListener(map, "click", function(e) {

    //     //lat and lng is available in e object
    //     clickLatLan.push(e.latLng);
    //     console.log("LatLang " + e.latLng);
    // });
    // var marker = new google.maps.Marker({
    //     position: myLatLng,
    //     map: map,
    //     title: 'Hello World!'
    // });
}

function getPointsDengue() {
    var heatMapValue = [];
    for (var i = 0; i < 30; i++) {
        heatMapValue[i] = { location: new google.maps.LatLng(randomLat[i], randomLong[i]), weight: responseData.pred[i][0] * 100 };
        // {location: new google.maps.LatLng(37.782, -122.447), weight: 0.5}
        console.log("Dengue");
        console.log(heatMapValue[i]);
    }
    // console.log("Dengue" + heatMapValue);
    return heatMapValue;
}

function getPoints() {
    var heatMapValue = [];
    for (var i = 0; i < 30; i++) {
        heatMapValue[i] = new google.maps.LatLng(randomLat[i], randomLong[i]);
        // {location: new google.maps.LatLng(37.782, -122.447), weight: 0.5}
        // console.log("Dengue");
        // console.log(heatMapValue[i]);
    }
    // console.log("Dengue" + heatMapValue);
    return heatMapValue;
}

function getPointsYellow() {
    var heatMapValue = [];
    for (var i = 0; i < 30; i++) {
        heatMapValue[i] = { location: new google.maps.LatLng(randomLat[i], randomLong[i]), weight: responseData.pred[i][1] * 100 };
        // {location: new google.maps.LatLng(37.782, -122.447), weight: 0.5}
        console.log("Yellow");
        console.log(heatMapValue[i]);
    }
    // console.log("Dengue" + heatMapValue);
    return heatMapValue;
}

function getPointsZika() {
    var heatMapValue = [];
    for (var i = 0; i < 30; i++) {
        heatMapValue[i] = { location: new google.maps.LatLng(randomLat[i], randomLong[i]), weight: responseData.pred[i][2] * 100 };
        // {location: new google.maps.LatLng(37.782, -122.447), weight: 0.5}
        console.log("Zika");
        console.log(heatMapValue[i]);
    }
    // console.log("Dengue" + heatMapValue);
    return heatMapValue;
}

function selectData() {
    console.log(selectedValue.value);
    if (selectedValue.value == "dengue") {
        clickLatLan = [];
        getDengue();
    } else if (selectedValue.value == "yellowfever") {
        clickLatLan = [];
        getYellowFever();
    } else if (selectedValue.value == "zika") {
        clickLatLan = [];
        getZika();
    }
}

function addMarkerLocation(location, map, same) {
    // Add the marker at the clicked location, and add the next-available label
    // from the array of alphabetical characters.
    var marker = new google.maps.Marker({
        position: location,
        label: labels[same],
        map: map
    });
    selectMarkers.push(marker);
}

function addMarkerCenter(latLng, info) {
    let url = "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";

    let marker = new google.maps.Marker({
        map: map,
        position: latLng,
        icon: {
            url: url
        }
    });
    var infowindow = new google.maps.InfoWindow({
        content: info
    });
    marker.addListener('click', function() {
        infowindow.open(map, marker);
    });
    centralMarkers.push(marker);
}

function addMarker(location, map) {
    // Add the marker at the clicked location, and add the next-available label
    // from the array of alphabetical characters.
    var labelIndexValue;
    if (labelIndex % labels.length != same) {
        labelIndexValue = labelIndex++;
    } else {
        labelIndexValue = labelIndex;
    }
    var marker = new google.maps.Marker({
        position: location,
        label: labels[labelIndexValue],
        map: map
    });
    selectMarkers.push(marker);
}

function getDengue() {
    var MAP_BOUND = {
        north: 13.802012,
        south: 12.227601,
        west: 76.104601,
        east: 79.064102,
    };
    var vellore = new google.maps.LatLng(12.971599, 77.594566);
    var mapOptions = {
        restriction: {
            latLngBounds: MAP_BOUND,
            strictBounds: false,
        },
        zoom: 9,

        center: vellore,
        scrollwheel: false,
        styles: [{
            "featureType": "administrative.country",
            "elementType": "geometry",
            "stylers": [{
                    "visibility": "simplified"
                },
                {
                    "hue": "#ff0000"
                }
            ]
        }]
    };
    var mapElement = document.getElementById('map');

    map = new google.maps.Map(mapElement, mapOptions);
    heatmap = new google.maps.visualization.HeatmapLayer({
        data: getPointsDengue(),
        map: map
    });
    heatmap.setMap(map);
    heatmap.set('radius', heatmap.set('radius') ? null : 40);
    google.maps.event.addListener(map, "click", function(e) {

        //lat and lng is available in e object
        addMarker(e.latLng, map);
        clickLatLan.push(e.latLng);
        console.log(e.latLng);
    });

    map.addListener('zoom_changed', function() {
        // infowindow.setContent('Zoom: ' + map.getZoom());
        console.log(map.getZoom());
        if (map.getZoom() == 7) {
            heatmap.set('radius', heatmap.set('radius') ? null : 30);
        } else if (map.getZoom() == 8) {
            heatmap.set('radius', heatmap.set('radius') ? null : 30);
        } else if (map.getZoom() == 9) {
            heatmap.set('radius', heatmap.set('radius') ? null : 30);
        } else if (map.getZoom() == 10) {
            heatmap.set('radius', heatmap.set('radius') ? null : 30);
        } else if (map.getZoom() == 11) {
            heatmap.set('radius', heatmap.set('radius') ? null : 50);
        } else if (map.getZoom() == 12) {
            heatmap.set('radius', heatmap.set('radius') ? null : 70);
        } else if (map.getZoom() == 13) {
            heatmap.set('radius', heatmap.set('radius') ? null : 90);
        } else if (map.getZoom() == 14) {
            heatmap.set('radius', heatmap.set('radius') ? null : 110);
        } else if (map.getZoom() == 15) {
            heatmap.set('radius', heatmap.set('radius') ? null : 130);
        } else if (map.getZoom() == 16) {
            heatmap.set('radius', heatmap.set('radius') ? null : 150);
        } else {
            heatmap.set('radius', heatmap.set('radius') ? null : 170);
        }
    });
}


function getYellowFever() {
    var MAP_BOUND = {
        north: 13.802012,
        south: 12.227601,
        west: 76.104601,
        east: 79.064102,
    };
    var vellore = new google.maps.LatLng(12.971599, 77.594566);
    var mapOptions = {
        restriction: {
            latLngBounds: MAP_BOUND,
            strictBounds: false,
        },
        zoom: 9,

        center: vellore,
        scrollwheel: false,
        styles: [{
            "featureType": "administrative.country",
            "elementType": "geometry",
            "stylers": [{
                    "visibility": "simplified"
                },
                {
                    "hue": "#ff0000"
                }
            ]
        }]
    };
    var mapElement = document.getElementById('map');

    var map = new google.maps.Map(mapElement, mapOptions);
    heatmap = new google.maps.visualization.HeatmapLayer({
        data: getPointsYellow(),
        map: map
    });
    google.maps.event.addListener(map, "click", function(e) {

        addMarker(e.latLng, map);
        clickLatLan.push(e.latLng);
        console.log(e.latLng);

    });
    var gradient = [
        'rgba(0, 255, 255, 0)',
        'rgba(0, 255, 255, 1)',
        'rgba(0, 191, 255, 1)',
        'rgba(0, 127, 255, 1)',
        'rgba(0, 63, 255, 1)',
        'rgba(0, 0, 255, 1)',
        'rgba(0, 0, 223, 1)',
        'rgba(0, 0, 191, 1)',
        'rgba(0, 0, 159, 1)',
        'rgba(0, 0, 127, 1)',
        'rgba(63, 0, 91, 1)',
        'rgba(127, 0, 63, 1)',
        'rgba(191, 0, 31, 1)',
        'rgba(255, 0, 0, 1)'
    ]
    heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
    heatmap.set('radius', heatmap.set('radius') ? null : 40);
    map.addListener('zoom_changed', function() {
        // infowindow.setContent('Zoom: ' + map.getZoom());
        console.log(map.getZoom());
        if (map.getZoom() == 7) {
            heatmap.set('radius', heatmap.set('radius') ? null : 30);
        } else if (map.getZoom() == 8) {
            heatmap.set('radius', heatmap.set('radius') ? null : 30);
        } else if (map.getZoom() == 9) {
            heatmap.set('radius', heatmap.set('radius') ? null : 30);
        } else if (map.getZoom() == 10) {
            heatmap.set('radius', heatmap.set('radius') ? null : 30);
        } else if (map.getZoom() == 11) {
            heatmap.set('radius', heatmap.set('radius') ? null : 50);
        } else if (map.getZoom() == 12) {
            heatmap.set('radius', heatmap.set('radius') ? null : 70);
        } else if (map.getZoom() == 13) {
            heatmap.set('radius', heatmap.set('radius') ? null : 90);
        } else if (map.getZoom() == 14) {
            heatmap.set('radius', heatmap.set('radius') ? null : 110);
        } else if (map.getZoom() == 15) {
            heatmap.set('radius', heatmap.set('radius') ? null : 130);
        } else if (map.getZoom() == 16) {
            heatmap.set('radius', heatmap.set('radius') ? null : 150);
        } else {
            heatmap.set('radius', heatmap.set('radius') ? null : 170);
        }
    });
}

function getZika() {
    var MAP_BOUND = {
        north: 13.802012,
        south: 12.227601,
        west: 76.104601,
        east: 79.064102,
    };
    var vellore = new google.maps.LatLng(12.971599, 77.594566);
    var mapOptions = {
        restriction: {
            latLngBounds: MAP_BOUND,
            strictBounds: false,
        },
        zoom: 9,

        center: vellore,
        scrollwheel: false,
        styles: [{
            "featureType": "administrative.country",
            "elementType": "geometry",
            "stylers": [{
                    "visibility": "simplified"
                },
                {
                    "hue": "#ff0000"
                }
            ]
        }]
    };
    var mapElement = document.getElementById('map');

    var map = new google.maps.Map(mapElement, mapOptions);
    heatmap = new google.maps.visualization.HeatmapLayer({
        data: getPointsZika(),
        map: map
    });

    google.maps.event.addListener(map, "click", function(e) {

        //lat and lng is available in e object
        addMarker(e.latLng, map);
        clickLatLan.push(e.latLng);
        console.log(e.latLng);
    });

    var gradient = [
        'rgba(0, 255, 0, 0)',
        'rgba(82, 255, 82, 1)',
        'rgba(36, 255, 36, 1)',
        'rgba(0, 230, 0, 1)',
        'rgba(55, 174, 55, 1)',
        'rgba(37, 116, 37, 1)',
        'rgba(26, 81, 26, 1)',
        'rgba(81, 26, 50, 1)',
        'rgba(207, 7, 94, 1)',
        'rgba(8, 217, 50, 1)',
        'rgba(247, 43, 139, 1)',
        'rgba(247, 43, 71, 1)',
        'rgba(212, 8, 35, 1)',
        'rgba(255, 5, 5, 1)'
    ]
    heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
    heatmap.set('radius', heatmap.set('radius') ? null : 40);
    map.addListener('zoom_changed', function() {
        // infowindow.setContent('Zoom: ' + map.getZoom());
        console.log(map.getZoom());
        if (map.getZoom() == 7) {
            heatmap.set('radius', heatmap.set('radius') ? null : 30);
        } else if (map.getZoom() == 8) {
            heatmap.set('radius', heatmap.set('radius') ? null : 30);
        } else if (map.getZoom() == 9) {
            heatmap.set('radius', heatmap.set('radius') ? null : 40);
        } else if (map.getZoom() == 10) {
            heatmap.set('radius', heatmap.set('radius') ? null : 45);
        } else if (map.getZoom() == 11) {
            heatmap.set('radius', heatmap.set('radius') ? null : 50);
        } else if (map.getZoom() == 12) {
            heatmap.set('radius', heatmap.set('radius') ? null : 70);
        } else if (map.getZoom() == 13) {
            heatmap.set('radius', heatmap.set('radius') ? null : 90);
        } else if (map.getZoom() == 14) {
            heatmap.set('radius', heatmap.set('radius') ? null : 110);
        } else if (map.getZoom() == 15) {
            heatmap.set('radius', heatmap.set('radius') ? null : 130);
        } else if (map.getZoom() == 16) {
            heatmap.set('radius', heatmap.set('radius') ? null : 150);
        } else {
            heatmap.set('radius', heatmap.set('radius') ? null : 170);
        }
    });
}

function sendD() {
    // Creating a XHR object 
    let xhr = new XMLHttpRequest();
    let url = "http://192.168.43.126:5000/allocate_distribution_centres";

    // open a connection 
    xhr.open("POST", url, true);

    // Set the request header i.e. which type of content you are sending 
    xhr.setRequestHeader("Content-Type", "application/json");

    // Create a state change callback 
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            responseDataLocation = JSON.parse(this.responseText);
            // console.log(length(responseDataLocation));
            // console.log(responseDataLocation[1]["allocates"][0]);
            console.log(responseDataLocation[1]["allocates"]);
            console.log(responseDataLocation);
            setMapOnAll(null);
            setDistributerMarks();
            clickLatLan = [];
            // if (selectedValue.value == "dengue") {
            //     getDengue();
            // } else if (selectedValue.value == "yellowfever") {
            //     getYellowFever();
            // } else if (selectedValue.value == "zika") {
            //     getZika();
            // }
        }
    };

    // Converting JSON data to string 
    var data = JSON.stringify({ "hot_spots": myLatLng1, "p_centers": clickLatLan, "ahead": slider.value, "disease": selectedValue.value });
    console.log(data);
    // Sending data with the request 
    xhr.send(data);
}

function setDistributerMarks() {
    var totalKey = length(responseDataLocation);
    console.log(totalKey);
    for (var i = 1; i <= totalKey; i++) {
        //get the first centre
        var totalAllocate = length(responseDataLocation[i]["allocates"]);
        console.log(totalAllocate);
        for (var j = 0; j < totalAllocate; j++) {
            addMarkerLocation(responseDataLocation[i]["allocates"][j], map, i);
        }
        addMarkerLocation(responseDataLocation[i]["centre"], map, i);
        addMarkerCenter(responseDataLocation[i]["centre"], responseDataLocation[i]["info"]);
    }

}

function setMapOnAll(map) {
    for (var i = 0; i < selectMarkers.length; i++) {
        selectMarkers[i].setMap(map);
    }
}

function length(obj) {
    return Object.keys(obj).length;
}
google.maps.event.addDomListener(window, 'load', init);