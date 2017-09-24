$(function() {

    var token = '178595410.7e82061.56428f51fa2d4779856bf0af509aa91c';

    var url = `https://api.instagram.com/v1/users/self/media/recent/?access_token=${token}`;

    
    $.ajax({
        type: 'GET',
        url: url,
        dataType: 'jsonp',
        success: function(response){
            console.log(response);
        }
    });
    

});