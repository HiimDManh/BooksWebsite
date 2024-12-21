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

$(document).on('click', '#qr1', function () {
    $('#modalContent').empty();
    var div = `<img id="qr" alt="tusach" src="/assets/media/users/qr_sach.jpg" />
                        <h4 class="text-center mt-4">Quét QR để xem<br />Tủ sách điện tử Tổng Bí thư Nguyễn Phú Trọng</h4>`
    $('#modalContent').append(div);
    $('#qrModal').modal('show');
})

$(document).on('click', '#qr2', function () {
    $('#modalContent').empty();
    var div = `<img id="qr" alt="tusach" src="/assets/media/mascot/barcode.png" />
                        <h4 class="text-center mt-4">Quét QR để xem<br />Thư viện sách tỉnh Gia Lai</h4>`
    $('#modalContent').append(div);
    $('#qrModal').modal('show');
})

$(document).ready(function () {
    
    // Handle form submission
    $('#avatarForm').submit(function (e) {
        e.preventDefault(); // Prevent default form submission

        // Get the file input
        var formData = new FormData();
        var fileInput = $('#avatar')[0].files[0];

        if (fileInput) {
            formData.append('avatar', fileInput);

            // AJAX request to upload the avatar
            $.ajax({
                url: '/home/ChangeAvatar', // Your POST API endpoint
                type: 'POST',
                data: formData,
                processData: false, // Prevent jQuery from processing data
                contentType: false, // Prevent jQuery from overriding content-type
                success: function (response) {
                    alert('Avatar uploaded successfully!');

                    // Fetch and display the uploaded avatar
                    GetCurrrentUser();
                },
                error: function (xhr, status, error) {
                    console.error('Error uploading avatar:', error);
                },
            });
        } else {
            alert('Please select a file to upload.');
        }
    });

    // Function to fetch and display the uploaded avatar
    
});


function GetCurrrentUser() {
    $.ajax({
        url: '/User/GetCurrentUser',
        type: 'get',
        success: function (data) {
            if (data.code === 200) {
                $('#accountCurrent').text(data.acc)
            } else {

            }
            //if (data.avt) {
            //    $('#avatarSide').attr('src', data.avt);
            //} else {
            //    alert('No avatar found.');
            //}
        },
        error: function () {

        }
    })
}

$(document).on({
    ajaxStart: function () {
        $("#wait").attr("hidden", false);
    },
    ajaxStop: function () {
        $("#wait").attr("hidden", true);
    }
});

toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-right",
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
