var months = new Array(
    {
        'name':'January',
        'day':31
    },{
        'name':'February',
        'day': !((new Date()).getFullYear()%2)? 29: 28
    },{
        'name':'March',
        'day':31
    },{
        'name':'April',
        'day':30
    },{
        'name':'May',
        'day':31
    },{
        'name':'June',
        'day':30
    },{
        'name':'July',
        'day':31
    },{
        'name':'August',
        'day':31
    },{
        'name':'September',
        'day':30
    },{
        'name':'October',
        'day':31
    },{
        'name':'November',
        'day':30
    },{
        'name':'December',
        'day':31
    }
);

var calendar = document.querySelector(".b-calendar"),
	today = new Date(),
    currentData = new Date(),
    selectDate = new Date(),
    table = null,
	inputDate = document.querySelector("input.calendar"),
	controls = calendar.querySelector(".b-controls"),
    controls_date = controls.querySelector(".date"),
    goToday = calendar.querySelector(".goToday"),
    state = "days",
    button_show_calendar = document.querySelector(".wrapper_input_calendar label");

inputDate.value = months[selectDate.getMonth()].name + " " + selectDate.getDate();

function ShowMonth (date) {
    controls_date.innerText = months[date.getMonth()].name + " " + date.getFullYear();
    if(table != null)
        calendar.removeChild(table);
    table = document.createElement("table");
    var tableRow, tableCell,
        name_days = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
    date = new Date(date);
    date.setDate(1);
    for (var i = 0, end = date.getDay() == 0 ? 7 : date.getDay(); i < end; i++)
        date.setDate(date.getDate() - 1);
    tableRow = document.createElement("tr");
    for (var i = 0; i < name_days.length; i++) {
        tableCell = document.createElement("th");
        tableCell.innerText = name_days[i];
        tableRow.appendChild(tableCell);
    };
    table.appendChild(tableRow);
    for (var i = 0; i < 6; i++) {
        tableRow = document.createElement("tr");
        for (var j = 0; j < 7; j++) {
            tableCell = document.createElement("td");
            tableCell.innerText = date.getDate();
            tableCell.className = "day";
            if(date.getMonth() != currentData.getMonth()) 
                tableCell.className += " other_month " + (date.getMonth() < currentData.getMonth() ? "previous" : "next");
            if(date.toLocaleDateString() == today.toLocaleDateString()) 
                tableCell.className += " today";
            if(date.toLocaleDateString() == selectDate.toLocaleDateString())
                tableCell.className += " select";
            tableRow.appendChild(tableCell);
            date.setDate(date.getDate() + 1);
        };
        table.appendChild(tableRow);
    };
    table.className = "calendar";
    calendar.insertBefore(table, calendar.lastElementChild);
    state = "days";
}

function SelectDayByElement (el) {
    var previousSelect = calendar.querySelector("td.select");
    if(previousSelect)
        previousSelect.className = previousSelect.className.replace(/\s?select/, "");
    el.className += " select";
    selectDate = new Date((currentData.getMonth() + 1) + "." + el.innerText + "." + currentData.getFullYear());
    inputDate.value = (selectDate.getFullYear() != today.getFullYear() ? selectDate.getFullYear() + " " : "") + months[selectDate.getMonth()].name + " " + selectDate.getDate();
}

function SelectDayByDate (date) {
    var days = table.querySelectorAll("td:not(.other_month)");
    for (var i = 0; i < days.length; i++)
        if(days[i].innerText == date.getDate()){
            SelectDayByElement(days[i]);
            break;
        }
}

function ShowMonths () {
    controls_date.innerText = currentData.getFullYear();
    var months = [
        ["Jan", "Feb", "Mar"],
        ["Apr", "May", "Jun"],
        ["Jul", "Aug", "Sep"],
        ["Oct", "Nov", "Dec"]
    ];
    if(table != null)
        calendar.removeChild(table);
    table = document.createElement("table");
    var tableRow, tableCell, el;
    for (var i = 0, numberMonth = 0; i < months.length; i++) {
        tableRow = document.createElement("tr");
        for (var j = 0; j < months[i].length; j++, numberMonth++) {
            tableCell = document.createElement("td");
            el = document.createElement("span");
            el.innerText = months[i][j];
            el.setAttribute("data-id_month", numberMonth);
            tableCell.appendChild(el);
            tableCell.className = "month";
            if(numberMonth == currentData.getMonth())
                tableCell.className += " select";
            tableRow.appendChild(tableCell);
        };
        table.appendChild(tableRow);
    };
    table.className = "calendar";
    calendar.insertBefore(table, calendar.lastElementChild);
    state = "months";
}

