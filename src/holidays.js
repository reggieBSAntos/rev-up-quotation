export default (holidays, container) => {
  container.innerHTML = `
      <span> AUSTRALIA HOLIDAYS ${currentYear}</span> 
      <ul>
      ${holidays
        .filter((h) => h.start.split("-")[0] == currentYear)
        .sort((a, b) => convertToDate(a.start) - convertToDate(b.start))
        .map(
          (holiday) => `<li>
        ${convertToMmmDd(holiday.start)} - ${holiday.summary}
      </li>`
        )
        .join("")}</ul>`;
};

const currentYear = new Date().getFullYear();

const convertToDate = (str) => {
  const parts = str.split("-").map((r) => parseInt(r));
  return new Date(parts[0], parts[1] - 1, parts[2], 0, 0, 0);
};

const convertToMmmDd = (str) => {
  // DATE FORMAT "2023-01-01"
  const parts = str.split("-").map((r) => parseInt(r));
  return convertToDate(str)
    .toDateString()
    .match(/\w{3}\s\w{3}\s\d{2}/)[0];
};
