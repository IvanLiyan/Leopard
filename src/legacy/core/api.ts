// these functions are placeholders and will be replaced in a future ticket
// variable names are preserved for documentation purposes
/* eslint-disable @typescript-eslint/no-unused-vars */
const api = {
  call: (
    url: unknown,
    body: unknown,
    resolve: unknown,
    callBack: unknown,
  ): null => null,
  get: (url: unknown, resolve: unknown, callBack: unknown): null => null,
  push: (
    url: unknown,
    body: unknown,
    resolve: unknown,
    callBack: unknown,
  ): null => null,
  patch: (
    url: unknown,
    body: unknown,
    resolve: unknown,
    callBack: unknown,
  ): null => null,
};

export default api;

/*
  THIS CONVERSION IS UNTESTED [lliepert].
  WILL TEST ONCE WE HAVE LEOPARD RUNNING AND THE INFRASTRUCTURE TO MAKE THESE CALLS FROM PAGES.
*/

// import {isDev} from "@stores/EnvironmentStore"
// import {i18n} from "@legacy/core/i18n"
// import {absURL} from "@legacy/core/url"

// const _handleError = (resp, data, xhr, opt, cb, call_data) {
//   // in development mode, print debug info to the console
//   if (isDev) {
//     if (resp) {
//       console.debug("API call error: %s (code %d)", resp.msg, resp.code);
//     }

//     if (data && data.trace) {
//       console.debug(data.trace);
//     } else if (resp.data && resp.data.trace) {
//       console.debug(resp.data.trace);
//     }
//   }

//   if (resp.code == 2 && resp.data.session_expired == true) {
//     setTimeout(function () {
//       window.location = absURL("/login");
//     }, 3500);
//   }

//   if (resp.code == 3 && resp.data.secure_session_expired == true) {
//     var uname = resp.data.username;
//     launchReloginModal(uname, call_data);
//   }

//   // if there's a callback, use that
//   if (cb) {
//     cb(resp, data, xhr, opt);
//   } else {
//     var msg = resp && resp.msg ? resp.msg : i18n("Unknown Error");
//     launchErrorModal(msg);
//   }
// }

// const launchConfirmationModal = (msg: string, onConfirm?: () => unknown): void => {
//   // TODO [lliepert]: integrate Lego modals
//   console.log(`legacy/core/api:ts: confirmation modal called with message ${msg}`)
//   return;
// }

// const launchErrorModal = (msg: string, onClose?: () => unknown): void => {
//   // TODO [lliepert]: integrate Lego modals
//   console.log(`legacy/core/api:ts: error modal called with message ${msg}`)
//   return;
// }

// const launchReloginModal =(uname: string, call_data: unknown): void => {
//   // call_data is used to re-call the api that triggered the relogin
//     // TODO [lliepert]: integrate Lego modals
//     console.log(`legacy/core/api:ts: error modal called with username ${uname}`)
//     return;
// }

// function launchSuccessModal(message, callback) {
//   var modal_el = modals.alert_modal({
//     title: i18n("Success"),
//     message: message,
//     type: "success",
//   });

//   var $modal_el = $(modal_el);
//   $modal_el.modal({});
//   $modal_el.on("hidden", function () {
//     $modal_el.remove();
//     if (callback && _.isFunction(callback)) {
//       callback();
//     }
//   });
//   return $modal_el;
// }

// function launchWarningModal(message, callback) {
//   var modal_el = modals.alert_modal({
//     title: i18n("Warning"),
//     message: message,
//     type: "warning",
//   });

//   var $modal_el = $(modal_el);
//   $modal_el.modal({});
//   $modal_el.on("hidden", function () {
//     $modal_el.remove();
//     if (callback && _.isFunction(callback)) {
//       callback();
//     }
//   });
//   return $modal_el;
// }

// function launchInfoModal(message, title) {
//   var modal_el = modals.info_modal({
//     title: title,
//     message: message,
//   });

//   var $modal_el = $(modal_el);
//   $modal_el.modal({});
//   $modal_el.on("hidden", function () {
//     $modal_el.remove();
//   });
// }

// /**
//  * Hook up onprogress event listener for file posts
//  */
// var makeOriginalXhr = _.bind($.ajaxSettings.xhr, $.ajaxSettings);
// var newOptions = {};
// function handleOnProgress(evt, options) {
//   if (typeof options.progress === "function") {
//     options.progress(options.__jqXHR, evt);
//   }
// }
// newOptions.xhr = function () {
//   var s = this;
//   var newXhr = makeOriginalXhr();
//   if (newXhr) {
//     newXhr.addEventListener("progress", function (evt) {
//       handleOnProgress(evt, s);
//     });
//   }
//   return newXhr;
// };
// $.ajaxSetup(newOptions);

// function prepareAjaxCall(
//   method,
//   params,
//   callback,
//   errorCallback,
//   data,
//   selector,
//   num_retries,
// ) {
//   if (window.pageParams.session_expiry_extend_min) {
//     if (window.session_expiry) {
//       var d = window.session_expiry - new Date().getTime();
//       if (d < window.pageParams.session_expiry_refresh_ttl_sec * 1000) {
//         window.session_expiry =
//           new Date().getTime() +
//           window.pageParams.session_expiry_extend_min * 60 * 1000;
//       }
//       window.update_session_expiry();
//     }
//   }
//   // default to 0 retries
//   num_retries = num_retries || 0;
//   var url = urlModule.absURL("api/" + method);
//   var args = arguments;
//   _.each(params, function (v, k) {
//     if (v == null) {
//       delete params[k];
//     }
//   });
//   return {
//     url,
//     args,
//     params,
//     num_retries,
//   };
// }

