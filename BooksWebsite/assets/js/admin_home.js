"use strict"

var datatable;

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
                field: 'Type',
                title: 'Đề mục sách',
                sortable: true,
                width: 100,
                autoHide: false,
                template: function (row) {
                    var output = '';
                    output += '<div class="font-weight-bolder text-primary mb-0">' + row.Type + '</div>';

                    return output;
                },
            }, {
                field: 'count',
                title: 'Số lượng người dùng',
                width: 200,
                autoHide: true,
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
                            <li class="navi-item" onClick="Detail('${row.No_}')">
                                <a class="navi-link" >
                                    <span class="navi-icon"><i class="flaticon-more"></i></span>
                                    <span class="navi-text font-weight-bold text-info">Chi tiết</span>
                                </a>
                            </li>
                            <li class="navi-item" data-detail="${row.No_}" name="detailBtn">
                                <a class="navi-link" >
                                    <span class="navi-icon"><i class="la la-check-circle-o"></i></span>
                                    <span class="navi-text font-weight-bold text-primary">Danh sách phiếu quét</span>
                                </a>
                            </li>
                                <li class="navi-item" data-approveBtn="${row.No_}" name="approveBtn">
                                <a class="navi-link" >
                                    <span class="navi-icon"><i class="la la-edit"></i></span>
                                    <span class="navi-text font-weight-bold text-success">Duyệt phiếu nhập</span>
                                </a>
                            </li> 
                                <li class="navi-item" data-deletePuchase="${row.No_}" name="deletePuchase">
                                <a class="navi-link" >
                                    <span class="navi-icon"><i class="la la-remove"></i></span>
                                    <span class="navi-text font-weight-bold text-danger">Xóa phiếu nhập</span>
                                </a>
                            </li>
                            <li class="navi-item" data-printPO="${row.No_}" name="printPO">
                                <div class="navi-link" style="cursor: pointer">
                                    <i class="fa-solid fa-print navi-icon"></i>                                            
                                    <span class="navi-text font-weight-bold text-warning">In phiếu nhập</span>
                                </div>
                            </li> 
                        </ul>
                    </div>
                </div>`;
                },
            }],
        });

        $('#kt_datatable_search_query').keyup(function (e) {
            datatable.search($(this).val(), 'No_');
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