const api = {
  call: (url: any, body: any, resolve: any, callBack: any): null => null,
  get: (url: any, resolve: any, callBack: any): null => null,
  push: (url: any, body: any, resolve: any, callBack: any): null => null,
  patch: (url: any, body: any, resolve: any, callBack: any): null => null,
};

export default api;

// // Copyright 2010-present ContextLogic Inc

// define(["underscore", "core/url", "tpl!modal", "core/i18n"], function (
//   _,
//   urlModule,
//   modals,
//   i18n,
// ) {
//   var i18n = i18n.i18n;
//   function _handleError(resp, data, xhr, opt, cb, call_data) {
//     // in development mode, print debug info to the console
//     if (window.debug) {
//       if (resp) {
//         console.debug("API call error: %s (code %d)", resp.msg, resp.code);
//       }

//       if (data && data.trace) {
//         console.debug(data.trace);
//       } else if (resp.data && resp.data.trace) {
//         console.debug(resp.data.trace);
//       }
//     }

//     if (resp.code == 2 && resp.data.session_expired == true) {
//       setTimeout(function () {
//         window.location = urlModule.absURL("/login");
//       }, 3500);
//     }

//     if (resp.code == 3 && resp.data.secure_session_expired == true) {
//       var uname = resp.data.username;
//       launchReloginModal(uname, call_data);
//     }

//     // if there's a callback, use that
//     if (cb) {
//       cb(resp, data, xhr, opt);
//     } else {
//       var msg = resp && resp.msg ? resp.msg : i18n("Unknown Error");
//       launchErrorModal(msg);
//     }
//   }

//   function launchConfirmationModal(message, callback) {
//     var modal_el = modals.confirmation_modal({
//       title: i18n("Warning"),
//       message: message,
//       type: "confirmation",
//       confirm_txt: i18n("Confirm"),
//       cancel_txt: i18n("Cancel"),
//     });

//     var $modal_el = $(modal_el);
//     $modal_el.modal({});
//     $modal_el.on("hidden", function () {
//       $modal_el.remove();
//     });

//     $modal_el.find(".confirm-btn").click(function () {
//       if (callback && _.isFunction(callback)) {
//         callback();
//       }
//     });
//     return $modal_el;
//   }

//   function launchErrorModal(message, callback) {
//     var modal_el = modals.alert_modal({
//       title: i18n("Error"),
//       message: message,
//       type: "error",
//     });

//     var $modal_el = $(modal_el);
//     $modal_el.modal({});
//     $modal_el.on("hidden", function () {
//       $modal_el.remove();
//       if (callback && _.isFunction(callback)) {
//         callback();
//       }
//     });
//     return $modal_el;
//   }

//   function launchReloginModal(uname, call_data) {
//     var modal_el = modals.relogin_modal({
//       username_txt: uname,
//       i18n: i18n,
//     });

//     var $modal_el = $(modal_el);

//     var $pwd_box = $modal_el.find("#password");
//     var $tfa_box = $modal_el.find("#tfa-code");
//     var $relogin_btn = $modal_el.find("#relogin-btn");
//     var $relogin_tfa = $modal_el.find(".relogin-modal-tfa").hide();
//     var $click_btn = $relogin_btn;
//     var tfa = false;

//     $modal_el.on("shown", function () {
//       $pwd_box.focus();
//     });

//     $modal_el.modal({});

//     function overlayModal(message) {
//       var $err_modal = launchErrorModal(message);

//       // overlay the modals
//       var $mb = $modal_el.find(".modal-body");

//       $click_btn = $err_modal.find(".btn");

//       $err_modal.find(".modal-body").css({
//         height: $mb.height(),
//         width: $mb.width(),
//       });
//     }

//     $relogin_btn.on("click", function () {
//       var pwd = $pwd_box.val();
//       if (pwd == "") {
//         overlayModal(i18n("Please enter your password"));
//         return;
//       }
//       if (tfa && $tfa_box.val() == "") {
//         overlayModal(i18n("Please enter your 2FA code"));
//         return;
//       }

//       var params = {};
//       params.password = pwd;
//       if (tfa) params.tfa_token = $tfa_box.val();

//       call(
//         "relogin",
//         params,
//         function () {
//           $modal_el.modal("hide");
//           call.apply(this, call_data);
//         }, // On success hide modal and call failed API again.
//         function (resp) {
//           if (resp.code == 12) {
//             $pwd_box.prop("disabled", true);
//             tfa = true;
//             call("gen_tfa_token", { username: uname }, function (resp) {
//               $relogin_tfa.show();
//               $modal_el.find(".phone-number").text(resp.data.phone_number);
//             });
//             return;
//           }
//           overlayModal(i18n("Incorrect Password"));
//         }, // On error (display error modal and force retry)
//       );
//     });

