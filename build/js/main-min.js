// Config
var token = '178595410.7e82061.56428f51fa2d4779856bf0af509aa91c';

var url = `https://api.instagram.com/v1/users/self/media/recent/?access_token=${token}`;

var geolocation = "knottingley";


$(function () {

    // Ajax Call
    function request() {
        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'jsonp',
            success: function (response) {
                console.log(response);
                build(response);
            }
        });
    }

    // Build DOM, Called by request function
    function build(response) {
        response.data.forEach(function (item) {

            if(item.location.name.toLowerCase() === geolocation) {
                $(`<article>
                <img src='${item.images.standard_resolution.url}'/>
                <p>${item.likes.count} - Likes</p>
               </article>`).appendTo($('.data'));
            }
        });
    }

    // Call request
    request();


});

