// Встановлюємо WebSocket-з'єднання
const socket = new WebSocket('wss://polar-shore-05125-b49ae913d73c.herokuapp.com');

// Обработка сообщений от сервера
socket.onmessage = function(event) {
    const message = JSON.parse(event.data);
    console.log('Message received from server:', message);  // Логування отриманого повідомлення

    if (message.action === 'login_success') {
        console.log('Login successful, saving token to localStorage:', message.token);
        localStorage.setItem('accessToken', message.token);  // Зберігаємо токен в localStorage
        updateUI(true);
    }
};

// Функция для обновления интерфейса
function updateUI(loggedIn) {
    console.log('Updating UI, logged in:', loggedIn);  // Логування стану інтерфейсу
    if (loggedIn) {
        document.getElementById('login').style.display = 'none';
        document.getElementById('logout').style.display = 'block';
        document.getElementById('calculateForm').style.display = 'block';
    } else {
        document.getElementById('login').style.display = 'block';
        document.getElementById('logout').style.display = 'none';
        document.getElementById('calculateForm').style.display = 'none';
    }
}

// Проверяем токен при открытии расширения
document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('accessToken');
    console.log('Access token from localStorage on load:', token);  // Логування токена при завантаженні

    if (token) {
        updateUI(true);
    } else {
        updateUI(false);
    }

    // Привязка событий и инициализация
    initEventListeners();
});

// При натисканні на кнопку логіну ініціюємо процес авторизації
document.getElementById('login').addEventListener('click', function() {
    browser.runtime.sendMessage({ action: 'login' });
    console.log('Login button clicked, initiating login process');  // Логування натискання кнопки логіну
});

// При натисканні на кнопку виходу
document.getElementById('logout').addEventListener('click', function() {
    localStorage.removeItem('accessToken');  // Видаляємо токен з localStorage
    updateUI(false);
    console.log('Logout button clicked, token removed, UI updated');  // Логування натискання кнопки виходу
});

// Функция инициализации событий и формы
function initEventListeners() {
    document.getElementById("calculateForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const isShowTable = await handleCalculateClick();

        if (isShowTable) {
            showTab("textInput");
            setActiveTab("textTab");
        }
    });

    document.getElementById("textTab").addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();

        await handleCalculateClick();

        showTab("textInput");
        setActiveTab("textTab");
    });

    document.getElementById("listTab").addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();

        await handleCalculateClick();

        showTab("listOutput");
        setActiveTab("listTab");
    });

    document.getElementById("clearHistButton").addEventListener("click", function () {
        localStorage.removeItem("searchHistoryList");
        document.getElementById("searchHistoryList").innerHTML = "";
        alert("Search History cleared successfully!");
    });

    // Динамическое обновление года
    const yearSelector = document.getElementById("yearSelector");
    const currentYear = new Date().getFullYear();
    for (let year = currentYear - 10; year <= currentYear + 10; year++) {
        const option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        yearSelector.appendChild(option);
    }
    yearSelector.value = currentYear;

    // Отображение и обработка вкладок
    document.getElementById("privacyLink").addEventListener("click", function () {
        showPage("privacyPage");
    });

    document.getElementById("searchHistoryLink").addEventListener("click", function () {
        showPage("searchHistory");
        displaySearchHistory();
    });

    document.getElementById("bugReportLink").addEventListener("click", function () {
        showPage("bugReport");
    });

    document.getElementById("backButton").addEventListener("click", function () {
        showPage("mainPage");
    });

    document.getElementById("bugBackButton").addEventListener("click", function () {
        showPage("mainPage");
    });

    document.getElementById("historyBackButton").addEventListener("click", function () {
        showPage("mainPage");
    });

    // Дополнительные события для форм и полей ввода
    document
        .querySelector("#input-time-from")
        .addEventListener("click", openDropDown);
    document
        .querySelector("#input-date-from")
        .addEventListener("click", openDropDown);
    document
        .querySelector("#input-time-to")
        .addEventListener("click", openDropDown);
    document
        .querySelector("#input-date-to")
        .addEventListener("click", openDropDown);

    const copyButton = document.getElementById("copyButton");
    const selectedTimeRange = document.getElementById("selectedTimeRange");

    copyButton.addEventListener("click", function () {
        const textToCopy = selectedTimeRange.textContent;
        copyTextToClipboardAndChangeImage(textToCopy);
        console.log('Text copied to clipboard:', textToCopy);  // Логування копіювання тексту
    });

    selectedTimeRange.addEventListener("click", function () {
        const textToCopy = selectedTimeRange.textContent;
        copyTextToClipboardAndChangeImage(textToCopy);
        console.log('Text copied to clipboard:', textToCopy);  // Логування копіювання тексту
    });

    document.getElementById("termsLink").addEventListener("click", function(event) {
        event.preventDefault();
        window.open("https://developers.google.com/terms/api-services-user-data-policy", "_blank");
    });

    // Ініціалізація календарів
    initCalendar('from', 'calendarFrom', 'monthSelectorFrom', 'yearSelectorFrom', 'clearFrom', 'todayFrom');
    initCalendar('to', 'calendarTo', 'monthSelectorTo', 'yearSelectorTo', 'clearTo', 'todayTo');
}

