"use strict"

var datatable;
var userDatatable;

const primary = '#6993FF';
const success = '#1BC5BD';
const info = '#8950FC';
const warning = '#FFA800';
const danger = '#F64E60';

function Detail(type, id) {
    userDatatable.search(id, 'No');
    $("#detailModal").modal('show');
    $("#modalTitle").text(type)
}

var Initialize = function () {
    var demo = function () {

        datatable = $('#userDatatable').KTDatatable({
            // datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        url: '/AdminUserManagement/ShowList',
                    },
                },
                pageSize: 10,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true
            },

            // layout definition
            layout: {
                /*scroll:true,*/
                minHeight: 500,
                footer: false,
                icons: {
                    rowDetail: {
                        expand: 'fa fa-caret-down',
                        collapse: 'fa fa-caret-right'
                    }
                }
            },
            toolbar: {
                items: {
                    pagination: {
                        pages: {
                            mobile: {
                                layout: 'compact'
                            },
                            tablet: {
                                layout: 'default',
                                pagesNumber: 3
                            },
                            desktop: {
                                layout: 'default',
                                pagesNumber: 5
                            }
                        }
                    }
                }
            },
            // column sorting
            sortable: true,

            pagination: true,


            // columns definition
            columns: [{
                field: 'id',
                title: 'No.',
                width: 50,
                autoHide: false,
            }, {
                field: 'username',
                title: 'Người dùng',
                sortable: true,
                autoHide: false,
                template: function (row) {
                    var output = '';
                    output += '<div id="' + row.id + '" class="font-weight-bolder text-primary mb-0">' + row.username + '</div>';

                    return output;
                },
            }, {
                field: 'type',
                title: 'Phân vùng người dùng',
                autoHide: false,
            }, {
                field: 'role',
                title: 'Chức danh',
                autoHide: false,
                width: 70,
            }, {
                field: 'login_time',
                title: 'Thời gian đăng nhập',
                autoHide: true,
                template: function (row) {
                    // Assuming the date comes in the format: /Date(1728361938197)/
                    var dateStr = row.login_time;
                    // Extract the timestamp from /Date(XXXXXX)/
                    var timestamp = parseInt(dateStr.replace('/Date(', '').replace(')/', ''), 10);

                    // Create a new Date object from the timestamp
                    var date = new Date(timestamp);

                    // Format the date (e.g., 'MM/DD/YYYY')
                    var formattedDate = date.toLocaleString('en-GB', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                    });

                    return `<div class="font-weight-bolder text-danger mb-0">${formattedDate}</div>`;  // Example output: '10/08/2024'
                },
            },],
        });

        $('#kt_datatable_search_query').keyup(function (e) {
            datatable.search($(this).val(), 'username');
        });

        function parseJsonDate(jsonDate) {
            const timestamp = jsonDate.match(/\d+/)[0];


            const date = new Date(parseInt(timestamp));


            const formattedDate = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();

            return formattedDate;
        }

    };

    return {
        init: function () {
            demo();
        }
    }
}();

jQuery(document).ready(function () {
    Initialize.init();
});

toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
};