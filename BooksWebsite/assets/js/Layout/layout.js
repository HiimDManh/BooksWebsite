"use strict"

$("#kt_aside").on('resize', (event, data) => {
    console.log(`New size - Width: ${data.width}, Height: ${data.height}`);

    // Example: Change color dynamically
    if(data.width <= 64) {
        $(".logo-text").attr("hidden", true);
    } else {
        $(".logo-text").attr("hidden", false);
    }
});
GetCurrrentUser()
function GetCurrrentUser() {
    $.ajax({
        url: '/User/GetCurrentUser',
        type: 'get',
        success: function (data) {
            if (data.code === 200) {
                $('#accountCurrent').text(data.acc)
            } else {

            }
        },
        error: function () {

        }
    })
}
