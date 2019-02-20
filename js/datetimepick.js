var jq_datetimepick = false;
$.fn.datetimepicker = function (options) {
    jq_datetimepick = true;
    return this.each(function () {
        var $this = $(this);
        if ($("#lq-datetimepick").length > 0) {
            $("#lq-datetimepick").remove();
        }
        // 配置项
        var _this = {
            css: "datetime-day", //datetime-hour 时分样式 ，datetime-day 日期样式
            offset: {
                left: 0,
                top: 10
            },
            now: new Date(),
            dateType: 'H', //H选择时分，D选择日期
            date: {
                'H': {
                    begin: '08:00', //开始时分
                    end: '23:30', //结束时分
                    step: "30" //时分步长
                },
                'D': {
                    month: new Date(), //日期默认时间
                    selected: (new Date()).getDate()
                },
                'M': {
                    begin: 1, //月份开始
                    end: 12, //月份结束
                    selected: (new Date()).getMonth() + 1  //月份初始
                },
                'Y': {
                    begin: 2001, //年份开始
                    // end: (new Date()).getFullYear(), //年份结束
                    end: 2099, //年份结束
                    selected: (new Date()).getFullYear() //年份初始
                }
            },
            selectback: function () { }, //选择时间的事件回调
            callback: function () { } //初始化时间事件回调
        };
        $.extend(_this, options);
        
        // 弹框整体部分
        var _obj = $("<div class=\"lq-datetimepick\" id=\"lq-datetimepick\" />");
        // 弹框箭头
        var _arr = $("<div class=\"datetime-arr\" />");
        // 弹框container部分
        var _container = $("<div class=\"select-datetime\" />");
        // 年、月 选择框部分
        var _selectitem = $("<div class=\"datetime-select\" />");
        // 星期几的部分
        var _header = $("<dl class=\"datetime-time\"></dl>");
        // 具体日期
        var _item = $("<dl class=\"datetime-time\"></dl>");

        var _day;

        var _dateValue = $this.val() == '' ? new Date() : new Date($this.val());
        var _dateYear = _dateValue.getFullYear();
        var _dateMonth = _dateValue.getMonth() + 1;
        var _dateDate = _dateValue.getDate();

        var _x = $this.offset().left + _this.offset.left,
            _y = $this.offset().top + $this.outerHeight() + _this.offset.top;

        if (_this.css != undefined || _this.css != '') {
            _header.addClass(_this.css);
            _item.addClass(_this.css);
        }

        if ($this.val() != '') {
            _this.date.D.month = new Date($this.val());
        }


        $.fn.datetimepicker.setDateData($this, _obj, _item, _this);

        //日期
        if (_this.dateType == 'D') {

            //年份
            var _select_year = $.fn.datetimepicker.setSelectData(_this, 'Y');
            var _selectul_year = $("<div class=\"selectul\" id=\"lqyear\" />");
            var _select_year_t = $("<div class=\"selectfocus\"></div>");
            if (_dateYear != '') _select_year_t.attr("data-value", _dateYear);
            _select_year_t.html("<em>选择年份</em>");
            _select_year_t.appendTo(_selectul_year);
            _select_year.appendTo(_selectul_year);
            _selectul_year.appendTo(_selectitem);
            _selectitem.appendTo(_container);


            //月份
            var _select_month = $.fn.datetimepicker.setSelectData(_this, 'M');
            var _selectul_month = $("<div class=\"selectul\" id=\"lqmonth\" />");
            var _select_month_t = $("<div class=\"selectfocus\"></div>");
            if (_dateMonth != '') {
                _select_month_t.attr("data-value", _dateMonth);
            }
            _select_month_t.html("<em>选择月份</em>");
            _select_month_t.appendTo(_selectul_month);
            _select_month.appendTo(_selectul_month);
            _selectul_month.appendTo(_selectitem);
            _selectitem.appendTo(_container);

            //星期
            _week = $.fn.datetimepicker.intWeek();
            for (var i = 0; i < 7; i++) {
                _day = $("<dt><span>" + _week[i] + "</span></dt>");
                _day.appendTo(_header);
            }
            _header.appendTo(_container);
        }

        _arr.appendTo(_obj);
        _container.appendTo(_obj);
        _item.appendTo(_container);
        _obj.appendTo("body").css({
            left: _x + 'px',
            top: _y + 'px'
        }).show();
        _this.callback();

        LQ.selectUi.show({
            id: "lqyear",
            hiddenInput: "selectYear",
            pulldown: function() {
                $.fn.datetimepicker.pullDown($this, _obj, _item, _this);
            }
        });
        LQ.selectUi.show({
            id: "lqmonth",
            hiddenInput: "selectMonth",
            pulldown: function() {
                $.fn.datetimepicker.pullDown($this, _obj, _item, _this);
            }
        });

        _obj.on("click", function (e) {
            e.stopPropagation();
        });

        $(document).on("click", function (e) {
            if (jq_datetimepick) {
                _obj.remove();
            }
        });

    });
};


$.fn.datetimepicker.pullDown = function($this, _obj, _item, _this) {
    var _year = $("#selectYear").val();
    var _month = $("#selectMonth").val();
    var _day = $(".datetime-time>dd.selected").attr("data-value");
    _day = _day == undefined ? _this.date.D.selected : _day;
    _this.date.D.month = new Date(_year + '-' + _month);
    $.fn.datetimepicker.setDateData($this, _obj, _item, _this);
};