//     $modal_el.find(".tfa_resend").click(function () {
//       call(
//         "gen_tfa_token",
//         {
//           username: uname,
//           is_retry: true,
//         },
//         function () {
//           launchSuccessModal(i18n("Code has been resent!"));
//         },
//       );
//     });

//     $pwd_box.keypress(function (evt) {
//       if (evt.keyCode == 13) {
//         $click_btn.click();
//         if ($click_btn != $relogin_btn) {
//           $click_btn = $relogin_btn;
//         }
//       }
//     });

//     $modal_el.on("hidden", function () {
//       $modal_el.remove();
//     });
//   }

//   function launchSuccessModal(message, callback) {
//     var modal_el = modals.alert_modal({
//       title: i18n("Success"),
//       message: message,
//       type: "success",
//     });

//     var $modal_el = $(modal_el);
//     $modal_el.modal({});
//     $modal_el.on("hidden", function () {
//       $modal_el.remove();
//       if (callback && _.isFunction(callback)) {
//         callback();
//       }
//     });
//     return $modal_el;
//   }

//   function launchWarningModal(message, callback) {
//     var modal_el = modals.alert_modal({
//       title: i18n("Warning"),
//       message: message,
//       type: "warning",
//     });

//     var $modal_el = $(modal_el);
//     $modal_el.modal({});
//     $modal_el.on("hidden", function () {
//       $modal_el.remove();
//       if (callback && _.isFunction(callback)) {
//         callback();
//       }
//     });
//     return $modal_el;
//   }

//   function launchInfoModal(message, title) {
//     var modal_el = modals.info_modal({
//       title: title,
//       message: message,
//     });

//     var $modal_el = $(modal_el);
//     $modal_el.modal({});
//     $modal_el.on("hidden", function () {
//       $modal_el.remove();
//     });
//   }

//   /**
//    * Hook up onprogress event listener for file posts
//    */
//   var makeOriginalXhr = _.bind($.ajaxSettings.xhr, $.ajaxSettings);
//   var newOptions = {};
//   function handleOnProgress(evt, options) {
//     if (typeof options.progress === "function") {
//       options.progress(options.__jqXHR, evt);
//     }
//   }
//   newOptions.xhr = function () {
//     var s = this;
//     var newXhr = makeOriginalXhr();
//     if (newXhr) {
//       newXhr.addEventListener("progress", function (evt) {
//         handleOnProgress(evt, s);
//       });
//     }
//     return newXhr;
//   };
//   $.ajaxSetup(newOptions);

//   function prepareAjaxCall(
//     method,
//     params,
//     callback,
//     errorCallback,
//     data,
//     selector,
//     num_retries,
//   ) {
//     if (window.pageParams.session_expiry_extend_min) {
//       if (window.session_expiry) {
//         var d = window.session_expiry - new Date().getTime();
//         if (d < window.pageParams.session_expiry_refresh_ttl_sec * 1000) {
//           window.session_expiry =
//             new Date().getTime() +
//             window.pageParams.session_expiry_extend_min * 60 * 1000;
//         }
//         window.update_session_expiry();
//       }
//     }
//     // default to 0 retries
//     num_retries = num_retries || 0;
//     var url = urlModule.absURL("api/" + method);
//     var args = arguments;
//     _.each(params, function (v, k) {
//       if (v == null) {
//         delete params[k];
//       }
//     });
//     return {
//       url,
//       args,
//       params,
//       num_retries,
//     };
//   }

//   function get(method, callback, errorCallback, data, selector, num_retries) {
//     var prepared = prepareAjaxCall(
//       method,
//       null,
//       callback,
//       errorCallback,
//       data,
//       selector,
//       num_retries,
//     );
//     return makeAjaxCallWithRetry(
//       prepared.num_retries,
//       1,
//       prepared.url,
//       prepared.params,
//       callback,
//       errorCallback,
//       data,
//       prepared.args,
//       "GET",
//     );
//   }

//   function put(
//     method,
//     params,
//     callback,
//     errorCallback,
//     data,
//     selector,
//     num_retries,
//   ) {
//     var prepared = prepareAjaxCall(
//       method,
//       params,
//       callback,
//       errorCallback,
//       data,
//       selector,
//       num_retries,
//     );
//     return makeAjaxCallWithRetry(
//       prepared.num_retries,
//       1,
//       prepared.url,
//       prepared.params,
//       callback,
//       errorCallback,
//       data,
//       prepared.args,
//       "PUT",
//     );
//   }

//   function patch(
//     method,
//     params,
//     callback,
//     errorCallback,
//     data,
//     selector,
//     num_retries,
//   ) {
//     var prepared = prepareAjaxCall(
//       method,
//       params,
//       callback,
//       errorCallback,
//       data,
//       selector,
//       num_retries,
//     );
//     return makeAjaxCallWithRetry(
//       prepared.num_retries,
//       1,
//       prepared.url,
//       prepared.params,
//       callback,
//       errorCallback,
//       data,
//       prepared.args,
//       "PATCH",
//     );
//   }

