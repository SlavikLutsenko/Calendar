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
    state = "days";

inputDate.value = months[selectDate.getMonth()].name + " " + selectDate.getDate();
    /*
inputDate.addEventListener("focus", function(){
	calendar.style.display = "block";
}, false);

inputDate.addEventListener("blur", function(){
	calendar.style.display = "none";
}, false);
*/
function ShowCalendarDay (days) {
    if(table != null)
        calendar.removeChild(table);
	table = document.createElement("table");
	var	tableRow, tableCell, 
        other_month = true,
        other_month_position = "previous";
	for (var i = 0; i < days.length; i++) {
		tableRow = document.createElement("tr");
		for (var j = 0; j < days[i].length; j++) {
			tableCell = document.createElement(i == 0 ? "th" : "td");
			tableCell.innerText = days[i][j];
			if(days[i][j] == 1) {
                other_month = !other_month;
                other_month_position = "next";
            }
            tableCell.className = "day";
			if(other_month && i != 0) tableCell.className += " other_month " + other_month_position;
            if(!other_month && days[i][j] == today.getDate() && today.getMonth() == currentData.getMonth() && today.getFullYear() == currentData.getFullYear()) 
                tableCell.className += " today";
            if(!other_month && days[i][j] == selectDate.getDate() && selectDate.getMonth() == currentData.getMonth() && selectDate.getFullYear() == currentData.getFullYear()) 
                tableCell.className += " select";
			tableRow.appendChild(tableCell);
		};
		table.appendChild(tableRow);
	};
	table.className = "calendar";
	calendar.insertBefore(table, calendar.lastElementChild);
}

function ShowMonth (date) {
    controls_date.innerText = months[date.getMonth()].name + " " + date.getFullYear();
    var days = new Array(7),
        date = new Date(months[date.getMonth()].name + " " + date.getFullYear());
    days[0] = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
    for (var i = 1; i < days.length; i++)
        days[i] = new Array(7);
    for (var i = 0, end = date.getDay() == 0 ? 7 : date.getDay(); i < end; i++)
        date.setDate(date.getDate() - 1);
    for (var i = 1; i < days.length; i++) {
        for (var j = 0; j < days[i].length; j++) {
            days[i][j] = date.getDate();
            date.setDate(date.getDate() + 1);
        };
    };
    ShowCalendarDay(days);
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