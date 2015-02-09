/*
 * the array for all my markers
 * I used it for connecting the list items with the actual markers 
 */
var gmarkers=new Array();

/*
 * In this function google maps is set to start options
 * Markers from pois are set
 */
function initialize() {
    var mapCanvas = document.getElementById('map-canvas');
    var mapOptions = {
        center: new google.maps.LatLng(38.246507, 21.734597),
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(mapCanvas, mapOptions);
    var infowindow = new google.maps.InfoWindow();
    
    
    /*
     * added a listener for always having a marker as center of map
     */
    google.maps.event.addDomListener(window, 'resize', function() {
        map.setCenter(current_marker.position);
    });

    /*
     * loop for creating markers on map initialize
     */
    for (var i = 0; i < pois.length; i++) {
        var poi = pois[i];
        var myLatLng = new google.maps.LatLng(poi.lat, poi.lon);
        gmarkers[i] = new google.maps.Marker({
            position: myLatLng,
            map: map,
            title: poi.name ,
            //request for picture from streetview
            html:poi.name+'<hr><img src="https://maps.googleapis.com/maps/api/streetview?size=200x100&location='+poi.lat+','+poi.lon+'"></img>'
        });

        current_marker=gmarkers[0];//set current marker for checking with the bounce function

        google.maps.event.addListener(gmarkers[i], 'click', function () {
            infowindow.setContent(this.html);
            infowindow.open(map,this);
            bounce(this);
        });
        
        /*
         *function that checks for current marker
         *then bounces new one after stopping the first
         *if same marker then stops animation and zooms
         *out 
         */
        function bounce(marker){
            if(marker==current_marker){
                if (marker.getAnimation() != null) {
                    marker.setAnimation(null);
                    map.setZoom(12);
                    infowindow.close();
               } else {
                    marker.setAnimation(google.maps.Animation.BOUNCE);
                    map.setCenter(marker.position);
                    map.setZoom(17);
                }
            }else{
                current_marker.setAnimation(null);
                current_marker=marker;
                bounce(marker);
            }
        };
    };
};

/*
 *makes the weather element dragable 
 */
$(function() {
    $("#wea").draggable();
});

/*
 * set initially as hidden the boxes for weather and google Insights
 */
$("#GoogleInsights").hide();
$("#weatherBox").hide();

/*
 * table of my Points of Interest for my city map
 */
var pois = [
    {name:'Archeological Museum',lat: 38.263347,lon:21.752353,type:'Mus',id:0},
    {name:'Folk Arts Museum',lat: 38.234798,lon:21.731757,type:'Mus',id:1},
    {name:'Press Museum',lat:38.241329,lon:21.728152,type:'Mus',id:2},
    {name:'Science and Arts Museum',lat:38.287776,lon:21.784623,type:'Mus',id:3},
    {name:'ATEI Patron-Technological Schools',lat:38.218946,lon:21.747986,type:'Edu',id:4},
    {name:'Patras University',lat:38.28923,lon:21.785369,type:'Edu',id:5},
    {name:'Pantheon Theatre',lat:38.243546,lon:21.733261,type:'The',id:6},
    {name:'Apollon - Town Theatre',lat:38.246777,lon:21.734509,type:'The',id:7},
    {name:"Faros - Town's Old Lighthouse",lat:38.24775,lon:21.728294,type:'Other',id:8},
    {name:'Town Center-King Georgios the 1st Square',lat:38.2462754,lon:21.7345912,type:'Other',id:9},
    {name:'Ginger Restaurant',lat:38.245427,lon:21.731836,type:'Food',id:10},
    {name:'Krokos',lat:38.248483,lon:21.737057,type:'Food',id:11},
    {name:'Pizza Express',lat:38.2490144,lon:21.7456058,type:'Food',id:12},
    {name:'Gelatino',lat:38.2425114,lon:21.730485,type:'Food',id:13}
];

/*
 * sidelist slider function & toggle weather Box
 */
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
    $('#wea').click(function(){
        $('#weatherBox').slideToggle();
    });
    $('#Insights').click(function(){
        $('#GoogleInsights').toggle('slow');
    });
});

/*
 * View Model function
 */
$(function() {
    /*
     * here I set all observable vars and arrays
     */
    var viewModel = {
        // filter search 
        query: ko.observable(''),
        //function that connects list divs with markers
        mark :  function(poi){
            google.maps.event.trigger(gmarkers[poi.id],'click');
        },        
        //weather data        
        temp:ko.observable(''),
        humidity:ko.observable(''),
        iconUrl:ko.observable(''),
        date:ko.observable(''),
        mintemp:ko.observable(''),
        maxtemp:ko.observable(''),
        //variables for hiding and showing fail messages after json requests
        wVis:ko.observable(true),
        sVis:ko.observable(true),
        waitVis:ko.observable(true),
        //array of rules from google insights request
        rules:ko.observableArray(''),
        speed:ko.observable(''),
        //icons from body
        listIcon: ko.observable('images/list.png'),
        waitIcon: ko.observable('images/page-loader.gif'),
        speedIcon: ko.observable('images/pagespeed.png')
    };
    
    /*
     * JSON Request for weather data from worldweatherOnline
     */
    $.getJSON("https://api.worldweatheronline.com/free/v2/weather.ashx?key=161b7267009ac46bba0ead639ae1a&format=Json&q=Patras+GREECE&num_of_days=1",function(r){
    }).success(function(r){
        viewModel.temp(r.data.current_condition[0].temp_C);
        viewModel.humidity(r.data.current_condition[0].humidity);
        viewModel.iconUrl(r.data.current_condition[0].weatherIconUrl[0].value);
        viewModel.date(r.data.weather[0].date);
        viewModel.mintemp(r.data.weather[0].mintempC);
        viewModel.maxtemp(r.data.weather[0].maxtempC);
    }).error(function(e){
        viewModel.wVis(false);
    });
    
    /*
     * JSON request from Google insights
     * save only the rules that will have an affect on speed
     * and overall speed score
     * While getting response gif loader displays
     * Link works for hosting online
     * In the case you want to check localy then replace the code document.URL with an appropriate url of another page you want to check
     * for example "......?url=http://www.example.com"
     */
    $.getJSON("https://www.googleapis.com/pagespeedonline/v2/runPagespeed?url="+document.URL,function(r){
    }).success(function(r){
        viewModel.waitVis(false);
        viewModel.speed(r.ruleGroups.SPEED.score);
        var result=r.formattedResults.ruleResults;
        for(var i in result){
            if(result[i].ruleImpact){
                viewModel.rules.push(result[i]);
            };
        };
    }).error(function(e){
        viewModel.sVis(false);
    });
    
    /*
     * function that filters pois from list by type
     */
    viewModel.pois = ko.dependentObservable(function() {
        var search = this.query().toLowerCase();
        return ko.utils.arrayFilter(pois, function(poi) {
            return poi.type.toLowerCase().indexOf(search) >= 0;
        });
    }, viewModel);

    google.maps.event.addDomListener(window, 'load', initialize);

    ko.applyBindings(viewModel);
});












//161b7267009ac46bba0ead639ae1a weather api key
//AIzaSyBgbQ78nAQhntvFyvQcO9LQ844hds9aTAU&latlng google api key
