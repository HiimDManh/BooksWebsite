"use strict"

var bookId = localStorage.getItem("selectedBookId");

var Inittialization = function () {

    var QnA = function () {
        $.ajax({
            /*  url: host+'/Account/loginapi',*/
            url: '/BookQuestion/GetQnA',
            type: 'Get',
            data: { ID: Number(bookId) },
            success: function (data) {
                data.question.forEach((e, i) => {
                    var div = ``;
                    var id = e.ID;
                    div += `<div class="book-container">
                                <div class="button-form">
                                    <label>${e.Description}</label>
                                </div>
                                <div class="answer-container row">`
                    data.answer.forEach((e, i) => {
                        if (e.QuestionID == id) {
                            div += `<div class="answer-form">
                                        <label>${e.Description}</label>
                                    </div>`
                        }
                    })
                    div += `</div></div>`
                    $(".form-group").append(div)
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

    return {
        init: function () {
            QnA();
        },
    }
}();

jQuery(document).ready(function () {
    Inittialization.init();
});