// function get(method, callback, errorCallback, data, selector, num_retries) {
//   var prepared = prepareAjaxCall(
//     method,
//     null,
//     callback,
//     errorCallback,
//     data,
//     selector,
//     num_retries,
//   );
//   return makeAjaxCallWithRetry(
//     prepared.num_retries,
//     1,
//     prepared.url,
//     prepared.params,
//     callback,
//     errorCallback,
//     data,
//     prepared.args,
//     "GET",
//   );
// }

// function put(
//   method,
//   params,
//   callback,
//   errorCallback,
//   data,
//   selector,
//   num_retries,
// ) {
//   var prepared = prepareAjaxCall(
//     method,
//     params,
//     callback,
//     errorCallback,
//     data,
//     selector,
//     num_retries,
//   );
//   return makeAjaxCallWithRetry(
//     prepared.num_retries,
//     1,
//     prepared.url,
//     prepared.params,
//     callback,
//     errorCallback,
//     data,
//     prepared.args,
//     "PUT",
//   );
// }

// function patch(
//   method,
//   params,
//   callback,
//   errorCallback,
//   data,
//   selector,
//   num_retries,
// ) {
//   var prepared = prepareAjaxCall(
//     method,
//     params,
//     callback,
//     errorCallback,
//     data,
//     selector,
//     num_retries,
//   );
//   return makeAjaxCallWithRetry(
//     prepared.num_retries,
//     1,
//     prepared.url,
//     prepared.params,
//     callback,
//     errorCallback,
//     data,
//     prepared.args,
//     "PATCH",
//   );
// }

// /* use call for "post" calls */
// function call(
//   method,
//   params,
//   callback,
//   errorCallback,
//   data,
//   selector,
//   num_retries,
// ) {
//   var prepared = prepareAjaxCall(
//     method,
//     params,
//     callback,
//     errorCallback,
//     data,
//     selector,
//     num_retries,
//   );
//   return makeAjaxCallWithRetry(
//     prepared.num_retries,
//     1,
//     prepared.url,
//     prepared.params,
//     callback,
//     errorCallback,
//     data,
//     prepared.args,
//     "POST",
//   );
// }

// var makeAjaxCallWithRetry = function (
//   num_retries,
//   retries,
//   url,
//   params,
//   callback,
//   errorCallback,
//   data,
//   args,
//   method,
// ) {
//   return $.ajax({
//     beforeSend: function (xhr, settings) {
//       xhr.setRequestHeader("X-XSRFToken", $.cookie("_xsrf"));
//       return true;
//     },
//     type: method,
//     url: url,
//     dataType: "json",
//     data: params,
//     success: function (o, xhr, opt) {
//       o.additional_data = data; //the data that was sent to the call function
//       if (callback) {
//         callback(o, data, xhr, opt);
//       }
//     },
//     error: function (xhr, opt, data) {
//       if (opt == "abort") {
//         return;
//       } else {
//         try {
//           resp = jQuery.parseJSON(xhr.responseText);
//         } catch (err) {
//           if (xhr.status == 504 || xhr.status == 503) {
//             if (retries <= num_retries) {
//               console.debug("Retrying request attempt number " + retries);
//               setTimeout(function () {
//                 makeAjaxCallWithRetry(
//                   num_retries,
//                   retries + 1,
//                   url,
//                   params,
//                   callback,
//                   errorCallback,
//                   data,
//                 ),
//                   Math.pow(1.5, retries) * 1000; // exponential backoff
//               });
//               return;
//             }
//             resp = {
//               code: 4,
//               msg: "Request Timedout",
//             };
//           } else {
//             resp = {
//               code: 9,
//               msg: "Unknown Error",
//             };
//           }
//         }
//         _handleError(resp, data, xhr, opt, errorCallback, args);
//       }
//     },
//   });
// };

// function CallWithRetry(
//   method,
//   params,
//   callback,
//   errorCallback,
//   data,
//   selector,
//   num_retries,
// ) {
//   num_retries = num_retries || 5;
//   return call(
//     method,
//     params,
//     callback,
//     errorCallback,
//     data,
//     selector,
//     num_retries,
//   );
// }

// function file(
//   method,
//   params,
//   callback,
//   progressCallback,
//   errorCallback,
//   data,
//   selector,
// ) {
//   var url = urlModule.absURL("api/" + method);
//   _.each(params, function (v, k) {
//     if (v == null) {
//       delete params[k];
//     }
//   });
//   return $.ajax({
//     beforeSend: function (xhr, settings) {
//       xhr.setRequestHeader("X-XSRFToken", $.cookie("_xsrf"));
//       return true;
//     },
//     progress: function (xhr, progressEvent) {
//       if (progressCallback) {
//         progressCallback(progressEvent);
//       }
//     },
//     type: "POST",
//     url: url,
//     data: params,
//     processData: false,
//     contentType: false,
//     success: function (o, xhr, opt) {
//       if (callback) {
//         callback(o, data, xhr, opt);
//       }
//     },
//     error: function (xhr, opt, data) {
//       if (opt == "abort") {
//         return;
//       } else {
//         try {
//           resp = jQuery.parseJSON(xhr.responseText);
//         } catch (err) {
//           if (xhr.status == 504) {
//             resp = {
//               code: 4,
//               msg: "Request Timedout",
//             };
//           } else {
//             resp = {
//               code: 9,
//               msg: "Unknown Error",
//             };
//           }
//         }
//         _handleError(resp, data, xhr, opt, errorCallback, arguments);
//       }
//     },
//   });
// }