function ShowYears (startYear, finishYear) {
    controls_date.innerText = startYear + " - " + finishYear;
    if(table != null)
        calendar.removeChild(table);
    table = document.createElement("table");
    var tableRow, tableCell, el;
    for (var i = startYear, end = startYear + 4; i <= finishYear; end += 4) {
        tableRow = document.createElement("tr");
        for ( ; i < end ; i++) {
            tableCell = document.createElement("td");
            el = document.createElement("span");
            el.innerText = i;
            el.setAttribute("data-number_year_month", i);
            tableCell.appendChild(el);
            tableCell.className = "year";
            if(i == currentData.getFullYear())
                tableCell.className += " select";
            tableRow.appendChild(tableCell);
        };
        table.appendChild(tableRow);
    };
    table.className = "calendar";
    calendar.insertBefore(table, calendar.lastElementChild);
    state = "years";
}

ShowMonth(currentData);

controls.addEventListener("click", function (e) {
    var el = e.target;
    if(el.className.search("left") != -1 || el.className.search("right") != -1){
        switch(state){
            case "days":
                currentData.setMonth(currentData.getMonth() + (el.className.search("left") != -1 ? -1 : 1));
                ShowMonth(currentData);
                break;
            case "months":
                currentData.setFullYear(currentData.getFullYear() + (el.className.search("left") != -1 ? -1 : 1));
                controls_date.innerText = currentData.getFullYear();
                break;
            case "years":
                var borders = controls_date.innerText.split(" - "),
                    multiplier = el.className.search("left") != -1 ? -1 : 1;
                ShowYears(Number(borders[0]) + 16*multiplier, Number(borders[1]) + 16*multiplier);
                break;
        }
    }
    if(el.className.search("date") != -1){
        switch(state){
            case "days":
                ShowMonths();
                break;
            case "months":
                ShowYears(currentData.getFullYear() - 7, currentData.getFullYear() + 8);
                break;
        }
        
    }
}, false);

goToday.addEventListener("click", function(){
    selectDate = new Date();
    currentData = new Date();
    ShowMonth(currentData);
    SelectDayByDate(selectDate);
}, false);

calendar.addEventListener("click", function (e) {
    var el = e.target;
    if(el.tagName.toLowerCase() == "td" && el.className.search("day") != -1){
        if(el.className.search("other_month") != -1){
            currentData.setMonth(currentData.getMonth() + (el.className.search("previous") != -1 ? -1 : 1));
            selectDate = new Date(currentData.getFullYear() + " " + (currentData.getMonth() + 1) + " " + el.innerText);
            ShowMonth(currentData);
            SelectDayByDate(selectDate);
        }
        else SelectDayByElement(el);
    }
    if(el.tagName.toLowerCase() == "span" && el.getAttribute("data-id_month") != null){
        currentData.setMonth(el.getAttribute("data-id_month"));
        ShowMonth(currentData);
    }
    if(el.tagName.toLowerCase() == "span" && el.getAttribute("data-number_year_month") != null){
        currentData.setFullYear(el.getAttribute("data-number_year_month"));
        ShowMonths();
    }
}, false);

button_show_calendar.addEventListener("click", function () {
    calendar.style.display = "block";
}, false);

document.body.addEventListener("click", function (e) {
    var el = e.target;
    while(el != document.body && el != calendar && el != inputDate)
        el = el.parentNode;
    if(el == document.body)
        calendar.style.display = "none";
}, true);

inputDate.addEventListener("change", function () {
    selectDate = new Date((inputDate.value.split(" ").length == 3 ? "" : today.getFullYear() + " ") + inputDate.value);
    ShowMonth(selectDate);
    SelectDayByDate(selectDate);
}, false)