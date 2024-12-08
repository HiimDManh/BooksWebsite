"use strict";

// Class definition
var KTAppChat = function () {
	var _chatAsideEl;
	var _chatAsideOffcanvasObj;
	var _chatContentEl;

	// Private functions
	var _initAside = function () {
		// Mobile offcanvas for mobile mode
		_chatAsideOffcanvasObj = new KTOffcanvas(_chatAsideEl, {
			overlay: true,
			baseClass: 'offcanvas-mobile',
			//closeBy: 'kt_chat_aside_close',
			toggleBy: 'kt_app_chat_toggle'
		});

		
	}

	return {
		// Public functions
		init: function () {
			// Elements
			_chatAsideEl = KTUtil.getById('kt_chat_aside');
			_chatContentEl = KTUtil.getById('kt_chat_content');

			// Init aside and user list
			_initAside();

			// Trigger click to show popup modal chat on page load
			if (KTUtil.getById('kt_app_chat_toggle')) {
				setTimeout(function () {
					KTUtil.getById('kt_app_chat_toggle').click();
				}, 1000);
			}
		}
	};
}();

jQuery(document).ready(function () {
	KTAppChat.init();
});
