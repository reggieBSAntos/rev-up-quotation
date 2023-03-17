export default (onSelect = () => {}, holidays = null) => {
  if (document.querySelector(".calendar") != null) {
    close(document.querySelector(".calendar"));
    return;
  }

  let date = new Date();
  const renderCalendar = () => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const prevLastDay = new Date(date.getFullYear(), date.getMonth(), 0);

    let days = Array.from({ length: firstDay.getDay() }, (_, i) =>
      new Date(firstDay).setDate(-i)
    ).reverse();

    days = days.concat(
      Array.from({ length: lastDay.getDate() }, (_, i) =>
        new Date(firstDay).setDate(i + 1)
      )
    );

    days = days.concat(
      Array.from({ length: 42 - days.length }, (_, i) =>
        new Date(lastDay).setDate(lastDay.getDate() + i + 1)
      )
    );

    const padString = (val) => {
      return val.toString().padStart(2, 0);
    };

    const innerHtml = days
      .map((day, dayIndex) => {
        const newDate = new Date(day);
        const newDateString = `${newDate.getFullYear()}-${padString(
          newDate.getMonth() + 1
        )}-${padString(newDate.getDate())}`;

        const today = new Date();
        const todayString = `${today.getFullYear()}-${padString(
          today.getMonth() + 1
        )}-${padString(today.getDate())}`;

        const isCurrent =
          newDate < firstDay
            ? " day--previous"
            : newDate > lastDay
            ? " day--next"
            : " day--present";

        // IF LESS TODAY OR LESS THAN TODAY DISABLE AUTOMATICALLY
        const isClickable = newDate > today ? " day--clickable" : "";

        const isToday = todayString === newDateString ? " today" : "";

        // IF DAY IS SUNDAY
        const isWeekEnd = newDate.getDay() === 0 ? " weekend" : "";

        let isHoliday =
          holidays != null
            ? holidays.findIndex((r) => {
                return r.start === newDateString;
              }) !== -1
              ? " holiday"
              : ""
            : "";

        return `<div class="day"
              data-date="${day}">
                <span class="${isToday}${isWeekEnd}${isCurrent}${isHoliday}${isClickable}">
                ${newDate.getDate()}
                </span>
              </div>`;
      })
      .join("");

    monthContainer.textContent = `${
      months[date.getMonth()]
    } ${date.getFullYear()} `;
    daysContainer.innerHTML = innerHtml;
  };

  const calendar = document.createElement("div");
  calendar.className = "calendar";
  calendar.innerHTML = `
  <div class="calendar__window">
      <div class="date">
        <p></p>
        <button class="calendar__close">&times;</button>
      </div>
      <div class="month">
        <span class="material-icons month__prev"> arrow_back_ios_new </span>
        <h1></h1>
        <span class="material-icons month__next"> arrow_forward_ios </span>
      </div>
      <div class="weekdays">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>
      <div class="days"></div>
    </div>
   
  `;

  const monthContainer = calendar.querySelector(".month h1");
  const dateContainer = calendar.querySelector(".date p");
  const daysContainer = calendar.querySelector(".days");

  calendar.addEventListener("click", (e) => {
    const el = e.target;

    if (el.closest(".month__prev")) {
      date.setMonth(date.getMonth() - 1);
      renderCalendar();
      return;
    }

    if (el.closest(".month__next")) {
      date.setMonth(date.getMonth() + 1);
      renderCalendar();

      return;
    }

    if (el.closest(".day--clickable:not(.weekend):not(.holiday)")) {
      date = new Date(parseFloat(el.closest(".day").dataset.date));
      onSelect(date);
      close(calendar);
    }

    if (el.closest(".calendar__close")) {
      close(calendar);
    }

    if (el === calendar) {
      close(calendar);
    }
  });

  renderCalendar();
  dateContainer.innerHTML = "Select a workday only";
  document.body.append(calendar);
};

const close = (calendar) => {
  calendar.classList.add("calendar--close");
  calendar.addEventListener("animationend", () => calendar.remove());
};

