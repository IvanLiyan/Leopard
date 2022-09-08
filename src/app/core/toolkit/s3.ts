// these functions are placeholders and will be replaced in a future ticket
// variable names are preserved for documentation purposes
/* eslint-disable @typescript-eslint/no-unused-vars */
export const uploadToS3 = (
  form?: unknown,
  success?: unknown,
  failure?: unknown,
  ext?: unknown,
  allowDocs?: unknown,
  overrideFile?: unknown,
  maxFileSize?: unknown,
  bucket?: unknown,
): null => null;

// define(["core/api", "core/i18n", "lib/jquery.form"], function (
//   api,
//   i18nModule,
//   _jqueryform,
// ) {
//   var i18n = i18nModule.i18n;
//   function createCORSRequest() {
//     var xhr;
//     if (typeof XMLHttpRequest != "undefined") {
//       xhr = new XMLHttpRequest();
//     }
//     return xhr;
//   }

//   function logErrorsToServer(response, status, state, description) {
//     api.call(
//       "log-manual-upload-image-error",
//       {
//         response:
//           response !== null && typeof response === "object"
//             ? JSON.stringify(response)
//             : response,
//         status: status,
//         state: state,
//         description: description,
//         url: window.location.href,
//       },
//       null,
//     );
//   }

//   function validateFile(url, success, failure, verifyURL) {
//     if (typeof verifyURL === "undefined") verifyURL = "merch-url/image";
//     api.call(verifyURL, { url: url }, success, failure);
//   }

//   function checkFileType(file) {
//     allowedDocTypes = [
//       "text/csv",
//       "application/pdf",
//       "application/msword",
//       "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//       "application/vnd.ms-excel",
//       "application/wps-office.xlsx",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     ];
//     if (file.type.indexOf("image/") == 0) {
//       return "image";
//     } else if (allowedDocTypes.indexOf(file.type) > -1) {
//       return "doc";
//     } else if (file.type.indexOf("video/") == 0) {
//       return "video";
//     }
//     return false;
//   }

//   function fallbackServerUpload(form, success, failure, type) {
//     if (form == null) {
//       failure({
//         msg: i18n(
//           "Your browser does not support drag file uploading." +
//             " Please upload using the button instead",
//         ),
//       });
//       return;
//     }
//     var url;
//     if (type === "image") {
//       url = "/api/upload-tmp-image";
//     } else {
//       url = "/api/upload-tmp-file";
//     }
//     form.ajaxForm({
//       url: url,
//       type: "post",
//       dataType: "text",
//       success: success,
//       error: failure,
//     });
//     form.submit();
//   }

//   function uploadFilesToS3(
//     form,
//     success,
//     failure,
//     ext,
//     idx,
//     allowDocs,
//     overrideFile,
//     maxFileSize,
//   ) {
//     if (typeof allowDocs == "undefined") allowDocs = false;
//     // Validate file
//     var file;
//     if (form == null) {
//       file = overrideFile;
//     } else {
//       file = form.find("input.real-file-upload")[0].files[idx];
//     }

//     var type = checkFileType(file);

//     if (maxFileSize && maxFileSize > 0 && file.size > maxFileSize * 1048576) {
//       failure(
//         {
//           msg: i18n(
//             "File is too large. Please upload a file that is smaller than %1$d MB",
//             maxFileSize,
//           ),
//         },
//         null,
//       );
//       return;
//     }

//     var xhr = createCORSRequest();
//     if (xhr == undefined) {
//       //cors not supported, upload using the server
//       fallbackServerUpload(form, success, failure, type);
//     } else {
//       var verifyURL;
//       if (type === "image") {
//         verifyURL = "merch-url/image";
//       } else {
//         verifyURL = "merch-url/file";
//       }
//       api.call(
//         "generate-signed-upload-url",
//         { type: file.type, ext: ext, name: file.name },
//         function (resp) {
//           var image_url = resp.data.image_url;
//           xhr.addEventListener(
//             "load",
//             function (e) {
//               if (xhr.readyState != 4) {
//                 return;
//               }

//               if (!(200 <= (_ref = xhr.status) && _ref < 300)) {
//                 failure(resp, xhr);
//                 logErrorsToServer(
//                   xhr.response,
//                   xhr.status,
//                   "load",
//                   "uploadToS3",
//                 );
//               } else {
//                 validateFile(
//                   image_url,
//                   function () {
//                     success(resp, xhr);
//                   },
//                   function (_resp) {
//                     failure(_resp, xhr);
//                   },
//                   verifyURL,
//                 );
//               }
//             },
//             false,
//           );

