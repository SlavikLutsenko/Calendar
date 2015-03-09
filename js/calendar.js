//function Calendar () {
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
		),
		inputsDate = document.querySelectorAll("input.calendar"),
		calendar = document.createElement("div"),
		show_calendar = document.createElement("div"),
		controls = document.createElement("div"),
		controls_date = document.createElement("div"),
		goToday = document.createElement("button"),
		today = new Date(),
		currentData = new Date(),
		selectDate = new Date(),
		inputDate = null,
		state = "days",
		number_showed = 0,
		table = null;

	function GetPositionElement(el) {
		var position = el.getBoundingClientRect();
		return {top: position.top, left: position.left}
	}

	function DateToString (date, style) {
		switch(style){
			case "words":
				return (date.getFullYear() != today.getFullYear() ? date.getFullYear() + " " : "") + months[date.getMonth()].name + " " + date.getDate();
				break;
			case "number":
				return (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + "." + (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "." + date.getFullYear();
				break;
			default:
				console.error("error format data");
				break;
		}
	}

	function StringToDate (string) {
		var els = string.split(".");
		if(els.length == 1)
			return new Date((string.split(" ").length == 2 ? today.getFullYear() + " " : "") + string);
		return new Date(els[1] + "." + els[0] + "." + els[2]);
	}

	function CreateCalendar(){
		var tempEl = document.createElement("div");
		tempEl.className = "button left";
		controls.appendChild(tempEl);
		controls_date.className = "button date";
		controls.appendChild(controls_date);
		tempEl = document.createElement("div");
		tempEl.className = "button right";
		controls.appendChild(tempEl);
		controls.className = "b-controls";
		calendar.appendChild(controls);
		show_calendar.className = "show_calendar";
		calendar.appendChild(show_calendar);
		goToday.className = "goToday";
		goToday.innerText = "Today";
		calendar.appendChild(goToday);
		calendar.className = "b-calendar";
		calendar.style.display = "none";
		document.body.appendChild(calendar);
	}

	function CreateWrapper (el) {
		var wrapper_input_calendar = document.createElement("span");
		wrapper_input_calendar.className = "wrapper_input_calendar";
		wrapper_input_calendar.innerHTML = el.outerHTML;
		var button_show_calendar = document.createElement("label");
		button_show_calendar.className = "button_show_calendar";
		wrapper_input_calendar.appendChild(button_show_calendar);
		el.parentNode.replaceChild(wrapper_input_calendar, el);
		el = wrapper_input_calendar.querySelector("input.calendar");
		el.value = months[selectDate.getMonth()].name + " " + selectDate.getDate();
		return button_show_calendar;
	}

	function ShowCalendar (el) {
		inputDate = el;
		var position = GetPositionElement(inputDate);
		inputDate.className += " select_calendar";
		calendar.style.top = position.top + 55 + "px";
		calendar.style.left = position.left + "px";
		calendar.style.display = "block";
		selectDate = StringToDate(inputDate.value);
		currentData = StringToDate(inputDate.value);
		number_showed = 0;
		ShowMonth(currentData);
	}

	function HideCalendar () {
		calendar.style.display = "none";
		if(table != null)
			show_calendar.removeChild(table);
		table = null;
		state = "days";
		if(inputDate != null)
			inputDate.className = inputDate.className.replace(/\s?select_calendar/, "");
	}

	function Transform (el, opacity, scale) {
		el.style.opacity = opacity;
		el.style.transform = "scale(" + scale + ")";
	}

	function CreateMonth (date) {
		var month = document.createElement("table");
		var tableRow, tableCell,
			name_days = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
		date = new Date(date);
		date.setDate(1);
		date.setDate(date.getDate() - (date.getDay() == 0 ? 7 : date.getDay()));
		tableRow = document.createElement("tr");
		for (var i = 0; i < name_days.length; i++) {
			tableCell = document.createElement("th");
			tableCell.innerText = name_days[i];
			tableRow.appendChild(tableCell);
		};
		tableRow.className += " name_days";
		month.appendChild(tableRow);
		for (var i = 0; i < 6; i++) {
			tableRow = document.createElement("tr");
			for (var j = 0; j < 7; j++) {
				tableCell = document.createElement("td");
				tableCell.innerText = date.getDate();
				tableCell.className = "day";
				if(date.getMonth() != currentData.getMonth()) 
					tableCell.className += " other_month " + (date.getTime() < currentData.getTime() ? "previous" : "next");
				if(date.toLocaleDateString() == today.toLocaleDateString()) 
					tableCell.className += " today";
				if(date.toLocaleDateString() == selectDate.toLocaleDateString())
					tableCell.className += " select";
				tableRow.appendChild(tableCell);
				date.setDate(date.getDate() + 1);
			};
			month.appendChild(tableRow);
		};
		month.className = "calendar";
		return month;
	}

	function ShowMonth (date, direction) {
		currentData = new Date(date);
		controls_date.innerText = months[date.getMonth()].name + " " + date.getFullYear();
		var newtable = CreateMonth(date);
		if(state != "days"){
			Transform(table, 0, 2);
			newtable.style.transform = "scale(0.5)";
			show_calendar.appendChild(newtable);
			setTimeout(function(){
				Transform(newtable, 1, 1);
			}, 10)
			setTimeout(function(){
				if(table != null)
					show_calendar.removeChild(table);
				table = newtable;
			}, 300);
		}else{
			if(number_showed == 0)
				number_showed++;
			else newtable.style.left = (direction == "right" ? 1 : -1)*100*number_showed++ + "%";
			show_calendar.appendChild(newtable);
			if(table != null){
				setTimeout(function () {
					newtable.style.left = "30px";
					table.style.left = (direction == "right" ? -1 : 1)*100 + "%";
				}, 10)
				setTimeout(function () {
					if(table != null)
						show_calendar.removeChild(table);
					table = newtable;
					if(number_showed != 1)
						number_showed--;
				}, 300)
			}else table = newtable;
		}
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

	function CreateMonths () {
		var months = [
			["Jan", "Feb", "Mar"],
			["Apr", "May", "Jun"],
			["Jul", "Aug", "Sep"],
			["Oct", "Nov", "Dec"]
		];
		var table_months = document.createElement("table");
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
				if(numberMonth == selectDate.getMonth())
					tableCell.className += " select";
				tableRow.appendChild(tableCell);
			};
			table_months.appendChild(tableRow);
		};
		table_months.className = "calendar";
		return table_months;
	}

	function ShowMonths (direction) {
		controls_date.innerText = currentData.getFullYear();
		var newtable = CreateMonths();
		if(state == "days"){
			Transform(table, 0, 0.5);
			newtable.style.transform = "scale(2)";
			show_calendar.appendChild(newtable);
			setTimeout(function(){
				Transform(newtable, 1, 1);
			}, 10)
			setTimeout(function(){
				if(table != null)
					show_calendar.removeChild(table);
				table = newtable;
			}, 300);
		}
		if(state == "years"){
			Transform(table, 0, 2);
			newtable.style.transform = "scale(0.5)";
			show_calendar.appendChild(newtable);
			setTimeout(function(){
				Transform(newtable, 1, 1);
			}, 10)
			setTimeout(function(){
				if(table != null)
					show_calendar.removeChild(table);
				table = newtable;
			}, 300);
		}
		state = "months";
	}

	function CreateYears (startYear, finishYear) {
		var years = document.createElement("table");
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
				if(i == selectDate.getFullYear())
					tableCell.className += " select";
				tableRow.appendChild(tableCell);
			};
			years.appendChild(tableRow);
		};
		years.className = "calendar";
		return years;
	}

	function ShowYears (startYear, finishYear, direction) {
		controls_date.innerText = startYear + " - " + finishYear;
		var newtable = CreateYears(startYear, finishYear);
		if(direction == "show"){
			Transform(table, 0, 0.5);
			newtable.style.transform = "scale(2)";
			show_calendar.appendChild(newtable);
			setTimeout(function(){
				Transform(newtable, 1, 1);
			}, 10)
			setTimeout(function(){
				if(table != null)
					show_calendar.removeChild(table);
				table = newtable;
				state = "years";
			}, 300);
		}else{
			if(number_showed == 0)
				number_showed++;
			else newtable.style.left = (direction == "right" ? 1 : -1)*100*number_showed++ + "%";
			show_calendar.appendChild(newtable);
			setTimeout(function () {
				newtable.style.left = "30px";
				table.style.left = (direction == "right" ? -1 : 1)*100 + "%";
			}, 10)
			setTimeout(function () {
				if(table != null)
					show_calendar.removeChild(table);
				table = newtable;
				if(number_showed != 1)
					number_showed--;
				state = "years";
			}, 300)
		}
	}

	function Move (direction) {
		switch(state){
			case "days":
				currentData.setMonth(currentData.getMonth() + (direction == "left" ? -1 : 1));
				ShowMonth(currentData, direction);
				break;
			case "months":
				currentData.setFullYear(currentData.getFullYear() + (direction == "left" ? -1 : 1));
				controls_date.innerText = currentData.getFullYear();
				break;
			case "years":
				var borders = controls_date.innerText.split(" - "),
					multiplier = (direction == "left" ? -1 : 1);
				ShowYears(Number(borders[0]) + 16*multiplier, Number(borders[1]) + 16*multiplier, direction);
				break;
		}
	}

	function MoveUp () {
		switch(state){
			case "days":
				ShowMonths();
				break;
			case "months":
				ShowYears(currentData.getFullYear() - 7, currentData.getFullYear() + 8, "show");
				break;
		}
	}

	function SelectElement (el) {
		if(el.tagName.toLowerCase() == "td" && el.className.search("day") != -1){
			if(el.className.search("other_month") != -1){
				currentData.setMonth(currentData.getMonth() + (el.className.search("previous") != -1 ? -1 : 1));
				selectDate = new Date(currentData.getFullYear() + " " + (currentData.getMonth() + 1) + " " + el.innerText);
				ShowMonth(currentData, (el.className.search("next") != -1 ? "right" : "left"));
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
	}

	function ChangeSelectDate (direction) {
		switch(direction){
			case "Up":
				switch(state){
					case "days":
						selectDate.setDate(selectDate.getDate() - 7);
						break;
					case "months":
						if(selectDate.getMonth() >= 3)
							selectDate.setMonth(selectDate.getMonth() - 3);
						break;
					case "years":
						selectDate.setFullYear(selectDate.getFullYear() - 4);
						break;
				}
				break;
			case "Down":
				switch(state){
					case "days":
						selectDate.setDate(selectDate.getDate() + 7);
						break;
					case "months":
						if(selectDate.getMonth() <= 8)
							selectDate.setMonth(selectDate.getMonth() + 3);
						break;
					case "years":
						selectDate.setFullYear(selectDate.getFullYear() + 4);
						break;
				}
				break;
			case "Left":
				switch(state){
					case "days":
						selectDate.setDate(selectDate.getDate() - 1);
						break;
					case "months":
						if(selectDate.getMonth() >= 1)
							selectDate.setMonth(selectDate.getMonth() - 1);
						break;
					case "years":
						selectDate.setFullYear(selectDate.getFullYear() - 1);
						break;
				}
				break;
			case "Right":
				switch(state){
					case "days":
						selectDate.setDate(selectDate.getDate() + 1);
						break;
					case "months":
						if(selectDate.getMonth() <= 10)
							selectDate.setMonth(selectDate.getMonth() + 1);
						break;
					case "years":
						selectDate.setFullYear(selectDate.getFullYear() + 1);
						break;
				}
				break;
		}
	}

	CreateCalendar();

	for (var i = 0; i < inputsDate.length; i++) {
		CreateWrapper(inputsDate[i]).addEventListener("click", function (e) {
			if(e.target.previousElementSibling.className.search("select_calendar") == -1){
				HideCalendar();
				ShowCalendar(e.target.previousElementSibling);
			}
			else
				HideCalendar();
		}, false);
	};

	inputsDate = document.querySelectorAll("input.calendar");

	document.body.addEventListener("click", function (e) {
		var el = e.target;
		while(el != document.body && el != calendar && el.className.search("select_calendar") == -1 && el.className.search("button_show_calendar") == -1)
			el = el.parentNode;
		if(el == document.body)
			HideCalendar();
	}, true);

	for (var i = 0; i < inputsDate.length; i++) {
		inputsDate[i].addEventListener("change", function () {
	        selectDate = new Date((inputDate.value.split(/\.|\s|\//).length == 3 ? "" : today.getFullYear() + " ") + inputDate.value);
	        if(calendar.style.display != "none"){
	        	if(selectDate.getMonth() != currentData.getMonth() || selectDate.getFullYear() != currentData.getFullYear()) 
		            ShowMonth(selectDate, (currentData.getFullYear() < selectDate.getFullYear() || currentData.getMonth() < selectDate.getMonth() ? "right" : "left"));
		        SelectDayByDate(selectDate);
	        }
	    }, false);

	    inputsDate[i].addEventListener("focus", function (e) {
	        var el = e.target;
	    	inputDate = el;
	    	selectDate = new Date((inputDate.value.split(/\.|\s|\//).length == 3 ? "" : today.getFullYear() + " ") + inputDate.value);
	        el.value = selectDate.toLocaleDateString();
	    }, false);

	    inputsDate[i].addEventListener("blur", function (e) {
	        var el = e.target,
	        	date = el.value.split(/\.|\s|\//);
	    	selectDate = new Date(date[1] + "." + date[0] + "." + date[2]);
	        el.value = (selectDate.getFullYear() != today.getFullYear() ? selectDate.getFullYear() + " " : "") + months[selectDate.getMonth()].name + " " + selectDate.getDate();
	    }, false);
	};

	for (var i = document.forms.length - 1; i >= 0; i--) {
		document.forms[i].addEventListener("submit", function (e) {
			var form = e.target,
				calendars = form.querySelectorAll("input.calendar");
			for (var i = 0; i < calendars.length; i++) {
				calendars[i].value = (new Date((calendars[i].value.split(/\.|\s|\//).length == 3 ? "" : today.getFullYear() + " ") + calendars[i].value)).toDateString();
			};
		}, false);
	};

	controls.addEventListener("click", function (e) {
		var el = e.target;
		if(el.className.search("left") != -1 || el.className.search("right") != -1)
			Move(el.className.search("left") != -1 ? "left" : "right");
		if(el.className.search("date") != -1)
			MoveUp();
	}, false);

	goToday.addEventListener("click", function(){
		var flag = currentData.getMonth() != today.getMonth() || currentData.getFullYear() != today.getFullYear();
		if(flag || state != "days")
			ShowMonth(new Date(), (currentData.getFullYear() < today.getFullYear() || currentData.getMonth() < today.getMonth() ? "right" : "left"));
		selectDate = new Date();
		if(flag || state != "days")
			setTimeout(function(){
				SelectDayByDate(selectDate);
			}, 300);
		else
			SelectDayByDate(selectDate);
	}, false);

	calendar.addEventListener("click", function (e) {
		SelectElement(e.target);
	}, false);

	document.body.addEventListener("keyup", function (e) {
		var el = e.target;
		if(e.keyCode == 27 && calendar.style.display != "none")
			HideCalendar();
		if(calendar.style.display != "none" && el.tagName.toLowerCase() != "input" && ((e.keyCode <= 40 && e.keyCode >= 37) || e.keyCode == 13)){
			if(e.altKey){
				switch(e.keyCode){
					case 39://right
						Move("right");
						break;
					case 37://left
						Move("left");
						break;
					case 38://up
						MoveUp();
						break;
					case 40://down
					case 13://enter
						if(state == "months" || state == "years")
							SelectElement(table.querySelector("td.select span"));
						break;
				}
			}else{
				if(e.keyCode == 13){
					if(state == "months" || state == "years")
						SelectElement(table.querySelector("td.select span"));
				}else{
					ChangeSelectDate(e.keyIdentifier);
					var selectEl = table.querySelector("td.select"),
						newSelectEl,
						parentEl = selectEl.parentNode;
					switch(e.keyCode){
						case 39://right
							if(parentEl.lastChild == selectEl){
								if(parentEl.nextElementSibling != null)
									newSelectEl = parentEl.nextElementSibling.firstChild;
								else
									if(state == "years")
										Move("right");
							}
							else 
								newSelectEl = selectEl.nextElementSibling;
							break;
						case 37://left
							if(parentEl.firstChild == selectEl){
								if(parentEl.previousElementSibling != null)
									newSelectEl = parentEl.previousElementSibling.lastChild;
								else
									if(state == "years")
										Move("left");
							}
							else 
								newSelectEl = selectEl.previousElementSibling;
							break;
						case 38://up
							var previousEl = parentEl.previousElementSibling,
								position = 0;
							if(previousEl != null && previousEl.className.search("name_days") == -1){
								for (var children = parentEl.childNodes; position < children.length; position++) {
									if(children[position] == selectEl)
										break;
								}
								newSelectEl = previousEl.childNodes[position];
							}/*else
								if(state == "days")
									selectDate.setDate(selectDate.getDate() - 7);*/
							break;
						case 40://down
							var nextEl = parentEl.nextElementSibling,
								position = 0;
							if(nextEl != null){
								for (var children = parentEl.childNodes; position < children.length; position++) {
									if(children[position] == selectEl)
										break;
								}
								newSelectEl = nextEl.childNodes[position];
							}/*else
								if(state == "days")
									selectDate.setDate(selectDate.getDate() + 7);*/
							break;
					}
					if(newSelectEl == null && state == "days"){
						ShowMonth(selectDate, (currentData.getTime() < selectDate.getTime() ? "right" : "left"));
						SelectDayByDate(selectDate);
					}
					else
						if(newSelectEl != null){
							newSelectEl.className += " select";
							selectEl.className = selectEl.className.replace("select","");
							if(state == "days")
								SelectElement(newSelectEl);
						}
				}
			}
		}
	})
/*}

window.addEventListener("load", function () {
	Calendar();
}, false);*/