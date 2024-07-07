const convertDate = (isoString) => {
  const date = new Date(isoString);

  // Extracting components
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // getMonth() returns 0-11
  const day = date.getDate();
  const hours = date.getHours();

  // Formatting to two digits
  const monthFormatted = month < 10 ? `0${month}` : month;
  const dayFormatted = day < 10 ? `0${day}` : day;
  const hoursFormatted = hours < 10 ? `0${hours}` : hours;

  // Constructing the formatted string
  const formattedDate = `${year}-${monthFormatted}-${dayFormatted}`;
  const formattedTime = `${hoursFormatted}`;

  return { formattedDate, formattedTime };
};

export default convertDate;