//           xhr.addEventListener(
//             "error",
//             function (e) {
//               fallbackServerUpload(form, success, failure, type);
//               logErrorsToServer(
//                 xhr.response,
//                 xhr.status,
//                 "error",
//                 "uploadToS3",
//               );
//             },
//             false,
//           );

//           xhr.addEventListener(
//             "abort",
//             function (e) {
//               failure(resp, xhr);
//               logErrorsToServer(
//                 xhr.response,
//                 xhr.status,
//                 "abort",
//                 "uploadToS3",
//               );
//             },
//             false,
//           );

//           xhr.open("PUT", resp.data.url, true);

//           xhr.setRequestHeader("Content-Type", file.type);
//           xhr.setRequestHeader("x-amz-acl", "public-read");

//           xhr.timeout = 120000; // Set timeout to 120 seconds
//           xhr.ontimeout = function () {
//             fallbackServerUpload(form, success, failure, type);
//             logErrorsToServer(
//               xhr.response,
//               xhr.status,
//               "timeout",
//               "uploadToS3",
//             );
//           };

//           xhr.send(file);
//         },
//         function (resp) {
//           failure(resp);
//         },
//       );
//     }
//   }

//   function uploadToS3(
//     form,
//     success,
//     failure,
//     ext,
//     allowDocs,
//     overrideFile,
//     maxFileSize,
//     bucket,
//   ) {
//     if (typeof allowDocs == "undefined") allowDocs = false;
//     // Validate file
//     var file;
//     if (form == null) {
//       file = overrideFile;
//     } else {
//       file = form.find("input.real-file-upload")[0].files[0];
//     }

//     var type = checkFileType(file);
//     if (!type || (type === "doc" && !allowDocs)) {
//       failure({ msg: i18n("Invalid file type") }, null);
//       return;
//     }

//     if (maxFileSize && maxFileSize > 0 && file.size > maxFileSize * 1048576) {
//       failure(
//         {
//           msg: i18n(
//             "File is too large. Please upload a file that is smaller than %1$d MB",
//             maxFileSize,
//           ),
//         },
//         null,
//       );
//       return;
//     }

//     var xhr = createCORSRequest();
//     if (xhr == undefined) {
//       //cors not supported, upload using the server
//       fallbackServerUpload(form, success, failure, type);
//     } else {
//       var verifyURL;
//       if (type === "image") {
//         verifyURL = "merch-url/image";
//       } else {
//         verifyURL = "merch-url/file";
//       }
//       api.call(
//         "generate-signed-upload-url",
//         { type: file.type, ext: ext, name: file.name, "bucket-type": bucket },
//         function (resp) {
//           var image_url = resp.data.image_url;
//           xhr.addEventListener(
//             "load",
//             function (e) {
//               if (xhr.readyState != 4) {
//                 return;
//               }

//               if (!(200 <= (_ref = xhr.status) && _ref < 300)) {
//                 failure(resp, xhr);
//                 logErrorsToServer(
//                   xhr.response,
//                   xhr.status,
//                   "load",
//                   "uploadToS3",
//                 );
//               } else {
//                 validateFile(
//                   image_url,
//                   function () {
//                     success(resp, xhr);
//                   },
//                   function (_resp) {
//                     failure(_resp, xhr);
//                   },
//                   verifyURL,
//                 );
//               }
//             },
//             false,
//           );

//           xhr.addEventListener(
//             "error",
//             function (e) {
//               fallbackServerUpload(form, success, failure, type);
//               logErrorsToServer(
//                 xhr.response,
//                 xhr.status,
//                 "error",
//                 "uploadToS3",
//               );
//             },
//             false,
//           );

//           xhr.addEventListener(
//             "abort",
//             function (e) {
//               failure(resp, xhr);
//               logErrorsToServer(
//                 xhr.response,
//                 xhr.status,
//                 "abort",
//                 "uploadToS3",
//               );
//             },
//             false,
//           );

//           xhr.open("PUT", resp.data.url, true);

//           xhr.setRequestHeader("Content-Type", file.type);
//           xhr.setRequestHeader("x-amz-acl", "public-read");

//           xhr.timeout = 120000; // Set timeout to 120 seconds
//           xhr.ontimeout = function () {
//             fallbackServerUpload(form, success, failure, type);
//             logErrorsToServer(
//               xhr.response,
//               xhr.status,
//               "timeout",
//               "uploadToS3",
//             );
//           };

//           xhr.send(file);
//         },
//         function (resp) {
//           failure(resp);
//         },
//       );
//     }
//   }

