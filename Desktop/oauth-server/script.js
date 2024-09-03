document.addEventListener('DOMContentLoaded', function () {
    initCalendar('from', 'calendarFrom', 'monthSelectorFrom', 'yearSelectorFrom', 'clearFrom', 'todayFrom');
    initCalendar('to', 'calendarTo', 'monthSelectorTo', 'yearSelectorTo', 'clearTo', 'todayTo');

    function initCalendar(inputId, calendarId, monthSelectorId, yearSelectorId, clearBtnId, todayBtnId) {
        const input = document.getElementById(inputId);
        const calendar = document.getElementById(calendarId);
        const monthSelector = document.getElementById(monthSelectorId);
        const yearSelector = document.getElementById(yearSelectorId);
        const clearBtn = document.getElementById(clearBtnId);
        const todayBtn = document.getElementById(todayBtnId);

        input.addEventListener('click', function () {
            document.querySelectorAll('.calendar.visible').forEach(c => c.classList.remove('visible'));
            calendar.classList.toggle('visible');
        });

        document.addEventListener('click', function (e) {
            if (!calendar.contains(e.target) && e.target !== input) {
                calendar.classList.remove('visible');
            }
        });

        generateCalendarDays(new Date().getFullYear(), new Date().getMonth(), calendar.querySelector('.calendar-body tbody'));

        monthSelector.addEventListener('change', function () {
            generateCalendarDays(parseInt(yearSelector.value), parseInt(monthSelector.value), calendar.querySelector('.calendar-body tbody'));
        });

        yearSelector.addEventListener('change', function () {
            generateCalendarDays(parseInt(yearSelector.value), parseInt(monthSelector.value), calendar.querySelector('.calendar-body tbody'));
        });

        clearBtn.addEventListener('click', function () {
            input.value = '';
            calendar.classList.remove('visible');
        });

        todayBtn.addEventListener('click', function () {
            const today = new Date();
            input.value = formatDate(today);
            calendar.classList.remove('visible');
        });

        function generateCalendarDays(year, month, daysContainer) {
            daysContainer.innerHTML = '';
            const firstDay = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();

            let dayRow = document.createElement('tr');
            for (let i = 0; i < firstDay; i++) {
                dayRow.appendChild(document.createElement('td'));
            }

            for (let day = 1; day <= daysInMonth; day++) {
                if (dayRow.children.length === 7) {
                    daysContainer.appendChild(dayRow);
                    dayRow = document.createElement('tr');
                }
                const dayCell = document.createElement('td');
                dayCell.textContent = day;
                dayCell.dataset.date = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                dayCell.addEventListener('click', function () {
                    input.value = this.dataset.date;
                    calendar.classList.remove('visible');
                });
                dayRow.appendChild(dayCell);
            }

            daysContainer.appendChild(dayRow);
        }

        function formatDate(date) {
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            return `${year}-${month}-${day}`;
        }

        const now = new Date();
        monthSelector.value = now.getMonth();
        yearSelector.value = now.getFullYear();
    }
});

