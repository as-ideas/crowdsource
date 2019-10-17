const RequestUtil = {};

RequestUtil.appendParameterToUrl = (url, params) => {
  url += "?";
  let paramArray = [];
  Object.keys(params).forEach(key => {
    let value = params[key];
    if (value instanceof Date) {
      value = JSON.stringify(value)
        .replace(/"/g, "");
    }
    paramArray.push("" + key + "=" + value)
  });
  url += paramArray.join("&");
  return url;
};

export default RequestUtil;
