const TextFormatService = {};

// 'M/d/yy, h:mm a'
TextFormatService.shortDate = (date) => {
  if (!date) {
    return "???";
  }

  date = (typeof date === 'string') ? new Date(date) : date;

  let year = date.getFullYear();
  let mm = date.getMonth() + 1;
  let dd = date.getDate();

  mm = (mm > 9 ? '' : '0') + mm;
  dd = (dd > 9 ? '' : '0') + dd;

  return `${dd}.${mm}.${year}`;
};

export default TextFormatService;