// Функция для открытия выпадающего списка
function openDropDown() {
    this.previousElementSibling.click();
}

// Функция для инициализации календаря
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

    // Ініціалізація місяця та року при завантаженні
    const now = new Date();
    monthSelector.value = now.getMonth();
    yearSelector.value = now.getFullYear();
}

// Функция для обработки нажатия на кнопку "Calculate"
async function handleCalculateClick() {
    return new Promise(async (res, rej) => {
        resetInputStyles();

        const fromDate = document.getElementById("from").value;
        let fromTime = document.getElementById("from_time").value;
        const toDate = document.getElementById("to").value;
        let toTime = document.getElementById("to_time").value;
        const fromTimeFormate = document.getElementById("time_from_formate").value;
        const toTimeFormate = document.getElementById("time_to_formate").value;

        console.log('Form data:', { fromDate, fromTime, toDate, toTime });  // Логування введених даних форми

        if (fromTime.split(":")[0] === "12" && fromTimeFormate === "AM") {
            const fromTimeParts = fromTime.split(":");
            let hours = parseInt(fromTimeParts[0], 10);
            const minutes = parseInt(fromTimeParts[1], 10);
            hours = "00";
            fromTime =
                hours.toString().padStart(2, "0") +
                ":" +
                minutes.toString().padStart(2, "0");
        }

        if (fromTimeFormate === "PM") {
            const fromTimeParts = fromTime.split(":");
            let hours = parseInt(fromTimeParts[0], 10);
            const minutes = parseInt(fromTimeParts[1], 10);
            hours = hours === 12 ? 12 : hours + 12;
            fromTime =
                hours.toString().padStart(2, "0") +
                ":" +
                minutes.toString().padStart(2, "0");
        }

        if (toTimeFormate === "PM") {
            const toTimeParts = toTime.split(":");
            let hours = parseInt(toTimeParts[0], 10);
            const minutes = parseInt(toTimeParts[1], 10);
            hours = hours === 12 ? 12 : hours + 12;
            toTime =
                hours.toString().padStart(2, "0") +
                ":" +
                minutes.toString().padStart(2, "0");
        }

        if (
            fromDate.trim() === "" ||
            fromTime.trim() === "" ||
            toDate.trim() === "" ||
            toTime.trim() === ""
        ) {
            console.error('Please select both "from" and "to" dates and times');

            const inputs = document.querySelectorAll(
                ".custom-date-picker input, .custom-time-input input"
            );
            inputs.forEach((input) => {
                input.style.borderColor = "red";
            });

            const iconDateFrom = document.getElementById("input-date-from");
            const iconDateTo = document.getElementById("input-date-to");
            const iconTimeFrom = document.getElementById("input-time-from");
            const iconTimeTo = document.getElementById("input-time-to");

            iconDateFrom.src = "./asssets/icon-error.png";
            iconDateFrom.alt = "error";
            iconDateTo.src = "./asssets/icon-error.png";
            iconDateTo.alt = "error";
            iconTimeFrom.src = "./asssets/icon-error.png";
            iconTimeFrom.alt = "error";
            iconTimeTo.src = "./asssets/icon-error.png";
            iconTimeTo.alt = "error";

            document.querySelector(".blockContent").style.display = "none";

            return res(true);
        }

        if (!isValidTime(fromTime) || !isValidTime(toTime)) {
            console.error("Invalid time format");
            return res(false);
        }

        const fromDateTimeString = `${fromDate} ${fromTime}:00`;
        const toDateTimeString = `${toDate} ${toTime}:00`;
        const fromDateTime = new Date(fromDateTimeString);
        const toDateTime = new Date(toDateTimeString);

        if (isNaN(fromDateTime.getTime()) || isNaN(toDateTime.getTime())) {
            console.error("Invalid date or time values");
            return res(false);
        }

        try {
            const events = await fetchCalendarEvents(fromDateTime, toDateTime);
            let { list, text } = analyzeAvailability(
                events,
                fromDateTime,
                toDateTime,
                fromTime,
                toTime
            );

            if (!text.length) {
                text = `${fromDateTimeString} to ${toDateTimeString}`;
            }

            document.getElementById("selectedTimeRange").innerText = text;
            document.getElementById("timeDifference").innerText = "";
            document.getElementById("timeDifference").appendChild(list);
            document.getElementById("resultBlock").style.display = "block";
            document.getElementById("tabs").classList.add("showTabs");
            document.getElementById("copyButton").src = "./asssets/icon-copy.png";
            document.getElementById("copyButton").alt = "icon-copy";

            document.querySelector(".blockContent").style.display = "flex";

            res(true);
        } catch (error) {
            console.error("Error fetching calendar events:", error);
            rej(error);
        }
    });
}

