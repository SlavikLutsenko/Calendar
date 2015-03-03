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
    goToday = calendar.querySelector(".goToday");

selectDate.setDate(13);
inputDate.value = months[selectDate.getMonth()].name + " " + selectDate.getDate();
/*
inputDate.addEventListener("focus", function(){
	calendar.style.display = "block";
}, false);

inputDate.addEventListener("blur", function(){
	calendar.style.display = "none";
}, false);
*/
function ShowCalendar (array) {
    if(table != null)
        calendar.removeChild(table);
	table = document.createElement("table");
	var	tableRow, tableCell, flag = true;
	for (var i = 0; i < array.length; i++) {
		tableRow = document.createElement("tr");
		for (var j = 0; j < array[i].length; j++) {
			tableCell = document.createElement(i == 0 ? "th" : "td");
			tableCell.innerText = array[i][j];
			if(array[i][j] == 1) flag = !flag;
			if(flag && i != 0) tableCell.className = "other_month";
            if(today.toString() == currentData.toString() && array[i][j] == today.getDate() && !flag) 
                tableCell.className += " today";
            if(selectDate.getMonth() == currentData.getMonth() && selectDate.getFullYear() == currentData.getFullYear() && array[i][j] == selectDate.getDate() && !flag) 
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
    ShowCalendar(days);
}

ShowMonth(currentData);

controls.addEventListener("click", function (e) {
    var el = e.target;
    if(el.className.search("left") != -1){
        currentData.setMonth(currentData.getMonth() - 1);
        ShowMonth(currentData);
    }
    if(el.className.search("right") != -1){
        currentData.setMonth(currentData.getMonth() + 1);
        ShowMonth(currentData);
    }
}, false);

goToday.addEventListener("click", function(){
    selectDate = new Date();
    currentData = new Date();
    ShowMonth(currentData);
}, false);

calendar.addEventListener("click", function (e) {
    var el = e.target;
    if(el.tagName.toLowerCase() == "td"){
        var previousSelect = calendar.querySelector("td.select");
        if(previousSelect)
            previousSelect.className = previousSelect.className.replace("select", "");
        el.className += " select";
        selectDate.setDate(el.innerText);
        selectDate.setMonth(currentData.getMonth());
        selectDate.setFullYear(currentData.getFullYear());
        inputDate.value = months[selectDate.getMonth()].name + " " + selectDate.getDate();
    }
}, false);