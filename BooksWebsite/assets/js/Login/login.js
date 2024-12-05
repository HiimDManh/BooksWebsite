"use strict";

$(document).ready(() => {
    $('.loginBtn').on('click', () => {
        // Set the transform property using jQuery's css() method
        $('#col2').css('transform', `translateX(0px)`);
    });

    $('.registerBtn').on('click', () => {
        $('#col2').css('transform', `translateX(-500px)`);
    });


});

var KTLogin = function () {
    var _login;
    var validation;
    var re_validation;

    var _handleSignInForm = function () {
        var form = document.getElementById('kt_login_signin_form');
        var re_form = document.getElementById('register_form');
        // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
        validation = FormValidation.formValidation(
            form,
            {
                fields: {
                    'user': {
                        validators: {
                            notEmpty: {
                                message: 'Vui Lòng Nhập Tài Khoản !!!'
                            }
                        }
                    },
                    'pass': {
                        validators: {
                            notEmpty: {
                                message: 'Vui Lòng Nhập Mật Khẩu !!!'
                            }
                        }
                    }
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    bootstrap: new FormValidation.plugins.Bootstrap()
                }
            }
        );

        re_validation = FormValidation.formValidation(
            re_form,
            {
                fields: {
                    're_user': {
                        validators: {
                            notEmpty: {
                                message: 'Vui Lòng Nhập Tài Khoản !!!'
                            }
                        }
                    },
                    're_pass': {
                        validators: {
                            notEmpty: {
                                message: 'Vui Lòng Nhập Mật Khẩu !!!'
                            }
                        }
                    },
                    're_confirm_pass': {
                        validators: {
                            notEmpty: {
                                message: 'Vui Lòng Nhập Mật Khẩu !!!'
                            }
                        }
                    }
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    bootstrap: new FormValidation.plugins.Bootstrap()
                }
            }
        );

        console.log(validation);

        $('#kt_login_signin_submit').on('click', function (e) {
            e.preventDefault();

            if (validation) {
                validation.validate().then(function (status) {
                    if (status == 'Valid') {

                        SignIn();

                    } else {
                        swal.fire({
                            text: "Xin Lỗi, Nhập Đủ Dữ Liệu.",
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "Ok, got it!",
                            customClass: {
                                confirmButton: "btn font-weight-bold btn-light-primary"
                            }
                        }).then(function () {
                            KTUtil.scrollTop();
                        });
                    }
                });
            }
        });

        $('#register_submit').on('click', function (e) {
            e.preventDefault();

            if (re_validation) {
                re_validation.validate().then(function (status) {
                    if (status == 'Valid') {
                        if ($("#re_password").text() == $("#re_confirm_pass").text())
                            Register();
                        else {
                            swal.fire({
                                text: "Mật khẩu không khớp nhau!",
                                icon: "error",
                                buttonsStyling: false,
                                confirmButtonText: "Ok, got it!",
                                customClass: {
                                    confirmButton: "btn font-weight-bold btn-light-primary"
                                }
                            });
                        }
                    } else {
                        swal.fire({
                            text: "Xin Lỗi, Nhập Đủ Dữ Liệu.",
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "Ok, got it!",
                            customClass: {
                                confirmButton: "btn font-weight-bold btn-light-primary"
                            }
                        })
                    }
                });
            }
        });

        function Register() {
            var form = document.getElementById("register_form");
            var formdata = new FormData(form);
            /* var host = localStorage.getItem("host")*/
            $.ajax({
                /*  url: host+'/Account/loginapi',*/
                url: '/Login/Register',
                type: 'Post',
                data: formdata,
                contentType: false,
                processData: false,
                success: function (data) {
                    console.log(data);
                    if (data.code === 200) {
                        swal.fire({
                            title: "Thành Công",
                            text: "Đăng ký thành công",
                            icon: "success",
                            buttonsStyling: false,
                            heightAuto: false,
                            showConfirmButton: false,
                        })
                        setTimeout(() => {
                            var checkbox = document.getElementById("isGS");
                            if (checkbox.checked)
                                window.location.href = "/";
                            else
                                window.location.href = "/BeforeStart/Index";
                        }, 2000);
                    } else {
                        swal.fire({
                            title: "Có lỗi!",
                            text: data.msg,
                            icon: "error",
                            buttonsStyling: false,
                            heightAuto: false,
                            customClass: {
                                confirmButton: "btn font-weight-bold btn-light-primary"
                            }
                        }).then(function () {
                            KTUtil.scrollTop();
                        });
                        $("#password").val("");
                    }
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
        }

        function SignIn() {
            var form = document.getElementById("kt_login_signin_form");
            var formdata = new FormData(form);
            /* var host = localStorage.getItem("host")*/
            $.ajax({
                /*  url: host+'/Account/loginapi',*/
                url: '/Login/Login',
                type: 'Post',
                data: formdata,
                contentType: false,
                processData: false,
                success: function (data) {
                    console.log(data);
                    if (data.code === 200) {
                        swal.fire({
                            title: "Thành Công",
                            text: "Đăng nhập thành công",
                            icon: "success",
                            buttonsStyling: false,
                            heightAuto: false,
                            showConfirmButton: false,
                        })
                        setTimeout(() => {
                            window.location.href = "/";
                        }, 2000);
                    } else {
                        swal.fire({
                            title: "Có lỗi!",
                            text: data.msg,
                            icon: "error",
                            buttonsStyling: false,
                            heightAuto: false,
                            customClass: {
                                confirmButton: "btn font-weight-bold btn-light-primary"
                            }
                        }).then(function () {
                            KTUtil.scrollTop();
                        });
                        $("#password").val("");
                    }
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
        }

        // Handle forgot button
        //$('#kt_login_forgot').on('click', function (e) {
        //    e.preventDefault();
        //    _showForm('forgot');
        //});

        //// Handle signup
        //$('#kt_login_signup').on('click', function (e) {
        //    e.preventDefault();
        //    _showForm('signup');
        //});
    }
    // Public Functions
    return {
        // public functions
        init: function () {
            //_login = $('#kt_login');

            _handleSignInForm();
        }
    };
}();

// Class Initialization
jQuery(document).ready(function () {
    KTLogin.init();
});