// Функция для сброса стилей ввода
function resetInputStyles() {
    const inputs = document.querySelectorAll(
        ".custom-date-picker input, .custom-time-input input"
    );
    inputs.forEach((input) => {
        input.style.borderColor = "";
    });

    const iconDateFrom = document.getElementById("input-date-from");
    const iconDateTo = document.getElementById("input-date-to");
    const iconTimeFrom = document.getElementById("input-time-from");
    const iconTimeTo = document.getElementById("input-time-to");

    iconDateFrom.src = "./asssets/icon-input.png";
    iconDateFrom.alt = "calendar";
    iconDateTo.src = "./asssets/icon-input.png";
    iconDateTo.alt = "calendar";
    iconTimeFrom.src = "./asssets/icon-input.png";
    iconTimeFrom.alt = "time";
    iconTimeTo.src = "./asssets/icon-input.png";
    iconTimeTo.alt = "time";
}

// Функция для проверки валидности времени
function isValidTime(timeString) {
    const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return regex.test(timeString);
}

const fetchCalendarEvents = async (startTime, endTime) => {
    try {
        const calendarIds = await findCalendarIds(localStorage.getItem('accessToken')); // Fetch all calendar IDs

        const currentYear = new Date().getFullYear();

        const formattedStartTime = new Date(
            currentYear,
            startTime.getMonth(),
            startTime.getDate(),
            0,
            0,
            0,
            0
        ).toISOString();

        const formattedEndTime = new Date(
            currentYear,
            endTime.getMonth(),
            endTime.getDate() + 1,
            0,
            0,
            0,
            0
        ).toISOString();

        const fetchPromises = calendarIds.map(async (calendarId) => {
            const apiUrl = `https://content.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
                calendarId
            )}/events?timeMin=${formattedStartTime}&timeMax=${formattedEndTime}&singleEvents=true`;

            const headers = {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                Accept: "application/json",
            };

            const response = await fetch(apiUrl, { headers });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error fetching calendar events:", errorData);
                throw new Error(
                    `Failed to fetch calendar events. Status: ${response.status}`
                );
            }

            const data = await response.json();
            const events = data.items || [];

            // Додай цей console.log, щоб побачити всі події для конкретного календаря
            console.log(`Events for calendar ID ${calendarId}:`, events);

            return events;
        });

        const allEvents = await Promise.all(fetchPromises);
        const mergedEvents = [].concat(...allEvents);

        // Додай цей console.log, щоб побачити всі об'єднані події з усіх календарів
        console.log('All merged events:', mergedEvents);

        return mergedEvents;
    } catch (error) {
        console.error("Error fetching calendar events:", error);
        return [];
    }
};