//   /* use call for "post" calls */
//   function call(
//     method,
//     params,
//     callback,
//     errorCallback,
//     data,
//     selector,
//     num_retries,
//   ) {
//     var prepared = prepareAjaxCall(
//       method,
//       params,
//       callback,
//       errorCallback,
//       data,
//       selector,
//       num_retries,
//     );
//     return makeAjaxCallWithRetry(
//       prepared.num_retries,
//       1,
//       prepared.url,
//       prepared.params,
//       callback,
//       errorCallback,
//       data,
//       prepared.args,
//       "POST",
//     );
//   }

//   var makeAjaxCallWithRetry = function (
//     num_retries,
//     retries,
//     url,
//     params,
//     callback,
//     errorCallback,
//     data,
//     args,
//     method,
//   ) {
//     return $.ajax({
//       beforeSend: function (xhr, settings) {
//         xhr.setRequestHeader("X-XSRFToken", $.cookie("_xsrf"));
//         return true;
//       },
//       type: method,
//       url: url,
//       dataType: "json",
//       data: params,
//       success: function (o, xhr, opt) {
//         o.additional_data = data; //the data that was sent to the call function
//         if (callback) {
//           callback(o, data, xhr, opt);
//         }
//       },
//       error: function (xhr, opt, data) {
//         if (opt == "abort") {
//           return;
//         } else {
//           try {
//             resp = jQuery.parseJSON(xhr.responseText);
//           } catch (err) {
//             if (xhr.status == 504 || xhr.status == 503) {
//               if (retries <= num_retries) {
//                 console.debug("Retrying request attempt number " + retries);
//                 setTimeout(function () {
//                   makeAjaxCallWithRetry(
//                     num_retries,
//                     retries + 1,
//                     url,
//                     params,
//                     callback,
//                     errorCallback,
//                     data,
//                   ),
//                     Math.pow(1.5, retries) * 1000; // exponential backoff
//                 });
//                 return;
//               }
//               resp = {
//                 code: 4,
//                 msg: "Request Timedout",
//               };
//             } else {
//               resp = {
//                 code: 9,
//                 msg: "Unknown Error",
//               };
//             }
//           }
//           _handleError(resp, data, xhr, opt, errorCallback, args);
//         }
//       },
//     });
//   };

//   function CallWithRetry(
//     method,
//     params,
//     callback,
//     errorCallback,
//     data,
//     selector,
//     num_retries,
//   ) {
//     num_retries = num_retries || 5;
//     return call(
//       method,
//       params,
//       callback,
//       errorCallback,
//       data,
//       selector,
//       num_retries,
//     );
//   }

//   function file(
//     method,
//     params,
//     callback,
//     progressCallback,
//     errorCallback,
//     data,
//     selector,
//   ) {
//     var url = urlModule.absURL("api/" + method);
//     _.each(params, function (v, k) {
//       if (v == null) {
//         delete params[k];
//       }
//     });
//     return $.ajax({
//       beforeSend: function (xhr, settings) {
//         xhr.setRequestHeader("X-XSRFToken", $.cookie("_xsrf"));
//         return true;
//       },
//       progress: function (xhr, progressEvent) {
//         if (progressCallback) {
//           progressCallback(progressEvent);
//         }
//       },
//       type: "POST",
//       url: url,
//       data: params,
//       processData: false,
//       contentType: false,
//       success: function (o, xhr, opt) {
//         if (callback) {
//           callback(o, data, xhr, opt);
//         }
//       },
//       error: function (xhr, opt, data) {
//         if (opt == "abort") {
//           return;
//         } else {
//           try {
//             resp = jQuery.parseJSON(xhr.responseText);
//           } catch (err) {
//             if (xhr.status == 504) {
//               resp = {
//                 code: 4,
//                 msg: "Request Timedout",
//               };
//             } else {
//               resp = {
//                 code: 9,
//                 msg: "Unknown Error",
//               };
//             }
//           }
//           _handleError(resp, data, xhr, opt, errorCallback, arguments);
//         }
//       },
//     });
//   }

//   return {
//     launchSuccessModal: launchSuccessModal,
//     launchErrorModal: launchErrorModal,
//     launchInfoModal: launchInfoModal,
//     launchWarningModal: launchWarningModal,
//     launchConfirmationModal: launchConfirmationModal,
//     get: get,
//     put: put,
//     patch: patch,
//     /* use call for "post" calls */
//     call: call,
//     CallWithRetry: CallWithRetry,
//     file: file,
//     _handleError: _handleError,
//   };
// });
