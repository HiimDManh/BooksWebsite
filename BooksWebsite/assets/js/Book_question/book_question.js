"use strict"

var bookId = localStorage.getItem("selectedBookId");

var Inittialization = function () {
    $("#answerBtn").text()

    var QnA = function () {
        $.ajax({
            /*  url: host+'/Account/loginapi',*/
            url: '/BookQuestion/GetQnA',
            type: 'Get',
            data: { ID: Number(bookId) },
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

        $(document).on('click', '.answer-container', function () {
            if (page < quesCount - 1) {
                next_page();
            }
            else {
                getUserAnswer($(this).attr("value"));
            }
        })
    }

    var Book = function () {
        var num = Number(bookId)
        $.ajax({
            /*  url: host+'/Account/loginapi',*/
            url: '/Book/GetBook',
            type: 'Post',
            data: { ID: num },
            success: function (data) {
                var item = data.book
                $("#answerBtn").text()
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

    return {
        init: function () {
            Book();
            QnA();
        },
    }
}();

jQuery(document).ready(function () {
    Inittialization.init();
});