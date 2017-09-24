// Config
var token = '178595410.7e82061.56428f51fa2d4779856bf0af509aa91c';
var url = `https://api.instagram.com/v1/users/self/media/recent/?access_token=${token}`;
var geolocation;
var defaultCity = 'Knottingley';


$(function () {
    // Ajax Call
    function request(city) {
        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'jsonp',
            success: function (response) {
                console.log(response);
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

            var media;
            
            if(item.videos){
                media = `<video width="320" height="240" controls>
                <source src="${item.videos.standard_resolution.url}" type="video/mp4">
              Your browser does not support the video tag.
              </video>`;
            }
            else {
                media = `<img src='${item.images.standard_resolution.url}'/>`;
            }

            var article = `<article>
            ${media}
            <p>${item.likes.count} - Likes</p>
           </article>`;
           
            // If request was called with defaultCity
            if(city){
                $(article).appendTo($('.data'));
            }
            // Else check the objects location name against the input value
            else if(item.location.name.toLowerCase().indexOf(geolocation) > -1) {
                $(article).appendTo($('.data'));
            }
        });
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

});