document.addEventListener("DOMContentLoaded", function () {
  const today = new Date();
  const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;

  const fromDateInput = document.getElementById("from");
  const toDateInput = document.getElementById("to");

  fromDateInput.addEventListener("input", function() {
    toDateInput.value = fromDateInput.value;
  });

  const calendarBody = document.querySelector(".calendar-body");
  calendarBody.addEventListener("click", function (event) {
    const selectedDate = event.target.dataset.date;
    if (selectedDate) {
      const formattedSelectedDate = formatDate(selectedDate);
      toDateInput.value = formattedSelectedDate;
    }
  });

  fromDateInput.value = formattedDate;
  toDateInput.value = formattedDate;

  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const datepickerInput = document.getElementById("to");
  const datepickerInputFrom = document.getElementById("from");
  const calendar = document.querySelector(".calendar");
  const monthSelector = document.getElementById("monthSelector");
  const yearSelector = document.getElementById("yearSelector");
  let activeInput = null;

  function formatDate(date) {
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return year + "-" + month + "-" + day;
  }

  function showCalendar() {
    calendar.classList.add("visible");
  }

  function hideCalendar() {
    calendar.classList.remove("visible");
  }

  function handleDateSelection() {
    if (this.dataset.date) {
      const selectedDate = new Date(this.dataset.date);
      activeInput.value = formatDate(selectedDate);
      hideCalendar();
    }
  }

  function generateCalendar(month, year) {
    const calendarBody = document.querySelector(".calendar-body");
    calendarBody.innerHTML = "";

    const today = new Date();
    const currentMonth = month !== undefined ? month : today.getMonth();
    const currentYear = year !== undefined ? year : today.getFullYear();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    let calendarHTML =
      "<table><tr><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr><tr>";
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarHTML += '<td class="empty-cell"></td>';
    }
    for (let i = 1; i <= daysInMonth; i++) {
      if ((firstDayOfMonth + i - 1) % 7 === 0) {
        calendarHTML += "</tr><tr>";
      }
      calendarHTML += `<td data-date="${currentYear}-${currentMonth + 1}-${i}">${i}</td>`;
    }
    calendarHTML += "</tr></table>";
    calendarBody.innerHTML = calendarHTML;

    const days = calendar.querySelectorAll("td:not(.empty-cell)");
    days.forEach(function (day) {
      day.addEventListener("click", handleDateSelection);
    });

    monthSelector.value = currentMonth;
    yearSelector.value = currentYear;
  }

  generateCalendar();

  const currentYear = new Date().getFullYear();
  for (let i = currentYear - 10; i <= currentYear + 10; i++) {
    const option = document.createElement("option");
    option.text = i;
    option.value = i;
    yearSelector.add(option);
  }

  monthSelector.addEventListener("change", function () {
    generateCalendar(parseInt(this.value), parseInt(yearSelector.value));
  });

  yearSelector.addEventListener("change", function () {
    generateCalendar(parseInt(monthSelector.value), parseInt(this.value));
  });

  function updateCalendar(action, value) {
    const currentYear = parseInt(yearSelector.value);
    const currentMonth = parseInt(monthSelector.value);
    switch (action) {
      case "prevMonth":
        monthSelector.value = currentMonth === 0 ? 11 : currentMonth - 1;
        break;
      case "nextMonth":
        monthSelector.value = currentMonth === 11 ? 0 : currentMonth + 1;
        break;
      case "prevYear":
        yearSelector.value = currentYear - 1;
        break;
      case "nextYear":
        yearSelector.value = currentYear + 1;
        break;
      default:
        break;
    }
    generateCalendar(
      parseInt(monthSelector.value),
      parseInt(yearSelector.value)
    );
  }

  document.getElementById("prevMonthBtn").addEventListener("click", () => updateCalendar("prevMonth"));
  document.getElementById("nextMonthBtn").addEventListener("click", () => updateCalendar("nextMonth"));
  document.getElementById("prevYearBtn").addEventListener("click", () => updateCalendar("prevYear"));
  document.getElementById("nextYearBtn").addEventListener("click", () => updateCalendar("nextYear"));

  function handleDatepickerInputClick(input) {
    if (calendar.classList.contains("visible")) {
      hideCalendar();
    } else {
      showCalendar();
      activeInput = input;
    }
  }

  datepickerInputFrom.addEventListener("click", () => handleDatepickerInputClick(datepickerInputFrom));
  datepickerInput.addEventListener("click", () => handleDatepickerInputClick(datepickerInput));

  document.getElementById("clearBtn").addEventListener("click", function () {
    activeInput.value = "";
    hideCalendar();
  });

  document.getElementById("todayBtn").addEventListener("click", function () {
    const today = new Date();
    activeInput.value = formatDate(today);
    hideCalendar();
  });

  const datepickerImageFrom = document.querySelector("#from + .custom-date-picker img");
  const datepickerImageTo = document.querySelector("#to + .custom-date-picker img");

  datepickerImageFrom.addEventListener("click", () => handleDatepickerInputClick(datepickerInputFrom));
  datepickerImageTo.addEventListener("click", () => handleDatepickerInputClick(datepickerInput));
});

function populateSelect(selectElement, start, end, step) {
  selectElement.innerHTML = "";
  for (let i = start; i <= end; i += step) {
    const option = document.createElement("option");
    option.text = i < 10 ? "0" + i : "" + i;
    selectElement.add(option);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const timeInputTo = document.getElementById("to_time");
  const hourSelectTo = document.getElementById("to_hour-select");
  const minuteSelectTo = document.getElementById("to_minute-select");
  const customTimeInputTo = document.querySelector(".custom-time-input.to");
  const timeInputFrom = document.getElementById("from_time");
  const hourSelectFrom = document.getElementById("from_hour-select");
  const minuteSelectFrom = document.getElementById("from_minute-select");
  const customTimeInputFrom = document.querySelector(".custom-time-input.from");

  function handleTimeInputClick(input, customInput) {
    customInput.classList.toggle("open");
  }

  timeInputTo.addEventListener("click", () => handleTimeInputClick(timeInputTo, customTimeInputTo));
  timeInputFrom.addEventListener("click", () => handleTimeInputClick(timeInputFrom, customTimeInputFrom));

  document.addEventListener("click", function (e) {
    if (!customTimeInputTo.contains(e.target) && e.target !== timeInputTo) {
      customTimeInputTo.classList.remove("open");
    }
    if (!customTimeInputFrom.contains(e.target) && e.target !== timeInputFrom) {
      customTimeInputFrom.classList.remove("open");
    }
  });

  function selectTime(e, input) {
    const selected = e.target.parentElement.querySelector(".selected");
    if (selected) {
      selected.classList.remove("selected");
    }
    e.target.classList.add("selected");
    updateTime(input);
  }

  function updateTime(input) {
    const timeSelect = input.parentElement.querySelectorAll(".time-select");
    const selectedHour = timeSelect[0].querySelector(".selected");
    const selectedMinute = timeSelect[1].querySelector(".selected");

    if (selectedHour && selectedMinute) {
      const hour = selectedHour.textContent;
      const minute = selectedMinute.textContent;
      const timePlace = input.closest(".custom-time-input");
      timePlace.classList.remove("open");
      timePlace.querySelector("input").value = formatTime(hour, minute);
    }
  }

  hourSelectTo.addEventListener("click", (e) => selectTime(e, hourSelectTo));
  minuteSelectTo.addEventListener("click", (e) => selectTime(e, minuteSelectTo));
  hourSelectFrom.addEventListener("click", (e) => selectTime(e, hourSelectFrom));
  minuteSelectFrom.addEventListener("click", (e) => selectTime(e, minuteSelectFrom));
});

function formatTime(hour, minute) {
  return ("0" + hour).slice(-2) + ":" + ("0" + minute).slice(-2);
}