/* (async () => {
  try {
    const calendarUrl =
      "https://script.google.com/macros/s/AKfycbzXpGROoIlji0ArD-iob6hSRCzIRnxQDGDYIEniaxsgoJTPLf_pqWLZcpTW58I-ZG0A3w/exec";
    const res = await fetch(calendarUrl);
    holidays = await res.json();
  } catch (err) {
  } finally {
  }
})(); */

if (document.head.querySelector("style") == null)
  document.head.append(document.createElement("style"));

document.head.querySelector("style").innerHTML += `
.calendar {
  --width: 350px;

  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  padding: 10px;
  box-sizing: border-box;

  opacity: 0;
  animation-duration: 0.2s;
  animation-fill-mode: forwards;
  animation-name: calendar---open;

  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 105;
}
.calendar--close {
  animation-name: calendar---close;
}
.calendar__window {
  max-width: var(--width);
  background: none;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);

  overflow: hidden;
  border-radius: 4px;
  box-sizing: border-box;

  font-family: sans-serif;

  opacity: 0;
  transform: scale(0.75);
  animation-name: confirm__window---open;
  animation-duration: 0.2s;
  animation-fill-mode: forwards;
  animation-delay: 0.2s;
}
@media (max-width: 428px), (min-height: 813px) {
  .calendar{
    --width: 100%
  }
}
.date {
  background: var(--primary);
  padding: 1.25em;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.calendar__close {
  background: none;
  outline: none;
  border: none;
  transform: scale(2);
  font-weight: 300;
  color: rgba(0, 0, 0, 0.49);
  transition: color 0.2s;
}
.calendar__close:hover {
  color: red;
  cursor: pointer;
}
.month {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin: none;
  padding: 1.75em; /*  3.2px */

  background: #eeeeee;
  text-align: center;
}

.month .material-icons {
  color: var(--primary);
  font-size: 1em;
  cursor: pointer;
}
.month h1 {
  color: var(--primary);
  font-size: 1.15em; /* 48px */
  font-weight: 600;

  text-transform: uppercase;
  text-align: center;
  letter-spacing: 1px; /* 3.2px */
}
.weekdays {
  background: #ffffff;
  color: var(--color-black);
  width: 100%;
  padding: 5px 3.2px;

  display: flex;
  align-items: center;
  box-sizing: border-box;
}

.weekdays div {
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.8px;
  height: 100%;
  /* calender width() - (weekdays horizontal padding( )x2)  */
  width: calc((var(--width) - (3.2px * 2)) / 2);
  display: flex;
  justify-content: center;
  align-items: center;
}

.days {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  background: var(--gray);
  padding: 1.6px; /* 3.2px */
  background: #ffffff;
}
.day {
  position: relative;
  font-size: 14px; /* 22.4px */
  padding: 4px;
  margin: 2.4px; /* 4.8px */
  font-weight: 300;
  /* calender width() - (weekdays horizontal padding()x2)  - (day horizontal margins() x 2 x 7 ) */
  width: calc((var(--width) - ((3.2px * 2) + (2.4px * 7 * 2))) / 7);
  /* width: calc(40.2rem / 7); */
  height: 40px; /* 80px */
  display: flex;
  justify-content: center;
  border: 1px solid transparent;
  align-items: center;

  transition: 0.2s ease-in-out;
}
.day > span {
  width: 100%;
  height: 100%;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.weekend,
.holiday {
  color: var(--red-light);
}
.today {
  font-weight: 700;
}
.day--previous,
.day--next {
  opacity: 0.5;
}
/* .day:not(.day--previous):not(.day--next) {
  font-weight: 500;
} */
.day--present:not(.weekend):not(.holiday) {
  color: var(--secondary-light);
}
/*  .day--present:not(.weekend):not(.holiday):hover  */
.day--clickable:not(.weekend):not(.holiday):hover
{
  font-weight: 600;
  transform: scale(1.25);

  cursor: pointer;
}
@keyframes calendar---open {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes calendar---close {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes calendar__window---open {
  to {
    opacity: 1;
    transform: scale(1);
  }
}
`;
