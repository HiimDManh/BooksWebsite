"use strict"

$("#kt_aside").on('resize', (event, data) => {
    console.log(`New size - Width: ${data.width}, Height: ${data.height}`);

    // Example: Change color dynamically
    if (data.width <= 64) {
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
toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": true,
    "positionClass": "toast-top-full-width",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
};
