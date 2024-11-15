"use strict";

var page = 0;

$(document).ready(() => {
    $("#nextBtn").on("click", () => {        
        page++;
        $('.page-question').css('transform', `translateX(-${100 * page}vw)`);
        if (page > 0) {
            $('.previous-btn').attr("hidden", false);
        } 
        if (page == 4) {
            $(".submit-btn").attr("hidden", false);
            $(".next-btn").attr("hidden", true);
        }
    });    
    $("#previousBtn").on("click", () => {
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
    });
});