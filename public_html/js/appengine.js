
var gmarkers=new Array();

    function initialize() {
        var mapCanvas = document.getElementById('map-canvas');
        var mapOptions = {
            center: new google.maps.LatLng(38.246507, 21.734597),
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(mapCanvas, mapOptions); 
        var infowindow = new google.maps.InfoWindow();

        //create markers on map initialize
        for (var i = 0; i < pois.length; i++) {
            var poi = pois[i];        
            var myLatLng = new google.maps.LatLng(poi.lat, poi.lon);        
            gmarkers[i] = new google.maps.Marker({
                position: myLatLng,
                map: map,                
                title: poi.name ,
                html:poi.name+'<hr><img src="https://maps.googleapis.com/maps/api/streetview?size=1080x720&location='+poi.lat+','+poi.lon+'"></img>'                                          
            });

            var current_marker=gmarkers[0];//set current marker for checking with the bounce function

            google.maps.event.addListener(gmarkers[i], 'click', function () {
                infowindow.setContent(this.html);
                infowindow.open(map,this);
                bounce(this);                
            });
             
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
    
    $(function() {
        $("#wea").draggable();       
    });

    //get weather data
    $.getJSON("https://api.worldweatheronline.com/free/v2/weather.ashx?key=161b7267009ac46bba0ead639ae1a&format=Json&q=Patras+GREECE&num_of_days=1", function(r){
        console.log(r);
        $("#weatherBox").hide();
        $("#weatherBox").append("Today:"+r.data.weather[0].date+"<br>");
        var img = document.createElement('img');
        img.src = r.data.current_condition[0].weatherIconUrl[0].value;
        document.getElementById('wicon').appendChild(img);
        $("#weatherBox").append("Temp (&deg;C): "+r.data.weather[0].mintempC+"&deg;......"+r.data.weather[0].maxtempC+"&deg;");
        $("#weatherBox").append("<br>Right now: <br>Wind_Dir:"+r.data.current_condition[0].winddir16Point+"<br>");            
        $("#weatherBox").append("Wind_Speed:"+r.data.current_condition[0].windspeedKmph+" km<br>");
        $("#weatherBox").append("Humidity: "+r.data.current_condition[0].humidity+"<hr>");
    }).error(function(e){$("#weatherBox").append("Something Went Wrong With The Request");});

    var pois = [
        {name:'Archeological Museum',lat: 38.263280, lon:21.752264,type:'Mus',id:0},
        {name:'Folk Arts Museum',lat: 38.235104,lon: 21.731665,type:'Mus',id:1},
        {name:'Press Museum',lat:38.241323,lon: 21.728168,type:'Mus',id:2},
        {name:'Science and Arts Museum',lat:38.287907, lon:21.784634,type:'Mus',id:3},    
        {name:'ATEI Patron-Technological Schools',lat:38.218944,lon: 21.747987,type:'Edu',id:4},
        {name:'Patras University',lat:38.287776,lon:21.784623,type:'Edu',id:5},    
        {name:'Pantheon Theatre',lat:38.243550,lon: 21.733256,type:'The',id:6},
        {name:'Apollon - Town Theatre',lat:38.246488,lon: 21.735316,type:'The',id:7},
        {name:"Faros - Town's Old Lighthouse",lat:38.247767,lon: 21.728286,type:'Other',id:8},
        {name:'Town Center-King Georgios the 1st Square',lat:38.246284,lon: 21.735078,type:'Other',id:9},
        {name:'Ginger Restaurant',lat:38.245423,lon: 21.731836,type:'Food',id:10},
        {name:'Krokos',lat:38.248464,lon :21.737076,type:'Food',id:11},
        {name:'Pizza Express',lat:38.252137,lon:21.743126,type:'Food',id:12},
        {name:'Gelatino',lat:38.2425114,lon:21.730485,type:'Food',id:13}
    ];



    //sidelist slider & hide-show weather
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
            $('#GoogleInsights').slideToggle();
        });
        $('#Insights').click(function(){
            $('#result').slideToggle();
        });   
    });

    


     
$(function() { 
        var viewModel = {
            //make filter search observable
            query: ko.observable(''),
            //function that connects list divs with markers
            mark :  function(poi){
                google.maps.event.trigger(gmarkers[poi.id],'click');
            },
            url: ko.observable(null)//url provided by the user for speedTest by Google Insights                              
        };


        viewModel.pois = ko.dependentObservable(function() {
            var search = this.query().toLowerCase();
            return ko.utils.arrayFilter(pois, function(poi) {
                return poi.type.toLowerCase().indexOf(search) >= 0;
            });
        }, viewModel);

        viewModel.speedTest=function(url){
            var self=this;                   
            $.getJSON("https://www.googleapis.com/pagespeedonline/v2/runPagespeed?url="+self.url(),function(r){
                                
            });
        };

    google.maps.event.addDomListener(window, 'load', initialize);

    ko.applyBindings(viewModel);
});












//161b7267009ac46bba0ead639ae1a weather api key
