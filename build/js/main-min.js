'use strict';

// Config
var token = '178595410.7e82061.56428f51fa2d4779856bf0af509aa91c';
var url = 'https://api.instagram.com/v1/users/self/media/recent/?access_token=' + token;
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
            success: function success(response) {
                console.log(response);
                build(response, city);
                chart(response);
            }
        });
    }

    // Clear DOM
    function clear() {
        $('.data').empty();
    }

    // Build DOM, Called by request function
    function build(response, city) {

        instaCoords = [];
        response.data.forEach(function (item) {

            var lat = item.location.latitude;
            var lng = item.location.longitude;

            instaCoords.push({
                coords: { lat: lat, lng: lng },
                likes: [item.likes.count],
                content: '<h1>' + item.user.username + '</h1>\n                <p>' + item.caption.text + '</p>',
                image: item.images.low_resolution.url
            });

            var media;

            if (item.videos) {
                media = '<video class="thumb"  controls>\n                <source src="' + item.videos.standard_resolution.url + '" type="video/mp4">\n              Your browser does not support the video tag.\n              </video>';
            } else {
                media = '<img class="thumb" src=\'' + item.images.standard_resolution.url + '\'/>';
            }

            var caption = item.caption.text;

            // change new lines to <br>
            caption = caption.replace(/(?:\r\n|\r|\n)/g, '<br />');

            // remove the hashtags
            caption = caption.slice(0, caption.indexOf("<br />."));

            var article = '<article>\n            <figure>\n                ' + media + '\n                <figcaption>\n                    <p class="fig-cap">\n                        <i class="fa fa-comment" aria-hidden="true"></i> ' + item.comments.count + '\n\n                        <i class="fa fa-heart" aria-hidden="true"></i> ' + item.likes.count + '\n                    </p>\n                </figcaption>\n            </figure>\n            <div class="content">\n                <p>' + caption + '</p>\n            </div>\n           </article>';

            buildDom(article, item, city);
            initMap(caption);
        });
    }

    function buildDom(article, item, city) {
        // If request was called with defaultCity
        if (city) {
            $(article).appendTo($('.data'));
        }
        // Else check the objects location name against the input value
        else if (item.location.name.toLowerCase().indexOf(geolocation) > -1) {
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

    function initMap() {
        var markers = [];
        // Map options
        var options = {
            zoom: 10,
            center: { lat: 53.7071, lng: -1.2437 }

            // New map
        };var map = new google.maps.Map(document.getElementById('map'), options);

        // Array of markers
        markers = instaCoords;

        // Loop through markers
        for (var i = 0; i < markers.length; i++) {
            // Add marker
            addMarker(markers[i]);
        }

        // Add Marker Function
        function addMarker(props) {
            var marker = new google.maps.Marker({
                position: props.coords,
                map: map
            });
            var image = props.image;
            var caption = props.content;

            // change new lines to <br>  
            caption = caption.replace(/(?:\r\n|\r|\n)/g, '<br />');
            // remove the hashtags
            caption = caption.slice(0, caption.indexOf("<br />."));

            caption = '<div class="marker">\n                        <img src="' + image + '" class="marker-thumb" />\n                        <p>' + caption + '</p>\n                    </div>';

            // Check content
            if (caption) {
                var infoWindow = new google.maps.InfoWindow({
                    content: caption
                });

                marker.addListener('click', function () {
                    infoWindow.open(map, marker);
                });
            }
        }
    }

    // -------------
    // Chart
    // -------------


    function chart(item) {
        var data = [];
        var date = [];
        for (var i = 0; i < item.data.length; i++) {
            data.push(item.data[i].likes.count);

            var formatDate = new Date(parseInt(item.data[i].created_time) * 1000);

            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            var year = formatDate.getFullYear();
            var month = months[formatDate.getMonth()];
            var ate = formatDate.getDate();
            var time = month + ', ' + ate + ' ' + year;
            date.push(time);
        }

        var ctx = document.getElementById("myChart").getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: date.reverse(),
                datasets: [{
                    label: "Likes",
                    data: data.reverse(),
                    backgroundColor: ['rgba(231, 66, 117, 0.2)'],
                    borderColor: ['rgba(231, 66, 117, 1.0)'],
                    borderWidth: 1
                }]
            },
            options: {
                legend: {
                    display: false
                }
            }
        });
    }
});