// Функция для поиска идентификаторов календарей
async function findCalendarIds(accessToken) {
    const endpoint =
        "https://www.googleapis.com/calendar/v3/users/me/calendarList";
    const headers = {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
    };

    try {
        const response = await fetch(endpoint, { headers: headers });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const calendarIds = data.items.map((item) => item.id);
        console.log('Fetched calendar IDs:', calendarIds);  // Логування ідентифікаторів календарів
        return calendarIds;
    } catch (error) {
        console.error("Error fetching calendar list:", error);
    }
}

// Функция для анализа доступности
function analyzeAvailability(events, startTime, endTime, fromTime, toTime) {
    events.sort((a, b) => new Date(a.start.dateTime) - new Date(b.start.dateTime));

    const freePeriods = [];

    let currentStart = new Date(startTime);
    let currentEnd = new Date(endTime);

    // Loop through each day in the range
    while (currentStart <= endTime) {
        let dayStart = new Date(currentStart);
        dayStart.setHours(parseInt(fromTime.split(":")[0]), parseInt(fromTime.split(":")[1]), 0, 0);
        let dayEnd = new Date(currentStart);
        dayEnd.setHours(parseInt(toTime.split(":")[0]), parseInt(toTime.split(":")[1]), 0, 0);

        // Add the daily free period
        freePeriods.push({
            start: new Date(dayStart),
            end: new Date(dayEnd)
        });

        // Move to the next day
        currentStart.setDate(currentStart.getDate() + 1);
    }

    for (let eventIndex = 0; eventIndex < events.length; eventIndex++) {
        const event = events[eventIndex];
        const eventStart = new Date(event.start.dateTime);
        const eventEnd = new Date(event.end.dateTime);

        for (let i = 0; i < freePeriods.length; i++) {
            const freePeriod = freePeriods[i];

            if (eventStart >= freePeriod.start && eventStart < freePeriod.end) {
                if (eventStart.getTime() !== freePeriod.start.getTime()) {
                    freePeriods.splice(i, 1, {
                        start: freePeriod.start,
                        end: eventStart
                    }, {
                        start: eventEnd,
                        end: freePeriod.end
                    });
                } else {
                    freePeriod.start = eventEnd;
                }
            } else if (eventStart <= freePeriod.start && eventEnd >= freePeriod.end) {
                freePeriods.splice(i, 1);
                i--;
            } else if (eventEnd > freePeriod.start && eventEnd <= freePeriod.end) {
                freePeriod.start = eventEnd;
            }
        }
    }

    const newDateRanges = splitAndFilterDateRanges(freePeriods);

    let divWrapper = '';

    const wrapper = document.createElement('div');
    wrapper.classList.add('wrapper')
    const dateFormatOptions = { day: '2-digit', month: '2-digit', hour12: true };
    const timeFormatOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
    let currentDate = '';
    for (const freePeriod of newDateRanges) {
        const date = freePeriod.start.toLocaleDateString('ua', dateFormatOptions); 
        const endWrapDate = freePeriod.end.toLocaleDateString('ua', dateFormatOptions);   
        const startTimeString = freePeriod.start.toLocaleTimeString('ua', timeFormatOptions);
        const endTimeString = freePeriod.end.toLocaleTimeString('ua', timeFormatOptions);

        const div = document.createElement('div');
        div.classList.add('flex-content')
        const dateBlock = document.createElement('div');
        dateBlock.classList.add('date-block')
        const timeBlock = document.createElement('div');
        timeBlock.classList.add('time-block')

        if (date !== currentDate) {
            const dtSpan = document.createElement('div');
            dtSpan.innerHTML = `${date}`;
            dateBlock.appendChild(dtSpan);
            if (currentDate !== '')
                divWrapper += `\n`;
            currentDate = date;
            divWrapper += `${date} `
        }

        const tmSpan = document.createElement('div');
        tmSpan.innerHTML = `${startTimeString} - ${endTimeString}`;
        timeBlock.appendChild(tmSpan);
        divWrapper += `${startTimeString} – ${endTimeString}`;
        divWrapper += `\n`
        
        div.appendChild(dateBlock);
        div.appendChild(timeBlock);
        wrapper.appendChild(div);
    }
    return { list: wrapper, text: divWrapper };
}

