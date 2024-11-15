"use strict"

$("#kt_aside").on('resize', (event, data) => {
    console.log(`New size - Width: ${data.width}, Height: ${data.height}`);

    // Example: Change color dynamically
    if(data.width <= 64) {
        $(".logo-text").attr("hidden", true);
    } else {
        $(".logo-text").attr("hidden", false);
    }
});