$.fn.datetimepicker.setDateData = function ($this, _obj, _item, _this) {
    var _time;
    var _datetime = $.fn.datetimepicker.setDateTime(_this);
    if (typeof (_datetime) == 'object') {
        _item.empty();
        for (var i = 0; i < _datetime.length; i++) {
            _time = $("<dd data-value=" + _datetime[i] + "><em>" + _datetime[i] + "</em></dd>");
            if (_this.dateType == 'D') {
                _time.attr(
                    'data-value', 
                    `${_this.date.D.month.getFullYear()}-${$.fn.datetimepicker.n2s(_this.date.D.month.getMonth() + 1)}-${$.fn.datetimepicker.n2s(_time.attr('data-value'))}`
                )
            }
            _time.on("click", function () {
                if( $(this).hasClass("blank") ){
                    return;
                }
                $this.val($(this).attr("data-value"));
                _obj.remove();
                _this.selectback();
            });
            _time.hover(function () {
                $(this).addClass('over');
            }, function () {
                $(this).removeClass('over');
            });
            // 是否选中
            if ($this.val() == _datetime[i]) {
                _time.addClass('selected')
            }
            // 今天
            if ((_this.dateType == 'D') && (_this.now.getFullYear() == _this.date.D.month.getFullYear()) && (_this.now.getMonth() == _this.date.D.month.getMonth()) && (_this.now.getDate() == _datetime[i])) {
                _time.addClass('now');
            }
            // 已选择的日期
            if ((new Date($this.val()).getDate() == _datetime[i]) && (_this.dateType == 'D')) {
                _time.addClass('current');
            }
            if (_datetime[i] == '') {
                _time.addClass('blank');
            }
            _time.appendTo(_item);
        }
    }
};

$.fn.datetimepicker.setDateTime = function (_this) {
    var dateTime;
    if (_this.dateType == 'H') {
        dateTime = $.fn.datetimepicker.intHourTime(_this);
    } else if (_this.dateType == 'D') {
        dateTime = $.fn.datetimepicker.intDayTime(_this);
    }
    return dateTime;
};

$.fn.datetimepicker.setSelectData = function (_this, type) {
    var _data;
    var _cell;
    var _select = $("<select></select>");
    if (type == 'Y') {
        _data = $.fn.datetimepicker.intYearTime(_this);
        _cell = '年';
    }
    if (type == 'M') {
        _data = $.fn.datetimepicker.intMonthTime(_this);
        _cell = '月'
    }
    for (var i = 0; i < _data.length; i++) {
        $("<option></option>").text(_data[i] + _cell).attr("value", _data[i]).appendTo(_select);
    }
    return _select;
};

$.fn.datetimepicker.n2s = function(n) {
    return (n >= 10) ? (n.toString()) : ("0" + n.toString());
};
/*时分*/
$.fn.datetimepicker.intHourTime = function (_this) {
    var begindate = _this.date.H.begin;
    var enddate = _this.date.H.end;
    var stepdate = _this.date.H.step;
    var _a = [];
    var _date = new Date();
    var _now = _date.getFullYear() + "-" + (_date.getMonth() + 1) + "-" + _date.getDate();
    var _begindate = new Date(_now + " " + begindate);
    var _enddate = new Date(_now + " " + enddate);

    var _hours = _enddate.getHours() - _begindate.getHours();
    var _minutes = _enddate.getMinutes() - _begindate.getMinutes();
    var _len = (_hours * 60 + _minutes) / stepdate;

    for (var i = 0; i <= _len; i++) {
        var _t = $.fn.datetimepicker.dateAdd('M', stepdate * i, _begindate);
        _a.push($.fn.datetimepicker.n2s(_t.getHours()) + ":" + $.fn.datetimepicker.n2s(_t.getMinutes()));
    }
    return _a;
};

/*日期*/
$.fn.datetimepicker.intDayTime = function (_this) {
    var _a = [];
    var _date = _this.date.D.month;
    var _year = _date.getFullYear();
    var _month = _date.getMonth();
    var _week = new Date(_year + '-' + (_month + 1) + '-01').getDay(); // 当前月的第一天
    var _day = 32 - new Date(_year, _month, 32).getDate();
    var _cell = Math.ceil((_week + _day) / 7) * 7 - (_week + _day);

    for (var w = 0; w < _week; w++) {
        _a.push('');
    }
    for (var i = 0; i < _day; i++) {
        _a.push(i + 1);
    }
    for (var w = 0; w < _cell; w++) {
        _a.push('');
    }
    return _a;
};

/*月份*/
$.fn.datetimepicker.intMonthTime = function (_this) {
    var _a = [];
    var _month_begin = _this.date.M.begin;
    var _month_end = _this.date.M.end;
    for (var i = _month_begin, j = _month_end + 1; i < j; i++) {
        _a.push(i);
    }
    return _a;
}

/*年份*/
$.fn.datetimepicker.intYearTime = function (_this) {
    var _a = [];
    var _year_begin = _this.date.Y.begin;
    var _year_end = _this.date.Y.end;
    for (var i = _year_begin, j = _year_end + 1; i < j; i++) {
        _a.push(i);
    }
    return _a;
}

$.fn.datetimepicker.intWeek = function () {
    return ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
}

$.fn.datetimepicker.dateAdd = function (interval, NumDay, dtDate) {
    var dtTmp = new Date(dtDate);
    if (isNaN(dtTmp)) {
        dtTmp = new Date();
    }
    switch (interval.toUpperCase()) {
        case "S": return new Date(Date.parse(dtTmp) + (1000 * NumDay));
        case "M": return new Date(Date.parse(dtTmp) + (60000 * NumDay));
        case "H": return new Date(Date.parse(dtTmp) + (3600000 * NumDay));
        case "D": return new Date(Date.parse(dtTmp) + (86400000 * NumDay));
        case "W": return new Date(Date.parse(dtTmp) + ((86400000 * 7) * NumDay));
        case "M": return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + NumDay, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
        case "Y": return new Date((dtTmp.getFullYear() + NumDay), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
    }
};

