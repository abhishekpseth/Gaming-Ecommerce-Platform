const convertToDateText = (date) => {
  const dateObject = new Date(date);

  const options = { day: "numeric", month: "long", year: "numeric" };
  return dateObject.toLocaleDateString("en-GB", options);
};

const DateTimeUtil = {
  convertToDateText
};

export default DateTimeUtil;
