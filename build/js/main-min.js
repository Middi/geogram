// Config
var token = '178595410.7e82061.56428f51fa2d4779856bf0af509aa91c';
var url = `https://api.instagram.com/v1/users/self/media/recent/?access_token=${token}`;
var geolocation;
var defaultCity = 'Knottingley';
var instaCoords = [];


$(function () {
    // Ajax Call
    function request(city) {
        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'jsonp',
            success: function (response) {
                console.log(response);
                instaCoords = [];
                build(response, city);
            }
        });
    }

    // Clear DOM
    function clear() {
        $('.data').empty();
    }

    // Build DOM, Called by request function
    function build(response, city) {

        response.data.forEach(function (item) {


            var lat = item.location.latitude;
            var lng = item.location.longitude;

            instaCoords.push({
                coords: {lat, lng},
                content:`<h1>${item.user.username}</h1>
                <p>${item.caption.text}</p>`
            });

            var media;
            
            if(item.videos){
                media = `<video class="thumb"  controls>
                <source src="${item.videos.standard_resolution.url}" type="video/mp4">
              Your browser does not support the video tag.
              </video>`;
            }
            else {
                media = `<img class="thumb" src='${item.images.standard_resolution.url}'/>`;
            }


            var article = `<article>
            ${media}
            <p>${item.likes.count} - Likes</p>
           </article>`;
           
            buildDom(article, item, city);
            initMap();
        });
    }


    function buildDom(article, item, city){
        // If request was called with defaultCity
        if(city){
            $(article).appendTo($('.data'));
        }
        // Else check the objects location name against the input value
        else if(item.location.name.toLowerCase().indexOf(geolocation) > -1) {
            $(article).appendTo($('.data'));
        }
    }


    // Call request
    request(defaultCity);

    // ----------------
    // Get Input
    // ----------------

    // --- On Enter Key --- //
    $("input").on("keydown", function search(e) {
        if (e.keyCode === 13) {
            clear();
            // if input is not empty then call the request with the value
            if ($('input').val() !== "") {
                geolocation = $("input").val().toLowerCase();
                request();
            }
            // if it is empty, use default value
            else {
                request(defaultCity);
            }
        }
    });
    


    // -------------
    // Google Maps
    // -------------

    function initMap(){
        // Map options
        var options = {
          zoom:10,
          center:{lat:53.7071,lng:-1.2437}
        }
  
        // New map
        var map = new google.maps.Map(document.getElementById('map'), options);
  
        // Array of markers
        var markers = instaCoords;
  
        // Loop through markers
        for(var i = 0;i < markers.length;i++){
          // Add marker
          addMarker(markers[i]);
        }
  
        // Add Marker Function
        function addMarker(props){
          var marker = new google.maps.Marker({
            position:props.coords,
            map:map,
          });
  
          // Check content
          if(props.content){
            var infoWindow = new google.maps.InfoWindow({
              content:props.content
            });
  
            marker.addListener('click', function(){
              infoWindow.open(map, marker);
            });
          }
        }
      }

});

