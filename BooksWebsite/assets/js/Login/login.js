"use strict";

$(document).ready(() => {
    $('.loginBtn').on('click', () => {
        // Set the transform property using jQuery's css() method
        $('#col2').css('transform', `translateX(0px)`);
    });

    $('.registerBtn').on('click', () => {
        console.log(1)
        $('#col2').css('transform', `translateX(-400px)`);
    });
});
