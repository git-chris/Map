var gmarkers=new Array();
function initialize() {
    var mapCanvas = document.getElementById('map-canvas');
    var mapOptions = {
        center: new google.maps.LatLng(38.246507, 21.734597),
        zoom: 11,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(mapCanvas, mapOptions); 
    var infowindow = new google.maps.InfoWindow();

    //create markers on map initialize
    
        for (var i = 0; i < pois.length; i++) {
            var poi = pois[i];        
            var myLatLng = new google.maps.LatLng(poi.lat, poi.lon);        
            var marker = new google.maps.Marker({
                position: myLatLng,
                map: map,
                title: poi.name ,
                html:'<img src="https://maps.googleapis.com/maps/api/streetview?size=400x400&location='+poi.lat+','+poi.lon+'"></img>'                          
            });
            google.maps.event.addListener(marker, 'click', function () {            
                infowindow.setContent(this.html);
                infowindow.open(map,this);
            });
            gmarkers[poi.name]=marker;             
        };
};


var pois = [
    {name:'Archeological Museum',lat: 38.263280, lon:21.752264,type:'Mus'},
    {name:'Folk Arts Museum',lat: 38.235104,lon: 21.731665,type:'Mus'},
    {name:'Press Museum',lat:38.241323,lon: 21.728168,type:'Mus'},
    {name:'Science and Arts Museum',lat:38.287915,lon: 21.784392,type:'Mus'},    
    {name:'ATEI Patron-Technological Schools',lat:38.218892,lon: 21.747981,type:'Edu'},
    {name:'Patras University',lat:38.286375,lon: 21.786380,type:'Edu'},
    {name:'Achaia Clauss Vinyard',lat:38.161603,lon: 21.806307,type:'Other'},
    {name:'Pantheon Theatre',lat:38.243550,lon: 21.733256,type:'The'},
    {name:'Apollon - Town Theatre',lat:38.246488,lon: 21.735316,type:'The'},
    {name:"Faros - Town's Old Lighthouse",lat:38.247767,lon: 21.728286,type:'Other'},
    {name:'Town Center-King Georgios the 1st Square',lat:38.246284,lon: 21.735078,type:'Other'},
    
];




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
    
    //weather data
    $.getJSON("https://api.worldweatheronline.com/free/v2/weather.ashx?key=161b7267009ac46bba0ead639ae1a&format=Json&q=Patras+GREECE&num_of_days=2&date=today", function(r){
        current_temp_F=r.data.current_condition[0].temp_F;
        current_temp_C=r.data.current_condition[0].temp_C;
        current_condition=r.data.current_condition[0].weatherDesc[0].value;  
        humidity=r.data.current_condition[0].humidity;
        wind_speed_kmph =r.data.current_condition[0].windspeedKmph;

    }).error(function(e){console.log("Something Went Wrong");});
    
    
});

$(function() {   

    var viewModel = {
        query: ko.observable('')
    };

    viewModel.pois = ko.dependentObservable(function() {
        var search = this.query().toLowerCase();
        return ko.utils.arrayFilter(pois, function(poi) {
            return poi.type.toLowerCase().indexOf(search) >= 0;
        });

    }, viewModel);
    ko.applyBindings(viewModel);
});


google.maps.event.addDomListener(window, 'load', initialize);











//8ee0cf1d392a49a8ed5c727eaf0b4c99 openweather api key
//161b7267009ac46bba0ead639ae1a 2nd weather api
//flickr key 7de517dfdf7b6566d3db753f9fa67946
//flickr secret 01f5baa955380079