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
                    div += `<div class="form-group">
                                <label class="question-text">${e.Description}</label>
                                <form class="answer-container">`
                    data.answer.forEach((e, i) => {
                        if (e.QuestionID == id) {
                            div += `<label class="answer" >
                                        <input type="radio" name="radio" value="${e.ID}"/>
                                        <span class="answer-text">${e.Description}</span>
                                    </label>`
                        }
                    })
                    div += `</form></div>`
                    $(".form-groupp").append(div)
                })
                $(".form-groupp").append(`<a href="#" id="submitBtn" class="btn btn-success font-weight-bold btn-pill">Hoàn thành</a>`)
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
                $('#book_name').text(item.Name);
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

        //$("#bookHref").on("click", function () {
        //    window.location.href($(this).attr("value"))
        //});
    }

    return {
        init: function () {
            QnA();
            Book();
        },
    }
}();

jQuery(document).ready(function () {
    Inittialization.init();
});