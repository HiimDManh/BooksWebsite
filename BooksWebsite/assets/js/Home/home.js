"use strict"

let length = 0;

//document.addEventListener("DOMContentLoaded", function () {
//    const qrContainer = document.querySelector(".qr-container");

//    qrContainer.addEventListener("dragstart", function (e) {
//        e.dataTransfer.setData("text/plain", null);
//        qrContainer.style.opacity = "0.5";
//    });

//    qrContainer.addEventListener("dragend", function (e) {
//        qrContainer.style.opacity = "1";

//        // Set new position
//        qrContainer.style.position = "absolute";
//        qrContainer.style.left = e.pageX + "px";
//        qrContainer.style.top = e.pageY + "px";
//    });
//});


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
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        responsive: [
            {
                breakpoint: 1024, // Max width for this setting
                settings: {
                    slidesToShow: 2, // Change to 2 slides
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 768, // Max width for this setting
                settings: {
                    slidesToShow: 2, // Change to 1 slide
                    slidesToScroll: 1,
                }
            }
        ]
    });

    
};

function BookPage(val) {
    localStorage.setItem("selectedBookId", val);
    window.location.href = "/Book/Index";
}

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
                    div += `<div class="book-img" value="${id}" style="height: 100% !important">
                                <div class="d-flex flex-column flex-center">
                                    <img src="${e.CoverSrc}" alt="${e.Name}">
                                    <span class="text-dark font-size-h4 text-center p-2 fw-bold" style="width: 150px; background: #fff; border-radius: 15px;">${e.Name}</span>
                                </div>
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
            BookPage($(this).attr("value"));
        });
    }

    var OnReadingBook = function () {
        $.ajax({
            /*  url: host+'/Account/loginapi',*/
            url: '/Home/GetOnReadingBook',
            type: 'Get',
            contentType: false,
            processData: false,
            success: function (data) {
                console.log(data);
                data.book.forEach((e) => {
                    var div = `<div class="">
                                    <div class="on-reading-item" onclick="BookPage(${e.ID})" id="${e.ID}">
                                        <div class="book-img-name">
                                            <img src="${e.CoverHref}">
                                            <h4 class="book-name">${e.BookName}</h4>
                                        </div>
                                        <div class="item-container">
                                            <div class="outer">
                                                <div class="inner">
                                                    <div class="number" id="number${e.Percentage}">
                                                        ${e.Percentage}%
                                                    </div>
                                                </div>
                                            </div>
                                            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="160px" height="160px">
                                                <defs>
                                                    <linearGradient id="GradientColor">

                                                        <stop offset="0%" stop-color="#DA22FF" />

                                                        <stop offset="100%" stop-color="#9733EE" />

                                                    </linearGradient>
                                                </defs>
                                                <circle id="svg${e.ID}" cx="80" cy="80" r="70" stroke-linecap="round" />
                                            </svg>
                                        </div>
                                </div>
                            </div>`
                    $(".on-reading-list").append(div);
                    const element = document.getElementById("svg"+e.ID.toString());
                    element.style.strokeDashoffset = (450 - (450 * e.Percentage / 100)).toString();
                    console.log(element)

                    var number = document.getElementById(`number${e.Percentage}`);
                    var counter = 0;

                    setInterval(() => {
                        if (counter == e.Percentage) {
                            clearInterval;
                        }
                        else {
                            counter += 1;
                            number.innerHTML = `${counter}%`;
                        }
                    }, 30);
                })
                
                
            },
            error: function () {
                swal.fire({
                    title: "Có lỗi!",
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

    return {
        init: function () {
            Book();
            OnReadingBook();
        },
    }
}();

jQuery(document).ready(function () {
    Inittialization.init();
});

