"use strict"

var bookId = localStorage.getItem("selectedBookId");

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
                $('#book_name').text(item.Name);
                if (item.IsBook) {
                    $("#bookHref").attr("href", item.ReadingHref)
                }
                else {
                    $("#bookHref").attr("href", item.RadioHref)
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