export const zendeskURL = (article_id: string): string => article_id;
export const zendeskSectionURL = (section_id: string): string => section_id;
export const WishURL = (path: string): string => path;

// define([], function () {
//   function absURL(path, hostname) {
//     var port = location.port;
//     port = port == "" || port == 80 ? "" : ":" + port;
//     if (path.indexOf("/") == 0) {
//       path = path.substring(1);
//     }
//     if (!hostname) {
//       hostname = location.hostname;
//     }
//     return location.protocol + "//" + hostname + port + "/" + path;
//   }

//   function updateHash(category, value) {
//     window.location.hash = category + "=" + value;
//   }

//   function getURIFragment(name) {
//     var regex_string = "#" + name + "=([^&#]*)";
//     var regex = new RegExp(regex_string);
//     var result = regex.exec(window.location.hash);
//     if (result == null) {
//       return "";
//     } else {
//       return decodeURIComponent(result[1]);
//     }
//   }

//   function getURLParams() {
//     var queryDict = {};

//     location.search
//       .substr(1)
//       .split("&")
//       .forEach(function (item) {
//         key = decodeURIComponent(item.split("=")[0]);
//         val = decodeURIComponent(item.split("=")[1]);
//         queryDict[key] = val;
//       });

//     return queryDict;
//   }

//   function getURLParam(key) {
//     var params = getURLParams();
//     if (key in params) {
//       return params[key];
//     } else {
//       return null;
//     }
//   }

//   function absExtURL(url) {
//     if (url.indexOf("https://") === 0) {
//       return "https://" + url.replace("https://", "");
//     }
//     return "http://" + url.replace("http://", "");
//   }

//   function wishURL(path) {
//     const domain = (() => {
//       if (app.isStaging) {
//         return "staging.wish.com";
//       } else if (app.isTesting) {
//         return "testing.wish.com";
//       } else if (app.isSandbox) {
//         return "sandbox.wish.com";
//       } else {
//         return "wish.com";
//       }
//     })();

//     return `${location.protocol}//${domain}${path}`;
//   }

//   function contestImageURL(contest_id, size, sequence_id, cache_buster) {
//     if (!size) {
//       size = "medium";
//     }
//     let sequence_id_string = "";
//     if (sequence_id) {
//       sequence_id_string = sequence_id + "-";
//     }
//     let cache_buster_string = "";
//     if (cache_buster) {
//       cache_buster_string = "?cache_buster=" + cache_buster;
//     }
//     return `${window.lemmings_url}/${contest_id}-${sequence_id_string}${size}.jpg${cache_buster_string}`;
//   }

//   function resizedContestImageURL(
//     contest_id,
//     width,
//     height,
//     sequence_id,
//     mode,
//   ) {
//     var url = window.location.protocol;
//     url += "//canary.contestimg.wish.com/api/image/fetch?contest_id=";
//     url += contest_id;

//     if (width) {
//       url += "&w=";
//       url += Math.ceil(width);
//     }

//     if (height) {
//       url += "&h=";
//       url += Math.ceil(height);
//     }

//     if (sequence_id) {
//       url += "&s=";
//       url += sequence_id;
//     }

//     if (mode != null) {
//       url += "&m=";
//       url += mode;
//     }

//     return url;
//   }

//   function zendeskURL(article_id) {
//     var zendeskLocale = getZendeskLocale();

//     var zendeskUrl =
//       "https://merchantfaq.wish.com/hc/" +
//       zendeskLocale +
//       "/articles/" +
//       article_id;
//     return absExtURL(zendeskUrl);
//   }

//   function zendeskCategoryURL(category_id, locale) {
//     var zendeskLocale = getZendeskLocale(locale);

//     var zendeskCategoryUrl =
//       "https://merchantfaq.wish.com/hc/" +
//       zendeskLocale +
//       "/categories/" +
//       category_id;
//     return absExtURL(zendeskCategoryUrl);
//   }

//   function zendeskSectionURL(section_id) {
//     var zendeskLocale = getZendeskLocale();

//     var zendeskUrl =
//       "https://merchantfaq.wish.com/hc/" +
//       zendeskLocale +
//       "/sections/" +
//       section_id;
//     return absExtURL(zendeskUrl);
//   }

//   function getZendeskLocale(locale) {
//     var zendeskLocale = locale || window.locale_info.locale || "en";

//     if (zendeskLocale === "en") {
//       return "en-us";
//     }
//     if (zendeskLocale === "zh") {
//       return "zh-cn";
//     }

//     return zendeskLocale;
//   }

//   return {
//     absURL: absURL,
//     absExtURL: absExtURL,
//     wishURL: wishURL,
//     contestImageURL: contestImageURL,
//     resizedContestImageURL: resizedContestImageURL,
//     getURIFragment: getURIFragment,
//     getURLParams: getURLParams,
//     updateHash: updateHash,
//     getURLParam: getURLParam,
//     zendeskURL: zendeskURL,
//     zendeskCategoryURL: zendeskCategoryURL,
//     zendeskSectionURL: zendeskSectionURL,
//   };
// });
