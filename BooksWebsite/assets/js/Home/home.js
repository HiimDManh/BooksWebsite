"use strict"

let number = document.getElementById("number");
let counter = 0;
let length = 0;

function setSlick () {
    $('.center').slick({
        centerMode: true,
        centerPadding: '60px',
        slidesToShow: 3,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: '40px',
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 480,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: '40px',
                    slidesToShow: 1
                }
            }
        ]
    });
    $('.autoplay').slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: false,
        autoplaySpeed: 2000,
    });

    setInterval(() => {
        if (counter == 65) {
            clearInterval;
        }
        else {
            counter += 1;
            number.innerHTML = `${counter}%`;
        }
    }, 30);
};

var Inittialization = function () {
    var Book = function () {
        $.ajax({
            /*  url: host+'/Account/loginapi',*/
            url: '/Home/GetListBook',
            type: 'Get',
            contentType: false,
            processData: false,
            success: function (data) {
                var div = ``;
                data.book.forEach((e, i) => {
                    var id = e.ID;
                    div += `<div class="book-img" value="${id}">
                                <img src="${e.CoverSrc}" alt="${e.Name}">
                            </div>`
                })
                $(".autoplay").append(div);
                setSlick();
            },
            error: function () {
                swal.fire({
                    title: "Có lỗi!",
                    text: "Bạn chưa đăng ký!",
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

        $(document).on("click", ".slick-slide", function () {
            localStorage.setItem("selectedBookId", $(this).attr("value"));
            window.location.href = "/Book/Index";
        });
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

