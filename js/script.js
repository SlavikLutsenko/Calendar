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
	inputDate = calendar.querySelector("input.today"),
	controls = calendar.querySelector(".calendar .b-controls"),
	table = calendar.querySelector("table");

inputDate.value = months[today.getMonth()].name + " " + today.getDate();
controls.querySelector(".date").innerText = months[today.getMonth()].name + " " + today.getFullYear();

function ShowCalendar (array) {
	var tableRow, tableCell;
	for (var i = 0; i < array.length; i++) {
		tableRow = document.createElement("tr")
		for (var j = 0; j < array[i].length; j++) {
			tableCell = document.createElement("td");
			tableCell.innerText = array[i][j];
			tableRow.appendChild(tableCell);
		};
		table.appendChild(tableRow);
	};
	
}

function ShowMonth (id_month, year) {
	var days = new Array(7),
		date,
		firstDate = (new Date(months[id_month].name + " " + year)).getDay();
	days[0] = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
	for (var i = 1; i < days.length; i++) {
		days[i] = new Array(7);
	};
	date = new Date((months[id_month - 1].day - (firstDate == 0 ? 6 : firstDate)) + " " + months[id_month - 1].name + " " + year);
	for (var i = 1; i < days.length; i++) {
		for (var j = 0; j < days[i].length; j++) {
			days[i][j] = date.getDate();
			date.setDate(date.getDate() + 1);
		};
	};
	ShowCalendar(days);
}

ShowMonth(today.getMonth(), today.getFullYear());