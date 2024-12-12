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

        datatable = $('#typeDatatable').KTDatatable({
            // datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        url: '/AdminHome/ShowDetailList',
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
                field: 'No',
                title: 'Mã',
                width: 50,
                autoHide: false,
            }, {
                field: 'Type',
                title: 'Đề mục sách',
                sortable: true,
                autoHide: false,
                template: function (row) {
                    var output = '';
                    output += '<div id="' + row.No + '" class="font-weight-bolder text-primary mb-0">' + row.Type + '</div>';

                    return output;
                },
            }, {
                field: 'count',
                title: 'Số lượng người dùng',
                width: 200,
                autoHide: false,
            }, {
                field: 'Actions',
                title: 'Hành động',
                overflow: 'visible',
                sortable: false,
                autoHide: false,
                width: 70,
                template: function (row) {
                    return `<div class="dropdown dropdown-inline" >
                    <button type="button" class="btn btn-light-primary btn-icon btn-sm" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
									<i class="la la-cog"></i>
								</button>
                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <ul class="navi flex-column navi-hover py-2">
                            <li class="navi-header font-weight-bolder text-dark font-size-xs text-primary pb-2">
                                Chọn hành động
                            </li>
                            <li class="navi-item" onClick="Detail('${row.Type}','${row.No}')">
                                <a class="navi-link" >
                                    <span class="navi-icon"><i class="flaticon-more"></i></span>
                                    <span class="navi-text font-weight-bold text-info">Chi tiết</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>`;
                },
            }],
        });

        $('#kt_datatable_search_query').keyup(function (e) {
            datatable.search($(this).val(), 'Type');
        });

        function parseJsonDate(jsonDate) {
            const timestamp = jsonDate.match(/\d+/)[0];


            const date = new Date(parseInt(timestamp));


            const formattedDate = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();

            return formattedDate;
        }

    };

    var detail = function () {

        userDatatable = $('#detailDatatable').KTDatatable({
            // datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        url: '/AdminHome/DetailList',
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
                scroll: true,
                height: 550,
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
                field: 'No',
                title: 'ID',
                sortable: true,
                autoHide: false,
                width: 50,
            }, {
                field: 'username',
                title: 'Người dùng',
                autoHide: false,
                template: function (row) {
                    let avatarUrl = '/AdminHome/GetAvatarID?userId=' + encodeURIComponent(row.username);
                    var output = `<span style="width: 250px;"><div class="d-flex align-items-center">								
                                    <div class="symbol symbol-40 symbol-light-primary flex-shrink-0">									
                                        <img src="${avatarUrl}" alt="Picture" />								
                                    </div>								
                                    <div class="ml-4">									
                                        <div class="text-dark-75 font-weight-bolder font-size-lg mb-0">${row.username}
                                        </div>									
                                    </div>							
                                </div>
                            </span>`;
                    return output;
                },
            }],
        });

    };

    var _demo12 = function () {
        $.ajax({
            url: "/AdminHome/ShowDetailList",
            type: "post",
            data: {
                page: 1,
                pages: 1,
                perpage: 10,
                total: 9,
            },
            success: function (data) {
                var type = [];
                var count = [];
                var no = [];
                data.data.forEach((e) => {
                    type.push(e.Type);
                    count.push(e.count);
                    no.push(e.No);
                })

                const apexChart = "#chart_13";
                var options = {
                    series: [{
                        name: 'Số lượng người dùng',
                        data: count
                    }],
                    chart: {
                        height: 350,
                        type: 'area'
                    },
                    dataLabels: {
                        enabled: false
                    },
                    stroke: {
                        curve: 'smooth'
                    },
                    xaxis: {
                        type: 'text',
                        categories: no,
                    },
                    tooltip: {
                        x: {
                            formatter: function (type) {
                                return type;
                            }
                        },
                    },
                    colors: [primary]
                };

                var chart = new ApexCharts(document.querySelector(apexChart), options);
                chart.render();
            },
            error: function () {
                console.error('Error getting localized string:', error);
            }
        })
    };

    return {
        init: function () {
            demo();
            detail();
            _demo12();
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