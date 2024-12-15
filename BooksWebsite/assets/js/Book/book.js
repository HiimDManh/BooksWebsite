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