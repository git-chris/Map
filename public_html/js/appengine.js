function initialize() {
    var mapCanvas = document.getElementById('map-canvas');
    var mapOptions = {
        center: new google.maps.LatLng(38.246507, 21.734597),
        zoom: 11,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(mapCanvas, mapOptions);       
    setMarkers(map,pois);
};

google.maps.event.addDomListener(window, 'load', initialize);

var pois = [
    {name:'Archeological Museum',lat: 38.263280, lon:21.752264},
    {name:'Folk Arts Museum',lat: 38.235104,lon: 21.731665},
    {name:'Press Museum',lat:38.241323,lon: 21.728168},
    {name:'Science and Arts Museum',lat:38.287915,lon: 21.784392},    
    {name:'ATEI Patron-Technological Schools',lat:38.218892,lon: 21.747981},
    {name:'Patras University',lat:38.286375,lon: 21.786380},
    {name:'Achaia Clauss Vinyard',lat:38.161603,lon: 21.806307},
    {name:'Pantheon Theatre',lat:38.243550,lon: 21.733256},
    {name:'Apollon - Town Theatre',lat:38.246488,lon: 21.735316},
    {name:"Faros - Town's Old Lighthouse",lat:38.247767,lon: 21.728286},
    {name:'Town Center-King Georgios the 1st Square',lat:38.246284,lon: 21.735078}
];

function setMarkers(map,locations) {
    for (var i = 0; i < locations.length; i++) {
    var poi = locations[i];
    var myLatLng = new google.maps.LatLng(poi.lat, poi.lon);
    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: poi.name
    });
    };
};


$(document).ready(function(){
    $('#list-button').click(function() {
        if($(this).css("margin-right") == "200px") {
            $('#list').animate({"margin-right": '-=200'});
            $('#list-button').animate({"margin-right": '-=200'});
        }else {
            $('#list').animate({"margin-right": '+=200'});
            $('#list-button').animate({"margin-right": '+=200'});
        }
    });
})(jQuery);

var viewModel = { 
    places : ko.observableArray(pois)
    
};

ko.applyBindings(viewModel);