// Функция для разделения и фильтрации диапазонов дат
function splitAndFilterDateRanges(ranges) {
    let result = [];

    ranges.forEach(({ start, end }) => {
        const startDate = new Date(start);
        const endDate = new Date(end);

        const startAdjusted = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000);
        const endAdjusted = new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000);

        const startDateOnly = new Date(startAdjusted.getFullYear(), startAdjusted.getMonth(), startAdjusted.getDate());
        const endDateOnly = new Date(endAdjusted.getFullYear(), endAdjusted.getMonth(), endAdjusted.getDate());

        if (startDateOnly.getTime() === endDateOnly.getTime()) {
            result.push({ start, end });
        } else {
            result.push({ start, end: new Date(startAdjusted.getFullYear(), startAdjusted.getMonth(), startAdjusted.getDate(), 23, 59, 59, 999) });

            let currentDate = new Date(startAdjusted);
            currentDate.setDate(currentDate.getDate() + 1);

            while (currentDate < endDateOnly) {
                result.push({ start: new Date(currentDate), end: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59, 999) });
                currentDate.setDate(currentDate.getDate() + 1);
            }

            result.push({ start: new Date(endAdjusted.getFullYear(), endAdjusted.getMonth(), endAdjusted.getDate()), end });
        }
    });

    return result;
}

// Функция для отображения страниц
function showPage(pageId) {
    const pages = document.querySelectorAll('.container');
    pages.forEach(page => {
        page.style.display = 'none';
    });

    document.getElementById(pageId).style.display = 'block';
}

// Устанавливаем активную вкладку
function setActiveTab(tabId) {
    const tabs = document.querySelectorAll(".tab");
    tabs.forEach((tab) => {
        tab.classList.remove("active");
    });
    document.getElementById(tabId).classList.add("active");
}

// Отображаем контент вкладки
function showTab(tabId) {
    const tabContents = document.querySelectorAll(".tabContent");
    tabContents.forEach((content) => {
        content.style.display = "none";
    });

    document.getElementById(tabId).style.display = "block";

    if (tabId === "textInput") {
        document.getElementById("resultBlock").style.display = "none";
    } else if (tabId === "listOutput") {
        document.getElementById("resultBlock").style.display = "block";
        document.getElementById("selectedTimeRange").innerText = "";
    }
}

// Копирование текста и изменение изображения кнопки
function copyTextToClipboardAndChangeImage(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    document.getElementById("copyButton").src = "./asssets/checked.png";
    document.getElementById("copyButton").alt = "checked";
    console.log('Text copied and button image changed to "checked"');  // Логування зміни кнопки після копіювання
}
