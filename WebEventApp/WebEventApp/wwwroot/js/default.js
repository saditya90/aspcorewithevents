'use strict';

function init() {
    cal.setCalendars(CalendarList);

    setRenderRangeText();
    generateDefaultSchedule();
}

function getDataAction(target) {
    return target.dataset ? target.dataset.action : target.getAttribute('data-action');
}

function setDropdownCalendarType() {
    var calendarTypeName = document.getElementById('calendarTypeName');
    var calendarTypeIcon = document.getElementById('calendarTypeIcon');
    var options = cal.getOptions();
    var type = cal.getViewName();
    var iconClassName;

    if (type === 'day') {
        type = 'Daily';
        iconClassName = 'calendar-icon ic_view_day';
    } else if (type === 'week') {
        type = 'Weekly';
        iconClassName = 'calendar-icon ic_view_week';
    } else if (options.month.visibleWeeksCount === 2) {
        type = '2 weeks';
        iconClassName = 'calendar-icon ic_view_week';
    } else if (options.month.visibleWeeksCount === 3) {
        type = '3 weeks';
        iconClassName = 'calendar-icon ic_view_week';
    } else {
        type = 'Monthly';
        iconClassName = 'calendar-icon ic_view_month';
    }

    calendarTypeName.innerHTML = type;
    calendarTypeIcon.className = iconClassName;
}

function onClickMenu(e) {
    var target = $(e.target).closest('a[role="menuitem"]')[0];
    var action = getDataAction(target);
    var options = cal.getOptions();
    var viewName = '';

    switch (action) {
        case 'toggle-daily':
            viewName = 'day';
            break;
        case 'toggle-weekly':
            viewName = 'week';
            break;
        case 'toggle-monthly':
            options.month.visibleWeeksCount = 0;
            viewName = 'month';
            break;
        case 'toggle-weeks2':
            options.month.visibleWeeksCount = 2;
            viewName = 'month';
            break;
        case 'toggle-weeks3':
            options.month.visibleWeeksCount = 3;
            viewName = 'month';
            break;
        case 'toggle-narrow-weekend':
            options.month.narrowWeekend = !options.month.narrowWeekend;
            options.week.narrowWeekend = !options.week.narrowWeekend;
            viewName = cal.getViewName();

            target.querySelector('input').checked = options.month.narrowWeekend;
            break;
        case 'toggle-start-day-1':
            options.month.startDayOfWeek = options.month.startDayOfWeek ? 0 : 1;
            options.week.startDayOfWeek = options.week.startDayOfWeek ? 0 : 1;
            viewName = cal.getViewName();

            target.querySelector('input').checked = options.month.startDayOfWeek;
            break;
        case 'toggle-workweek':
            options.month.workweek = !options.month.workweek;
            options.week.workweek = !options.week.workweek;
            viewName = cal.getViewName();

            target.querySelector('input').checked = !options.month.workweek;
            break;
        default:
            break;
    }

    cal.setOptions(options, true);
    cal.changeView(viewName, true);

    setDropdownCalendarType();
    setRenderRangeText();
    setSchedules();
}

function onClickNavi(e) {
    var action = getDataAction(e.target);
    document.getElementById('datetimepicker').value = '';
    document.getElementById('datetimepicker1').value = ''; 
    switch (action) {
        case 'move-prev':
            cal.prev();
            break;
        case 'move-next':
            cal.next();
            break;
        case 'move-today':
            cal.today();
            break;
        default:
            return;
    }

    setRenderRangeText();
    setSchedules();
}

function setRenderRangeText() {
    var renderRange = document.getElementById('renderRange'); 
    var html = [];
    html.push(moment(cal.getDate().getTime()).format('MMMM') + ' ' + moment(cal.getDate().getTime()).format('YYYY'));
    renderRange.innerHTML = html.join('');
}

function setSchedules() {
    cal.clear();
    generateSchedule(); 
}


function refreshScheduleVisibility() {
    var calendarElements = Array.prototype.slice.call(document.querySelectorAll('#calendarList input'));

    CalendarList.forEach(function (calendar) {
        cal.toggleSchedules(calendar.id, !calendar.checked, false);
    });

    cal.render(true);

    calendarElements.forEach(function (input) {
        var span = input.nextElementSibling;
        span.style.backgroundColor = input.checked ? span.style.borderColor : 'transparent';
    });
}

function setEventListener() {
    $('.dropdown-menu a[role="menuitem"]').on('click', onClickMenu);
    $('#menu-navi').on('click', onClickNavi);
}

cal.on({
    'clickTimezonesCollapseBtn': function (timezonesCollapsed) {
        if (timezonesCollapsed) {
            cal.setTheme({
                'week.daygridLeft.width': '77px',
                'week.timegridLeft.width': '77px'
            });
        } else {
            cal.setTheme({
                'week.daygridLeft.width': '60px',
                'week.timegridLeft.width': '60px'
            });
        }

        return true;
    }
});

$(document).ready(function () {
    setEventListener();
});