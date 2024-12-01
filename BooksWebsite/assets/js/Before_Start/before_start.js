"use strict";

var page = 0;
var quesCount = 0;

function next_page() {
    page++;
    $('.page-question').css('transform', `translateX(-${100 * page}vw)`);
    if (page > 0) {
        $('.previous-btn').attr("hidden", false);
    }
    if (page == quesCount) {
        $(".submit-btn").attr("hidden", false);
        $(".next-btn").attr("hidden", true);
    }
}

function previous_page() {
    page--;
    if (page < 1) {
        $('.previous-btn').attr("hidden", true);
    }
    $('.page-question').css('transform', `translateX(-${100 * page}vw)`);
    if (page == quesCount - 1) {
        $(".submit-btn").attr("hidden", true);
        $(".next-btn").attr("hidden", false);
    }
    if (page > 0) {
        $('.previous-btn').attr("hidden", false);
    }
}

function getUserAnswer(id) {
    var num = Number(id)
    $.ajax({
        /*  url: host+'/Account/loginapi',*/
        url: '/BeforeStart/SetBehaviour',
        type: 'post',
        data: { ID: num },
        success: function (data) {
            if (data.question != null) {
                var div = ``;
                var ques = data.question;
                div += `<div class="page-question-child">
                                <div class="mascot-container2">
                                    <img class="mascot-second" alt="mascot1" src="/assets/media/mascot/book1.png" />
                                    <div class="question-container">
                                        <label class="question">${ques.Description}</label>
                                    </div>
                                </div>
                                <div class="answer">`
                data.answer.forEach((e, i) => {
                    div += `<div class="answer-container" value="${e.ID}">
                                        <div class="question-container">
                                            <label class="question">${e.Description}</label>
                                        </div>
                                    </div>`
                })
                div += `</div></div>`
                $(".page-question").append(div)
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
            })
        }
    });
}

$(document).ready(() => {
    $("#nextBtn").on("click", () => {
        next_page();
    });

    $("#previousBtn").on("click", () => {
        previous_page();
    });


});

var Inittialization = function () {
    var QnA = function () {
        $.ajax({
            /*  url: host+'/Account/loginapi',*/
            url: '/BeforeStart/GetQnA',
            type: 'Get',
            contentType: false,
            processData: false,
            success: function (data) {
                quesCount = data.question.length;
                data.question.forEach((e, i) => {
                    var div = ``;
                    var id = e.ID;
                    div += `<div class="page-question-child">
                                <div class="mascot-container2">
                                    <img class="mascot-second" alt="mascot1" src="/assets/media/mascot/book1.png" />
                                    <div class="question-container">
                                        <label class="question">${e.Description}</label>
                                    </div>
                                </div>
                                <div class="answer">`
                    data.answer.forEach((e, i) => {
                        if (e.QuestionID == id) {
                            div += `<div class="answer-container" value="${e.ID}">
                                        <div class="question-container">
                                            <label class="question">${e.Description}</label>
                                        </div>
                                    </div>`
                        }
                    })
                    div += `</div></div>`
                    $(".page-question").append(div)
                })
            },
            error: function () {
                swal.fire({
                    title: "Có lỗi!",
                    text: "Bạn Không Được Phép Đăng Nhập",
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

        $(document).on('click', '.answer-container', function () {
            if (page < quesCount) {
                next_page();
                getUserAnswer($(this).attr("value"));
            }
            else {
                getUserAnswer($(this).attr("value"));
                Swal.fire({
                    allowOutsideClick: false,
                    text: "Xác nhận hoàn thành?",
                    icon: "question",
                    buttonsStyling: false,
                    showCancelButton: true,
                    confirmButtonText: "Xác nhận",
                    cancelButtonText: "Huỷ",
                    customClass: {
                        confirmButton: "btn btn-primary",
                        cancelButton: "btn btn-danger"
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = "/";
                    }
                    else {
                        Swal.close();
                    }
                });
            }
        })
    }

    return {
        init: function () {
            QnA();
        },
    }
}();

jQuery(document).ready(function () {
    Inittialization.init();
});