//   function dropzoneUploadFiles(
//     files,
//     dropzone,
//     allowDocs,
//     allowImages,
//     rename,
//     bucketType,
//   ) {
//     if (typeof allowDocs == "undefined") allowDocs = false;
//     if (typeof allowImages == "undefined") allowImages = true;
//     var file = files[0];
//     var type = checkFileType(file);
//     if (!type) {
//       dropzone._errorProcessing(files, "");
//       return;
//     } else if (type === "doc") {
//       if (allowDocs) {
//         verifyURL = "merch-url/file";
//       } else {
//         dropzone._errorProcessing(files, "");
//         return;
//       }
//     } else if (type === "image") {
//       if (allowImages) {
//         verifyURL = "merch-url/image";
//       } else {
//         dropzone._errorProcessing(files, "");
//         return;
//       }
//     }
//     api.call(
//       "generate-signed-upload-url",
//       {
//         type: file.type,
//         name: file.name,
//         rename: rename,
//         "bucket-type": bucketType,
//       },
//       function (resp) {
//         var url = resp.data.url;
//         uploadFiles(files, dropzone, url, resp.data.image_url, verifyURL);
//       },
//       function () {
//         dropzone._errorProcessing(files, "");
//         logErrorsToServer("generate url failed", "", "", "dropzoneUploadFiles");
//       },
//     );
//   }

//   function uploadFiles(files, dropzone, url, image_url, verifyURL) {
//     var file,
//       handleError,
//       headerName,
//       headerValue,
//       headers,
//       i,
//       input,
//       inputName,
//       inputType,
//       key,
//       option,
//       progressObj,
//       response,
//       updateProgress,
//       value,
//       xhr,
//       _i,
//       _j,
//       _k,
//       _l,
//       _len,
//       _len1,
//       _len2,
//       _len3,
//       _m,
//       _ref,
//       _ref1,
//       _ref2,
//       _ref3,
//       _ref4,
//       _ref5,
//       _this = dropzone;
//     xhr = new XMLHttpRequest();
//     for (_i = 0, _len = files.length; _i < _len; _i++) {
//       file = files[_i];
//       file.xhr = xhr;
//     }
//     xhr.open("PUT", url, true);
//     xhr.withCredentials = !!dropzone.options.withCredentials;
//     response = null;
//     handleError = function () {
//       return _this._errorProcessing(
//         files,
//         _this.options.dictResponseError.replace("{{statusCode}}", xhr.status),
//         xhr,
//       );
//     };
//     xhr.onload = function (e) {
//       var _ref;
//       if (files[0].status == "canceled") {
//         return;
//       }
//       if (xhr.readyState !== 4) {
//         return;
//       }
//       response = image_url;

//       if (!(200 <= (_ref = xhr.status) && _ref < 300)) {
//         logErrorsToServer(xhr.response, xhr.status, "load", "uploadFiles");
//         return handleError();
//       } else {
//         validateFile(
//           response,
//           function () {
//             _this._finished(files, response, e);
//           },
//           function () {
//             handleError();
//           },
//           verifyURL,
//         );
//       }
//     };

//     xhr.onerror = function () {
//       if (files[0].status == "canceled") {
//         return;
//       }

//       logErrorsToServer(xhr.response, xhr.status, "error", "uploadFiles");
//       return handleError();
//     };

//     xhr.onabort = function () {
//       if (files[0].status == "canceled") {
//         return;
//       }
//       logErrorsToServer(xhr.response, xhr.status, "abort", "uploadFiles");
//       return handleError();
//     };

//     progressObj = (_ref = xhr.upload) != null ? _ref : xhr;
//     progressObj.onprogress = updateProgress;
//     headers = {
//       Accept: "application/json",
//       "Cache-Control": "no-cache",
//       "X-Requested-With": "XMLHttpRequest",
//     };
//     if (dropzone.options.headers) {
//       extend(headers, dropzone.options.headers);
//     }
//     for (headerName in headers) {
//       headerValue = headers[headerName];
//       xhr.setRequestHeader(headerName, headerValue);
//     }

//     xhr.setRequestHeader("Content-Type", file.type);
//     xhr.setRequestHeader("x-amz-acl", "public-read");

//     return xhr.send(file);
//   }

//   return {
//     uploadToS3: uploadToS3,
//     uploadFilesToS3: uploadFilesToS3,
//     dropzoneUploadFiles: dropzoneUploadFiles,
//     logErrorsToServer: logErrorsToServer,
//   };
// });
