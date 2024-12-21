"use strict"

var bookId = localStorage.getItem("selectedBookId");

// This card is lazy initialized using data-card="true" attribute. You can access to the card object as shown below and override its behavior
var card = new KTCard('kt_card_3');


// Reload event handlers
card.on('reload', function (card) {
    toastr.info('Leload event fired!');

    KTApp.block(card.getSelf(), {
        overlayColor: '#ffffff',
        type: 'loader',
        state: 'primary',
        opacity: 0.3,
        size: 'lg'
    });

    // update the content here

    setTimeout(function () {
        KTApp.unblock(card.getSelf());
    }, 2000);
});

$(document).on('click', '#uploadBtn', function (e) {
    e.preventDefault();

    // Create a FormData object to send file and bookID
    var formData = new FormData();
    var fileInput = $('#voiceFile')[0].files[0];

    if (!fileInput) {
        toastr.warning("Chưa có dữ liệu!");
        return;
    }

    formData.append('voiceFile', fileInput);
    formData.append('bookID', bookId);

    // AJAX request to upload the file
    $.ajax({
        url: '/Book/UploadVoice', // Adjust to your controller action
        type: 'POST',
        data: formData,
        processData: false, // Important for file upload
        contentType: false, // Important for file upload
        success: function (response) {
            $('#uploadStatus').text("Upload successful!");
            console.log(response);
        },
        error: function (xhr, status, error) {
            $('#uploadStatus').text("Upload failed: " + error);
            console.error(xhr.responseText);
        }
    });
});

$(document).on('click', '#expandBtn', function () {
    LoadComment();
})

function LoadComment() {
    $.ajax({
        /*  url: host+'/Account/loginapi',*/
        url: '/Book/GetComment',
        type: 'get',
        data: {
            bookID: bookId,
        },
        success: function (data) {
            if (data.code == 500)
                toastr.error(data.message)
            else {
                var div = ``;
                data.book.forEach((e) => {
                    div += `<div class="media g-mb-30 media-comment">
                    <img class="d-flex g-width-50 g-height-50 rounded-circle g-mt-3 g-mr-15" src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="Image Description">
                    <div class="media-body u-shadow-v18 g-bg-secondary g-pa-30">
                        <div class="g-mb-15">
                            <h5 class="h5 g-color-gray-dark-v1 mb-0 text-primary">${e.UserID}</h5>
                            <span class="g-color-gray-dark-v4 g-font-size-12">${e.Time}</span>
                        </div>

                        <p class="text-dark fs-3 fw-3">
                            ${e.Comment}
                        </p>
                    </div>
                </div>`
                })
                $('#commentList').append(div);
            }
        },
        error: function (data) {
            swal.fire({
                title: "Có lỗi!",
                text: data.message,
                icon: "error",
                heightAuto: false,
                buttonsStyling: false,
                confirmButtonText: "Ok!",
                customClass: {
                    confirmButton: "btn font-weight-bold btn-light-primary"
                }
            }).then(function () {
                KTUtil.scrollTop();
            });
        }
    })
}

$(document).on('click', '#sendComment', function () {
    var comment = $('#commentContent').val().trim()
    if (comment == "") {
        toastr.warning('Không có gì để gửi!');
        $('#commentContent').val("")
    }
    else {
        $.ajax({
            /*  url: host+'/Account/loginapi',*/
            url: '/Book/SendPreviewComment',
            type: 'Post',
            data: {
                bookID: bookId,
                comment: comment,
            },
            success: function (data) {
                if (data.code == 500)
                    toastr.error(data.message)
                else {
                    toastr.success(data.msg)
                    $('#commentContent').val("")
                    LoadComment();
                }
            },
            error: function (data) {
                swal.fire({
                    title: "Có lỗi!",
                    text: data.message,
                    icon: "error",
                    heightAuto: false,
                    buttonsStyling: false,
                    confirmButtonText: "Ok!",
                    customClass: {
                        confirmButton: "btn font-weight-bold btn-light-primary"
                    }
                }).then(function () {
                    KTUtil.scrollTop();
                });
            }
        })
    }

})

var Inittialization = function () {
    var Book = function () {
        var num = Number(bookId)
        $.ajax({
            /*  url: host+'/Account/loginapi',*/
            url: '/Book/GetBook',
            type: 'Post',
            data: { ID: num },
            success: function (data) {
                var item = data.book
                $("#img").attr("src", item.CoverSrc) 
                $("#img").attr("alt", item.Name)
                
                if (item.IsBook) {
                    $('#book_name').text(item.Name);
                    $("#bookHref").attr("value", item.ReadingHref)
                }
                else {
                    $('#book_name').text("Radio " + item.Name);
                    $('#type-book').text("Nghe radio sách");
                    $("#bookHref").attr("value", item.RadioHref)
                }
            },
            error: function (data) {
                swal.fire({
                    title: "Có lỗi!",
                    text: data.message,
                    icon: "error",
                    heightAuto: false,
                    buttonsStyling: false,
                    confirmButtonText: "Ok!",
                    customClass: {
                        confirmButton: "btn font-weight-bold btn-light-primary"
                    }
                }).then(function () {
                    KTUtil.scrollTop();
                });
            }
        })

        $(document).on("click", "#answerBtn", function () {
            window.location.href = "/BookQuestion/index" 
        })

        $(document).on("click", "#bookHref",function (e) {
            e.preventDefault(); // Prevent the default action of the link

            // Perform your custom logic here
            let linkUrl = $(this).attr('value'); // Get the current href value
            if (linkUrl) {
                window.open(linkUrl, '_blank'); // Open the link in a new tab
            } else {
                alert('No URL is set for this link!');
            }
        });

        //$("#bookHref").on("click", function () {
        //    window.location.href($(this).attr("value"))
        //});
    }

    return {
        init: function () {
            Book();
        },
    }
}();

jQuery(document).ready(function () {
    Inittialization.init();
});