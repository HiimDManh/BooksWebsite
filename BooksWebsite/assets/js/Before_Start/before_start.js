"use strict";

var page = 0;

function next_page() {
    page++;
    $('.page-question').css('transform', `translateX(-${100 * page}vw)`);
    if (page > 0) {
        $('.previous-btn').attr("hidden", false);
    }
    if (page == 4) {
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
    if (page == 3) {
        $(".submit-btn").attr("hidden", true);
        $(".next-btn").attr("hidden", false);
    }
    if (page > 0) {
        $('.previous-btn').attr("hidden", false);
    }
}

$(document).ready(() => {
    $("#nextBtn").on("click", () => {        
        next_page();
    });   
    
    $("#previousBtn").on("click", () => {
        previous_page();
    });

    $(".answer-container").on('click', () => {
        if (page < 4)
            next_page();
        else {
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
});