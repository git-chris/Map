
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
                html:poi.name+'<hr><img src="https://maps.googleapis.com/maps/api/streetview?size=400x400&location='+poi.lat+','+poi.lon+'"></img>'                                          
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
    $("#weatherBox").hide();
    $.getJSON("https://api.worldweatheronline.com/free/v2/weather.ashx?key=161b7267009ac46bba0ead639ae1a&format=Json&q=Patras+GREECE&num_of_days=1", function(r){
        console.log(r);        
        $("#weatherBox").append("Today:"+r.data.weather[0].date+"<br>");
        var img = document.createElement('img');
        img.src = r.data.current_condition[0].weatherIconUrl[0].value;
        document.getElementById('wicon').appendChild(img);
        $("#weatherBox").append("Temp (&deg;C): "+r.data.weather[0].mintempC+"&deg;......"+r.data.weather[0].maxtempC+"&deg;");
        $("#weatherBox").append("<br>Right now: <br>Wind_Dir:"+r.data.current_condition[0].winddir16Point+"<br>");            
        $("#weatherBox").append("Wind_Speed:"+r.data.current_condition[0].windspeedKmph+" km<br>");
        $("#weatherBox").append("Humidity: "+r.data.current_condition[0].humidity+"<hr>");
    }).error(function(e){$("#weatherBox").append("Something Went Wrong With The Request");});
    
    $("#GoogleInsights").hide();
    $.getJSON("https://www.googleapis.com/pagespeedonline/v2/runPagespeed?url="+document.URL,function(r){
                $("#wait").hide();
                console.log(r);
                rules=r.formattedResults.ruleResults;                
                $("#GoogleInsights").append('Site is : '+r.id);
                $("#GoogleInsights").append('<br>Page Score: '+r.ruleGroups.SPEED.score);
                $("#GoogleInsights").append("<br><p>Things That Need Attention</p><hr>");
                
                $("#GoogleInsights").append("<tr><td><u>Rule</td><td><u>Rule Impact</td></tr>");
                for(rule in rules){                    
                    if(rules[rule].ruleImpact){$("#GoogleInsights").append("<tr><td class='rule'>"+rules[rule].localizedRuleName+"<p class='disc'>"+rules[rule].summary.format+"</p></td><td>"+rules[rule].ruleImpact+"</td></tr>");};              
                };
                
                
            }).error(function(e){$("#wait").hide();$("#GoogleInsights").append('<h3 style="text-center">Error with Connection</h3>');});
            
    

    var pois = [
        {name:'Archeological Museum',lat: 38.263347,lon:21.752353,type:'Mus',id:0},
        {name:'Folk Arts Museum',lat: 38.234798,lon:21.731757,type:'Mus',id:1},
        {name:'Press Museum',lat:38.241329,lon:21.728152,type:'Mus',id:2},
        {name:'Science and Arts Museum',lat:38.287776,lon:21.784623,type:'Mus',id:3},    
        {name:'ATEI Patron-Technological Schools',lat:38.218946,lon:21.747986,type:'Edu',id:4},
        {name:'Patras University',lat:38.28923,lon:21.785369,type:'Edu',id:5},    
        {name:'Pantheon Theatre',lat:38.243736,lon:21.733046,type:'The',id:6},
        {name:'Apollon - Town Theatre',lat:38.246777,lon:21.734509,type:'The',id:7},
        {name:"Faros - Town's Old Lighthouse",lat:38.24775,lon:21.728294,type:'Other',id:8},
        {name:'Town Center-King Georgios the 1st Square',lat:38.2462754,lon:21.7345912,type:'Other',id:9},
        {name:'Ginger Restaurant',lat:38.245427,lon:21.731836,type:'Food',id:10},
        {name:'Krokos',lat:38.248483,lon:21.737057,type:'Food',id:11},
        {name:'Pizza Express',lat:38.2490144,lon:21.7456058,type:'Food',id:12},
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
            $('#GoogleInsights').toggle('slow');
        });   
    });

    


     
$(function() { 
        var viewModel = {
            //make filter search observable
            query: ko.observable(''),
            //function that connects list divs with markers
            mark :  function(poi){
                google.maps.event.trigger(gmarkers[poi.id],'click');
            }                             
        };


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
