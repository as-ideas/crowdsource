const RequestUtil = {};

RequestUtil.appendParameterToUrl = (url, params) => {
  url += "?";
  let paramArray = [];
  Object.keys(params).forEach(key => {
    let value = params[key];
    if (value instanceof Date) {
      value = JSON.stringify(value)
        .replace(/"/g, "");
      console.info("Converted date", params[key], "to", value);
    }
    paramArray.push("" + key + "=" + value)
  });
  url += paramArray.join("&");
  console.info("appendParameterToUrl", url);
  return url;
};

export default RequestUtil;
