function compileGLikeAgo(date)
{
    var
            secs = Math.floor((new Date() - date) / 1000),
            secs = secs + $.conf['difference_hours'] * 60 * 60;
    dateObj = {
        sec:    secs,
        min:     Math.floor(secs / 60),
        hour: Math.floor(secs / 60 / 60),
        day:    Math.floor(secs / 60 / 60 / 24),
        month:    Math.floor(secs / 60 / 60 / 24 / 30)
    }

    switch (true) {
        case !dateObj.min:
            return '1 мин';
            break;
        case !dateObj.hour:
            return dateObj.min + ' мин.';
            break;
        case !dateObj.day:
            return dateObj.hour + ' час.';
            break;
        case dateObj.day <= 5:
            return dateObj.day + ' дн.';
            break;
        default:
            return date.getDate() + ' ' + cortegeGetMonthName(date.getMonth()) + ' ' + date.getFullYear()
    }
}

(function ($)
{
    $.format = (function ()
    {

        var parseMonth = function (value)
        {

            switch (value) {
                case "Jan":
                    return "01";
                case "Feb":
                    return "02";
                case "Mar":
                    return "03";
                case "Apr":
                    return "04";
                case "May":
                    return "05";
                case "Jun":
                    return "06";
                case "Jul":
                    return "07";
                case "Aug":
                    return "08";
                case "Sep":
                    return "09";
                case "Oct":
                    return "10";
                case "Nov":
                    return "11";
                case "Dec":
                    return "12";
                default:
                    return value;
            }
        };

        var parseTime = function (value)
        {
            var retValue = value;
            if (retValue.indexOf(".") !== -1) {
                retValue = retValue.substring(0, retValue.indexOf("."));
            }

            var values3 = retValue.split(":");

            if (values3.length === 3) {
                hour = values3[0];
                minute = values3[1];
                second = values3[2];

                return {
                    time: retValue,
                    hour: hour,
                    minute: minute,
                    second: second
                };
            } else {
                return {
                    time: "",
                    hour: "",
                    minute: "",
                    second: ""
                };
            }
        };

        return {
            date: function (value, format)
            {
                //value = new java.util.Date()
                //2009-12-18 10:54:50.546
                try {
                    var year = null;
                    var month = null;
                    var dayOfMonth = null;
                    var time = null; //json, time, hour, minute, second
                    if (typeof value.getFullYear === "function") {
                        year = value.getFullYear();
                        month = value.getMonth() + 1;
                        dayOfMonth = value.getDate();
                        time = parseTime(value.toTimeString());
                    } else if (value.search(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.?\d{0,3}\+\d{2}:\d{2}/) != -1) { // 2009-04-19T16:11:05+02:00
                        var values = value.split(/[T\+-]/);

                        year = values[0];
                        month = values[1];
                        dayOfMonth = values[2];
                        time = parseTime(values[3].split(".")[0]);
                    } else {
                        var values = value.split(" ");

                        switch (values.length) {
                            case 6://Wed Jan 13 10:43:41 CET 2010
                                year = values[5];
                                month = parseMonth(values[1]);
                                dayOfMonth = values[2];
                                time = parseTime(values[3]);
                                break;
                            case 2://2009-12-18 10:54:50.546
                                var values2 = values[0].split("-");
                                year = values2[0];
                                month = values2[1];
                                dayOfMonth = values2[2];
                                time = parseTime(values[1]);
                                break;
                            default:
                                return value;
                        }
                    }

                    var pattern = "";
                    var retValue = "";
                    //Issue 1 - variable scope issue in format.date 
                    //Thanks jakemonO
                    for (var i = 0; i < format.length; i++) {
                        var currentPattern = format.charAt(i);
                        pattern += currentPattern;
                        switch (pattern) {
                            case "dd":
                                retValue += dayOfMonth;
                                pattern = "";
                                break;
                            case "MM":
                                retValue += month;
                                pattern = "";
                                break;
                            case "yyyy":
                                retValue += year;
                                pattern = "";
                                break;
                            case "HH":
                                retValue += time.hour;
                                pattern = "";
                                break;
                            case "hh":
                                retValue += (time.hour === 0 ? 12 : time.hour < 13 ? time.hour : time.hour - 12);
                                pattern = "";
                                break;
                            case "mm":
                                retValue += time.minute;
                                pattern = "";
                                break;
                            case "ss":
                                retValue += time.second;
                                pattern = "";
                                break;
                            case "a":
                                retValue += time.hour > 12 ? "PM" : "AM";
                                pattern = "";
                                break;
                            case " ":
                                retValue += currentPattern;
                                pattern = "";
                                break;
                            case "/":
                                retValue += currentPattern;
                                pattern = "";
                                break;
                            case ":":
                                retValue += currentPattern;
                                pattern = "";
                                break;
                            default:
                                if (pattern.length === 2 && pattern.indexOf("y") !== 0) {
                                    retValue += pattern.substring(0, 1);
                                    pattern = pattern.substring(1, 2);
                                } else if ((pattern.length === 3 && pattern.indexOf("yyy") === -1)) {
                                    pattern = "";
                                }
                        }
                    }
                    return retValue;
                } catch (e) {
                    //console.log(e);
                    return value;
                }
            }
        };
    }());
}(jQuery));
//пустая функция
var emptyFn = function()
{
}

//функция локализации месяца
function cortegeGetMonthName(n)
{
    r = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
    return r[n];
}
//Генерит строку со всеми параметрами 1 уровня объекта 
function cortegeRenderThreadConfPrintString(t, br)
{
    br = typeof(br) === 'undefined' ? '\n' : br;
    var result = '';
    for (var key in t._config) {
        result += key + ':\t' + t._config[key] + br + br;
    }
    return result;
}
//Функция служит для добавления эвентов, благодаря ей из тела эвента доступен сам объект {@link #_this} 
//т.е. this указывает на объек {@link #_this} 
function cortegeProxyBind(_this, events)
{
    if (typeof(_this) !== 'object' || typeof(events) !== 'object') return false;
    proxyEvents = {};
    for (var key in events) {
        _this['_eventFunction_' + key] = events[key];
        proxyEvents[key] = $.proxy(_this, '_eventFunction_' + key)
    }
    _this.bind(proxyEvents);
}

/**
 * @class messageTagFactory
 * Это класс фабрика для управления массивом меток
 * <p>Пример:</p>
 <pre><code>
 new messageTagFactory([
 new threadMark({
 text: 'Some text',
 css: 'black',
 style: 'border: 1px solid #F00;'
 }, {
 ...
 }, {
 text: 'Some text',
 css: 'black',
 style: 'border: 1px solid #F00;'
 }
 ]);
 </code></pre>
 * @constructor
 * Создать новый объект.
 * @param {array} _config массив объектов настроек и messageTag.
 * @return {messageTagFactory} возвращает объект
 */
var messageTagFactory = function(_config)
{
    typeof(_config) === 'undefined' ? _config = [] : '';
    _this = this;
    var _html;
    this.mtf_items = [];
    function init()
    {
        $.each(_config, function()
        {
            this.jquery ?
                    _this.mtf_items.push(this) :
                    this.text = this.name
            this.css = 'css-id-' + this.tag_id
            _this.mtf_items.push(new messageTag(this));
        });
        _this.mtf_render();
    }

    $.extend(this, {
        /**
         * возвращает jQuery блок со всеми тегами.
         * @return {jQuery}
         */
        mtf_HTML:function()
        {
            return _html
        },
        /**
         * Собирает по настройкам и возвращает jQuery блок с тегами.
         * @return {jQuery}
         */
        mtf_render: function()
        {
            _html = $('<span class="tag-cloud"></span>');
            $.each(this.mtf_items, function()
            {
                _html.append(this);
            });
            return _html;
        },
        /**
         * добавляет один элемент на основе объекта настроек или готового элемента {@link messageTag}
         * @param {messageTag} t объект настроек или созданный элемент
         * @return {messageTag} возвращает {@link messageTag}
         */
        mtf_addTag:function(t)
        {
            result = !t.jquery ? new messageTag(t) : t;
            this.mtf_items.push(result)
            _html.append(this.mtf_items[this.mtf_items.length - 1]);
            return result;
        },
        /**
         * удаляет элемент по параметру, который моржет принимать
         * следующие значения:номер элемента, текст метки (удалит все с такой меткой), имя класса отображения (удалит все с таким классом)
         * @param {Object} t
         */
        mtf_delTag:function(t)
        {
            if (typeof(t) === 'number') {
                try {
                    this.mtf_items[0].remove();
                    this.mtf_items.splice(t, 1);
                } catch (e) {
                }
            } else {
                sIt = this.mtf_findTag(t);
                $.each(sIt, function()
                {
                    var deletingItem = this;
                    _this.mtf_items = $.grep(_this.mtf_items, function(value)
                    {
                        return value != deletingItem;
                    });
                    deletingItem.remove();
                })

            }
        },
        /**
         * ищет элемент по параметру, который может принимать
         * следующие значения:текст метки,имя класса отображения
         * @param {Object} f
         * @return {array} массив найденных объектов {@link messageTag}
         */
        mtf_findTag:function(f)
        {
            var result = [];
            f === '' ? f = 'noCSS' : '';
            $.each(this.mtf_items, function()
            {
                if (this._config.css == f || this._config.text == f) {
                    result.push(this);
                }
            });
            return result;
        }
    });
    init();
    return this;
}

/**
 * @class messageTag
 * <p>Класс Message_Tag служит для отображения меток:</p>
 * <p>«nodownload»</p>
 * <p>«refund?»</p>
 * <p>и остальных.</p>
 * Следует отметить, что свойства noassign, а так же
 * приоритет отображаются в виде метки, но не присутствуют
 * в массиве tags, хотя прорисовываются при помощи класса Message_Tag.
 * Они всегда идут первыми в очереди (подробнее смотреть в
 * «очередь отображения»).
 * <p>Пример:</p>
 <pre><code>
 new threadMark({
 text: 'Some text',
 css: 'black',
 style: 'border: 1px solid #F00;',
 listeners:{
 'click':function(){
 ...
 }
 }
 });
 </code></pre>
 * @constructor
 * Создать новый объект.
 * @param {Object} _config объект настроек
 * @return {messageTag} возвращает объект
 */
var messageTag = function(_config)
{
    //console.log(_config)
    var _this = this;
    /**
     * конфиг
     */
    this._config = {
        /**
         * @cfg {String} text текст тэга
         */
        text:    'def val',
        /**
         * @cfg {String} css имя CSS класса для отображения
         */
        css:    'noCSS',
        /**
         * @cfg {String} style строка стиля для отображения
         */
        style:    '',
        /**
         * @cfg {Object} listeners объект эвентов c синтаксисом как у <a target="_blank" href="http://api.jquery.com/bind/">bind()</a>
         * <pre><code>
         listeners:{
         'click':function(){
         ...
         },
         'blur':function(){
         ...
         }
         }</code></pre>
         */
        listeners:{}
    };
    function _init()
    {
        _this.mtRender();
        cortegeProxyBind(_this, _this._config.listeners);
    }

    // спариваем дефолтный и переданный конфиг
    $.extend(this._config, _config);

    $.extend(this, {
        /**
         * Создает тэг по настройкам
         * @return {jQuery}
         */
        mtRender: function()
        {
            //<div class="iconStatButton"><nobr>ho</nobr></div>
            _html = $.extend(this,
                    $('<div class="tag"></div>').
                            append(
                            $('<nobr></nobr>')
                                    .html(this._config.text)
                                    .attr('style', this._config.style)
                    ).addClass(this._config.css)
            );
            this._title = _html.find('nobr');
            return _html;
        },
        /**
         * текст метки (если не передавать параметр вернет текущее значение иначе возвращает установленное)
         * @param {String} v значение параметра
         * @return {String} текущее значение
         */
        mtText:function(v)
        {
            //console.log('mtText %s', v)
            if (typeof(v) !== 'undefined') {
                this._config.text = v;
                this._title.html(v);
            }
            return this._config.text;
        },
        /**
         * CSS класс отображения метки (если не передавать параметр вернет текущее значение иначе возвращает установленное)
         * @param {String} v значение параметра
         * @return {String} текущее значение
         */
        mtCss:function(v)
        {
            if (typeof(v) !== 'undefined') {
                this.removeClass(this._config.css);
                this._config.css = v;
                this.addClass(v);
            }
            return this._config.css;
        },
        /**
         * CSS стиль отображения метки (если не передавать параметр вернет текущее значение иначе возвращает установленное)
         * @param {String} v значение параметра
         * @return {String} текущее значение
         */
        mtStyle:function(v)
        {
            if (typeof(v) !== 'undefined') {
                this._config.style = v;
                this._title.attr('style', v);
            }
            return this._config.style;
        }
    });
    _init();
    return this;
}

/**
 * @class threadMark
 * Класс Thread_Mark служит для отображения маркировки
 * Thread, которая отображается по умолчанию звёздочками
 * разного цвета (хотя это не обязательно).
 * <p>Пример:</p>
 <pre><code>
 new threadMark({
 text: 'Some text',
 type: 'star',
 css: 'black',
 style: 'border: 1px solid #F00;',
 listeners:{
 'click':function(){
 ...
 }
 }
 });
 </code></pre>
 * @constructor
 * Создать новый объект.
 * @param {Object} _config объект настроек*
 */
var threadMark = function(_config)
{
    var _this = this;
    /**
     * конфиг
     */
    this._config = {
        /**
         * @cfg {String} text Хинт который появляется при наведение
         */
        text:    '',
        /**
         * @cfg {String} type (по умолчанию star) тип-класс CSS отображения thread-mark-
         */
        type:    'star',
        /**
         * @cfg {String} css (по умолчанию black) класс являющийся подклассом type
         * (на данный момент принимат три значения: black, grey, yellow)
         */
        css:    'black',
        /**
         * @cfg {String} style строка стиля
         */
        style:    '',
        /**
         * @cfg {Object} listeners объект эвентов c синтаксисом как у <a target="_blank" href="http://api.jquery.com/bind/">bind()</a>
         * <pre><code>
         listeners:{
         'click':function(){
         ...
         },
         'blur':function(){
         ...
         }
         }</code></pre>
         */
        listeners:{}
    };
    // инициализация
    function _init()
    {
        _this.tmRender();
        cortegeProxyBind(_this, _this._config.listeners);
    }

    // спариваем дефолтный и переданный конфиг
    $.extend(this._config, _config);

    $.extend(this, {
        /**
         * Создает элемент маркировки по настройкам
         * @return {jQuery}
         */
        tmRender: function()
        {
            //<div class="cell thread-mark-star"><a href="#" class="gray"></a></div>

            var mark = $('<td class=""></td>')
                    .addClass('thread-mark-' + this._config.type)
                    .attr('style', this._config.style)
                        .append(
                        (this.markImageBody = $('<p class="star-p"></p>'))
                                .addClass(this._config.css)
                                .addClass(this._config.css)
                                .attr('title', this._config.text))
            $.extend(this, mark);

            //фикса для оперы
            //.css('padding-top', $.browser.opera?'10px':'0px')

            return this;
        },
        /**
         * текст примечание маркировки (если не передавать параметр вернет текущее значение иначе возвращает установленное)
         * @param {String} v значение параметра
         * @return {String} текущее значение
         */
        tmText:function(v)
        {
            if (typeof(v) !== 'undefined') {
                this._config.text = v;
                this.markImageBody.attr('title', v);
            }
            return this._config.text;
        },
        /**
         * тип маркировки (на данный момент всегда «star»).
         * Тип влияет на выбор основного CSS класса,
         * название которого пишется как: «.thread_mark_[type]».
         * (если не передавать параметр вернет текущее значение иначе возвращает установленное)
         * @param {Object} v значение параметра
         * @return {String} текущее значение
         */
        tmType:function(v)
        {
            if (typeof(v) !== 'undefined') {
                this.removeClass(this._config.type);
                this._config.type = v;
                this.addClass('thread-mark-' + v);
            }
            return this._config.type;
        },
        /**
         * дополнительный css класс для отображения
         * (если не передавать параметр вернет текущее значение иначе возвращает установленное)
         * @param {Object} v значение параметра
         * @return {String} текущее значение
         */
        tmCss:function(v)
        {
            if (typeof(v) !== 'undefined') {
                this._config.css = v;
                this.markImageBody.attr('class', v);
            }
            return this._config.css;
        },
        /**
         * дополнительный стиль для отображения (если не передавать параметр вернет текущее значение иначе возвращает установленное)
         * @param {Object} v значение параметра
         * @return {String} текущее значение
         */
        tmStyle:function(v)
        {
            if (typeof(v) !== 'undefined') {
                this._config.style = v;
                this.markImageBody.attr('style', v);
            }
            return this._config.style;
        }
    });
    _init();
    return this;
}

/**
 * @class cortegeThreadsElement
 * управляет внешним видом строки, описывающей основные свойства Thread
 * Массив метток передается параметром tags в виде готового объекта так и  массива
 * объектов настроек допускается как объект настроек для компиляции так и
 * скомпилированный объект, после создания элемента изменения в этом
 * параметре не приведут ни к камим изменениям - для работы с тегами
 * используйте {@link #tagsFactory}
 * <p>Пример:</p>
 <pre><code>
 new cortegeThreadsElement({
 title:'JS object title',
 digest:'Make by JS conf object',
 date: '10/10/10',
 count:777,
 isview: false,
 noassign: true,
 priority: 2,
 mark:{
 text:'message number odin',
 css:'gray'
 },
 tags:[{
 text:'<(overtags)>',
 css:'owerdownload'
 },
 ...
 {
 text:'<(overtags)>',
 css:'owerdownload'
 }]
 })
 </code></pre>
 * @constructor
 * Создать новый объект.
 * @param {Object} _config объект настроек
 */
var cortegeThreadsElement = function(_config)
{
    var _this = this;
    /**
     * Объек фабрики тэгов {@link messageTag}
     */
    this.tagsFactory = {};

    //функция фикса для полей с затемнением
    function fixByWbr(s)
    {
        //r='';
        //for(i=0; i<s.length;i++){r+=s[i]+'<wbr/>';}
        //return r;
        return s;
    }

    //функция фикса для поля дайджест (советую не врубать если много элементов)
    this.digest_width_fix = function()
    {
        this._bodyList.digest.style.width = (this._bodyList.digest.parentNode.offsetWidth + 100) + 'px';
        //this._bodyList.digest.offsetWidth;
    }
    //функция инициализации элемента.
    function _init()
    {
        //$(window).resize($.proxy(_this,'digest_width_fix'));
        _this.tagsFactory =
                $.isArray(_this._config.tags) ?
                        new messageTagFactory(_this._config.tags) :
                        _this._config.tags;
        _this.priorityFactory = new messageTagFactory();
        _this.assignFactory = new messageTagFactory();
        _this.cteRender();
        //дорисовываем
        _this.cteSelect(_this._config.select);
        _this.cteLocked(_this._config.locked);
        _this.cteNoassign(_this._config.noassign);
        _this.cteIsanswer(_this._config.isanswer);
        _this.ctePriority(_this._config.priority);
        _this.cteFrom(_this._config.from);
        _this.cteTitle(_this._config.title);
        _this.cteDigest(_this._config.digest);
        _this.cteCount(_this._config.count);
        _this.cteDate(_this._config.date);
        cortegeProxyBind(_this, _this._config.listeners);
    }

    /**
     * конфиг
     */
    this._config = {
        /**
         * @event click вызывается при клике на строку
         */
        onClick:emptyFn,
        /**
         * @event checkboxClick вызывается при клике на чекбокс
         */
        checkboxClick:emptyFn,
        /**
         * @event markClick вызывается при клике на звездочку
         */
        markClick:emptyFn,
        /**
         * @event afterInit вызывается после инициализации объекта
         */
        afterInit:emptyFn,
        /**
         * @cfg {Object} thread_id (по умолчанию 0) идентификатор треда (определяется сервером)
         */
        thread_id:0,
        /**
         * @cfg {boolean} select (по умолчанию false) выбор элемента (контрол checkbox)
         */
        select:false,
        /**
         * @cfg {Object} mark (по умолчанию null) пометка может быть как объектом настроек так и самим объектом {@link threadMark}
         */
        mark:null,
        /**
         * @cfg {boolean} locked (по умолчанию fasle) флаг блокировки, если он равен true, свойство highlight использует светлосерый цвет, и вся линия отображается CSS классом .thread_locked
         */
        locked:false,
        /**
         * @cfg {Object} locked_user (по умолчанию 'none user') указывает кто сейчас работает с тредом.
         */
        locked_user:'none user',
        /**
         * @cfg {boolean} isview (по умолчанию false) флаг, который равен true, если сообщение просмотрено.
         */
        isview:false,
        /**
         * @cfg {boolean} isanswer (по умолчанию false) флаг, если сообщение обработано.
         */
        isanswer:false,
        /**
         * @cfg {boolean} noassign (по умолчанию false) если сообщение не ассигновано.
         */
        noassign:false,
        /**
         * @cfg {number} priority (по умолчанию 0) приоритет сообщения (число от 0 до 3).
         */
        priority:0,
        /**
         * @cfg {String} from (по умолчанию 'none from') от кого сообщение.
         */
        from:'none from',
        /**
         * @cfg {Object} tags (по умолчанию []) массив меток, может быть как объект настроек так и готовым объектом {@link messageTag}
         */
        tags:[],
        /**
         * @cfg {String} title (по умолчанию 'none title') тема сообщения.
         */
        title:'none title',
        /**
         * @cfg {String} digest (по умолчанию 'none digest') дайджест сообщения.
         */
        digest:'none digest',
        /**
         * @cfg {Object} date (по умолчанию new Date()) дата сообщения может быть как строкой типа yy-mm-dd hh:mm:ss так и объектом Date.
         */
        date: new Date(),
        /**
         * @cfg {number} count (по умолчанию 0) количество сообщений в треде.
         */
        count:0,
        /**
         * @cfg {String} highlight (по умолчанию '') CSS класс треда.
         */
        highlight: '',
        /**
         * @cfg {Object} listeners объект эвентов c синтаксисом как у <a target="_blank" href="http://api.jquery.com/bind/">bind()</a>
         * <pre><code>
         listeners:{
         'click':function(){
         ...
         },
         'blur':function(){
         ...
         }
         }</code></pre>
         */
        listeners:{}
    }
    // спариваем дефолтный и переданный конфиг
    $.extend(this._config, _config);
    var markClickFlag, checkboxClickFlag;
    this.markClick = function(e)
    {
        markClickFlag = true;
        this._config.markClick(e);
    }
    this.checkboxClick = function(e)
    {
        checkboxClickFlag = true;
        this._config.checkboxClick(e);
    }
    this.onClick = function(e)
    {
        if (markClickFlag) {
            markClickFlag = false;
            return;
        }
        if (checkboxClickFlag) {
            checkboxClickFlag = false;
            return;
        }
        this._config.onClick(e);
    }
    $.extend(this, {
        /**
         * отрисовка и создание всех элементов треда
         * @return {cortegeThreadsElement} возвращает отрендерин класс
         */
        cteRender:function()
        {
            // создаем главный DIV контейнер
            _html = $('<tr></tr>');
            _html.addClass(this._config.highlight);

            this._config.locked ? _html.addClass('thread_locked') : ''
            this._config.isview ? _html.addClass('notview') : ''

            // добавляем checkbox
            var _checkbox
            _html.append(
                    $('<td class="checkbox"></td>').append(
                            (_checkbox = $('<input type="checkbox" class="checkbox-input"/>')).removeAttr("checked")
                                    .change(function ()
                                    {
                                        _this._config.select = this.checked;
                                    })
                                    .click($.proxy(this, 'checkboxClick'))
                    )
            );

            // добавляем звездочку на основе threadMark
            _html.append(this.mark = new threadMark(this._config.mark).click($.proxy(this, 'markClick')));

            // добавляем от кого
            var _from
            _html.append(_from = $('<td class="from"></td>'));

            // добавляем заголовок
            var _title
            //_html.append(_title = $('<td class="title"></td>'));

            // создаем головной блок сообщения
            // Если сообщение является не обработанным выделяем фон серым цветом, если обработано белым
            if (this._config['state_processing'] != 'answered') {
                var style_digest = "background-color:#F5F5F5;"
                var _digest = $('<span class="digest" style="font-weight:bold;"></span>');
            }
            else {
                var style_digest = "background-color:#FFFFFF;"
                var _digest = $('<span class="digest"></span>')
            }

            // поле для стат иконок и заполняем его на основе priorityFactory
            var _digest
            _html.append(
                    _tags_digest = $('<td class="tags-dayjest"></td>').append(
                            $('<div class="tags-inner">').append(
                                    $('<div class="tin-layer">').append(
                                            this.priorityFactory.mtf_HTML(),
                                            this.assignFactory.mtf_HTML(),
                                            this.tagsFactory.mtf_HTML(),
                                            _title = $('<span class="title"></span>'),
                                            _digest = $('<span class="dayjest"></span>')
                                    )
                            )
                    )
            )

            //количество
            var _count
            _html.append(_count = $('<td class="count">COUNT</td>'));
            //дата
            var _date
            _html.append(_date = $('<td class="date">DATE</td>'));

            //вливаем объект jQuery в наш класс
            $.extend(this, _html);

            /**
             * объект со ссылками на части-объекты треда
             */
            this._bodyList = {
                mainDiv:         this,
                checkbox:         _checkbox,
                from:             _from,
                title:             _title,
                tags_digest : _tags_digest,
                digest:         _digest,
                date:              _date,
                count:             _count
            };
            return this;
        },
        /**
         * устанавливает идентификатор треда
         * (определяется сервером)(если не передавать параметр вернет текущее значение иначе возвращает установленное)
         * @param {Object} v присваиваемое значение.
         * @return {Object} текущее значение
         */
        cteThread_id: function(v)
        {
            v ? this._config.thread_id = v : ''
            return this._config.thread_id;
        },
        /**
         * устанавливает выбран ли тред(контрол checkbox)
         * (если не передавать параметр вернет текущее значение иначе возвращает установленное)
         * @param {boolean} v присваиваемое значение.
         * @return {boolean} текущее значение
         */
        cteSelect: function(v)
        {
            this._config.locked ? v = false : '';
            if (typeof(v) === 'boolean') {
                this._config.select = v;
                v ? this._bodyList.checkbox.attr("checked", "checked") :
                        this._bodyList.checkbox.removeAttr("checked");
            }
            return this._config.select;

        },
        /**
         * read-only пометка (объект класса {@link threadMark})
         * @return {threadMark} текущее значение
         */
        cteMark: function()
        {
            return this.mark;
        },
        /**
         * устанавливает флаг блокировки, если он равен true, свойство
         * highlight использует светлосерый цвет, и вся
         * линия отображается CSS классом .thread_locked
         * (если не передавать параметр вернет текущее значение иначе возвращает установленное)
         * @param {boolean} v присваиваемое значение.
         * @return {boolean} текущее значение
         */
        cteLocked: function(v)
        {
            if (typeof(v) === 'boolean') {
                if (v) {
                    this.cteSelect(false);
                    this.find('input').attr('disabled', 'disabled');
                    this.addClass('thread_locked');
                } else {
                    this.find('input').removeAttr('disabled');
                    this.removeClass('thread_locked');
                }
                this._config.locked = v;
            }
            return this._config.locked;
        },
        /**
         * указывает кто сейчас работает с тредом
         * (если не передавать параметр вернет текущее значение иначе возвращает установленное)
         * @param {Object} v присваиваемое значение.
         * @return {Object} текущее значение
         */
        cteLocked_user: function(v)
        {
            typeof(v) !== 'undefined' ? this._config.locked_user = v : '';
            return this._config.locked_user;
        },
        /**
         * устанавливает флаг, который равен true, если сообщение просмотрено
         * (если не передавать параметр вернет текущее значение иначе возвращает установленное)
         * @param {boolean} v присваиваемое значение.
         * @return {boolean} текущее значение
         */
        cteIsview: function(v)
        {
            if (typeof(v) === 'boolean') {
                this._config.isview = v;
                this._config.isview ?
                        this.removeClass('notview') :
                        this.addClass('notview');
            }
            return this._config.isview;
        },
        /**
         * устанавливает флаг, если сообщение обработано.
         * (если не передавать параметр вернет текущее значение иначе возвращает установленное)
         * @param {boolean} v присваиваемое значение.
         * @return {boolean} текущее значение
         */
        cteIsanswer: function(v)
        {
            if (typeof(v) === 'boolean') {
                this._config.isanswer = v;
                this._config.isanswer ?
                        this.addClass('noanswer') :
                        this.removeClass('noanswer');
            }
            return this._config.isanswer;
        },
        /**
         * устанавливает если сообщение не ассигновано
         * (если не передавать параметр вернет текущее значение иначе возвращает установленное)
         * @param {boolean} v присваиваемое значение.
         * @return {boolean} текущее значение
         */
        cteNoassign: function(v)
        {
            if (typeof(v) === 'boolean' /*&& this._config.isanswer!==v*/) {
                //if(this._config.noassign===v) return;
                this._config.noassign = v;
                v ?
                        this.assignFactory.mtf_addTag({text:'no asign'}) :
                        this.assignFactory.mtf_delTag('no asign');
            }
            return this._config.noassign;
        },
        /**
         * устанавливает приоритет сообщения (число от 0 до 3).
         * (если не передавать параметр вернет текущее значение иначе возвращает установленное)
         * @param {number} v присваиваемое значение.
         * @return {number} текущее значение
         */
        ctePriority: function(v)
        {
            if (typeof(v = v * 1) === 'number' && v <= 3 && v >= 0) {
                this.priorityFactory.mtf_delTag(0);
                this._config.priority = v;
                priorityName = false;
                switch (v) {
                    case 1:
                        priorityName = 'high';
                        break;
                    case 2:
                        priorityName = 'critical';
                        break;
                    case 3:
                        priorityName = 'blocked';
                        break;
                }
                priorityName ?
                        this.priorityFactory.mtf_addTag({text:priorityName,css:priorityName}) : '';
            }
            return this._config.priority;
        },
        /**
         * устанавливает от кого сообщение.
         * (если не передавать параметр вернет текущее значение иначе возвращает установленное)
         * @param {String} v присваиваемое значение.
         * @return {String} текущее значение
         */
        cteFrom: function(v)
        {
            if (typeof(v) !== 'undefined') {
                this._config.from = v;
                $(this._bodyList.from).html(fixByWbr(this._config.from));
            }
            return this._config.from;
        },
        /**
         * read-only  возвращает массив меток (метка – является объектом {@link messageTagFactory})
         * для работы с тэгами используйте {@link #tagsFactory}
         * @return {messageTagFactory} текущее значение
         */
        cteTags: function(v)
        {
            return this.tagsFactory;
        },
        /**
         * устанавливает тему сообщения.
         * @param {String} v присваиваемое значение.
         * @return {String} текущее значение
         */
        cteTitle: function(v)
        {
            if (typeof(v) !== 'undefined') {
                this._config.title = v;
                $(this._bodyList.title).html(this._config.title);//fixByWbr(this._config.title);
            }
            return this._config.digest;
        },
        /**
         * устанавливает дайджест сообщения.
         * (если не передавать параметр вернет текущее значение иначе возвращает установленное)
         * @param {String} v присваиваемое значение.
         * @return {String} текущее значение
         */
        cteDigest: function(v)
        {
            if (typeof(v) !== 'undefined') {
                this._config.digest = v;
                $(this._bodyList.digest).html(fixByWbr(this._config.digest));
            }
            return this._config.digest;
        },
        /**
         * устанавливает дату сообщения.
         * (если не передавать параметр вернет текущее значение иначе возвращает установленное)
         * @param {Object} v присваиваемое значение (String/Date).
         * @return {Object} текущее значение
         */
        cteDate: function(v)
        {
            v = typeof(v) === 'string' ? new Date($.format.date(v, 'MM/dd/yyyy hh:mm:ss ')) : v;
            if (typeof(v) === 'object') {
                this._config.date = v;
                $(this._bodyList.date).html(this._config.date.getDate() + ' ' + cortegeGetMonthName(this._config.date.getMonth()));
            }

            return this._config.date;
        },
        /**
         * установка количество сообщений в треде.
         * (если не передавать параметр вернет текущее значение иначе возвращает установленное)
         * @param {number} v присваиваемое значение.
         * @return {number} текущее значение
         */
        cteCount: function(v)
        {
            if (typeof(v = v * 1) === 'number') {
                this._config.count = v;
                $(this._bodyList.count).html('(' + this._config.count + ')');
            }
            return this._config.count;
        },
        /**
         * установка имени CSS класс отображения треда.
         * (если не передавать параметр вернет текущее значение иначе возвращает установленное)
         * @param {String} v присваиваемое значение.
         * @return {String} текущее значение
         */
        cteHighlight: function(v)
        {
            if (typeof(v) === 'string') {
                this.removeClass(this._config.highlight);
                this._config.highlight = v;
                this.addClass(v);
            }
            return this._config.highlight;
        }
    });
    _init();
    this.click($.proxy(this, 'onClick'));
    this._config.afterInit();
    return this;
}

/**
 * @class cortegeThreads
 * cortegeThreads управляет списком строк, согласно чётко определённому HTML-шаблону.
 * Cortege_Threads умеет либо сам генерировать этот HTML, из JSON структуры (для AJAX
 * использования), либо использовать уже готовые HTML блоки на странице
 * <pre><code>

 &lt;имя параметра&gt; &lt;/имя параметра&gt; - все параметры оформляются так
 &lt;имя параметра/&gt; - так оформляются параметры типа boolean если есть то true иначе false

 Параметры сообщений(каждое конфиг треда закрывается в тег &lt;p&gt;&lt;/p&gt;):

 cte_thread_id        идентификатор треда (определяется сервером)
 cte_select        выбор элемента (контрол checkbox)
 cte_mark        пометка (объект класса {@link threadMark})
 text        текст или примечание маркировки
 type        тип маркировки (на данный момент всегда «star»).
 Тип влияет на выбор основного CSS класса, название
 которого пишется как: «.thread_mark_[type]».
 css        дополнительный css класс для отображения
 style        дополнительный стиль для отображения
 cte_locked        флаг блокировки, если он равен true, свойство highlight
 использует светлосерый цвет, и вся линия отображается
 CSS классом .thread_locked
 cte_locked_user     указывает кто сейчас работает с тредом.
 cte_isview         флаг, который равен true, если сообщение просмотрено.
 cte_isanswer         флаг, если сообщение обработано.
 cte_noassign         если сообщение не ассигновано.
 cte_priority         приоритет сообщения (число от 0 до 3).
 cte_from         от кого сообщение.
 cte_tags         массив меток (метка – является объектом {@link messageTag})
 <i>каждый конфиг тэга закрывается в тег &lt;_tag&gt;&lt;/_tag&gt;</i>
 text         текст метки.
 css         CSS класс отображения метки
 style         CSS стиль отображения метки
 cte_title         тема сообщения.
 cte_digest         дайджест сообщения.
 cte_date         дата сообщения.
 cte_count         количество сообщений в треде.
 cte_highlight         цвет подсветки.
 </code></pre>

 * Пример HTML блока
 * <pre><code>
 &lt;p&gt;
 &lt;cte_thread_id&gt;tID6754345&lt;/cte_thread_id&gt;
 &lt;cte_highlight&gt;myRow&lt;/cte_highlight&gt;
 &lt;cte_select&gt;
 &lt;cte_mark&gt;
 &lt;type&gt;star&lt;/type&gt;
 &lt;text&gt;Hohoho&lt;/text&gt;
 &lt;css&gt;yellow&lt;/css&gt;
 &lt;/cte_mark&gt;
 &lt;cte_from&gt;lalala&lt;/cte_from&gt;
 &lt;cte_noassign/&gt;
 &lt;cte_priority&gt;3&lt;/cte_priority&gt;
 &lt;cte_tags&gt;
 &lt;_tag&gt;
 &lt;text&gt;ower download&lt;/text&gt;
 &lt;css&gt;myDesign&lt;/css&gt;
 &lt;style&gt;border:1px solid #F00;&lt;/style&gt;
 &lt;/_tag&gt;
 &lt;_tag&gt;
 &lt;text&gt;no login&lt;/text&gt;
 &lt;css&gt;nologin&lt;/css&gt;
 &lt;/_tag&gt;
 &lt;/cte_tags&gt;
 &lt;cte_title&gt;Это сообщение сгенерировано из HTML&lt;/cte_title&gt;
 &lt;cte_digest&gt;Тема сообщения или просто дайджест&lt;/cte_digest&gt;
 &lt;cte_count&gt;13&lt;/cte_count&gt;
 &lt;cte_date&gt;12/7/1990&lt;/cte_date&gt;
 &lt;/p&gt;
 </code></pre>
 * При генерации из HTML шаблона объекты описанные в поле {@link #items} добавляются.
 * <p>Пример:</p>
 <pre><code>
 new cortegeThreads({
 renderTo: '.c-rounded-body.cortege',
 defaultItem:{
 select: true,
 mark:{
 text:'дефолтный хинт',
 css:'yellow'
 },
 from:'это дефолтный фром',
 priority: 0,
 tags:[
 {text:'defTag#1'},
 {text:'defTag#1'}
 ],
 title:'это Дефолтный титл',
 digest:'это Дефолтный дайджест',
 count:100,
 date: new Date("10/29/10"),
 highlight:'',
 listeners:{
 'click':function(){
 ...
 },
 'mouseenter':function(){
 prevStar = this.mark.tmCss();
 this.mark.tmCss('black');
 },
 'mouseleave':function(){
 this.mark.tmCss(prevStar);
 }
 }
 },
 items:[{
 title:'JS object title',
 digest:'Make by JS conf object',
 date: '10/10/10',
 count:777,
 isview: false,
 noassign: true,
 priority: 2,
 mark:{
 text:'message number odin',
 css:'gray'
 },
 // не дополнит дефолтный, а заменит полностью!
 tags:[{
 text:'<(overtags)>',
 css:'owerdownload'
 },
 ...
 {
 text:'<(overtags)>',
 css:'owerdownload'
 }]
 },
 {...},
 new cortegeMessagesElement({})
 ]
 })
 </code></pre>
 * @constructor
 * Создать новый объект.
 * @param {Object} _config объект настроек
 */
var cortegeThreads = function(_config)
{
    var _this = this;
    //функция инициализации элемента.
    function _init()
    {
        _this.ctRender();
        $(_this._config.renderTo).append(_this);
        cortegeProxyBind(_this, _this._config.listeners);
    }

    /**
     * конфиг
     */
    this._config = {
        /**
         * @event afterInit вызывается после инициализации объекта
         */
        afterInit:emptyFn,
        /**
         * @cfg {String} renderTo куда будет рисоваться элемент (имя задавать в соотвествие со стандартами jQuery селекторов)
         */
        renderTo:'body',
        /**
         * @cfg {Array} items список элементов может состоять как из объектов настргоек так и из откомпелированных объектов.
         */
        items:[],
        /**
         * @cfg {Object} defaultItem дефолтные настройки для всех тредов.
         */
        defaultItem:{},
        /**
         * @cfg {Object} listeners объект эвентов c синтаксисом как у <a target="_blank" href="http://api.jquery.com/bind/">bind()</a>
         * <pre><code>
         listeners:{
         'click':function(){
         ...
         },
         'blur':function(){
         ...
         }
         }</code></pre>
         */
        listeners:{}
    }
    // спариваем дефолтный и переданный конфиг
    $.extend(this._config, _config);
    /**
     * Список тредов {@link cortegeThreadsElement}
     */
    this.ctItems = [];
    $.extend(this, {
        /**
         * Метод адаптации под JSON
         * @param {JSON} data Данные с сервера
         * @return {boolean} возвращает TRUE/FALSE
         */
        ctProxy: function(data)
        {
            $.each(data, function()
            {
                if (this.send_state == 'new') {
                    this.mark = {
                        type : 'edit'
                    };
                    // Если тип сообщения для отправки
                }

                if (this.send_state == 'queue') {
                    this.mark = {
                        type : 'send'
                    };
                }

                if (this.send_state != 'new' && this.send_state != 'queue') {
                    this.mark = {
                        type : 'empty'
                    };
                }

                this.count = this.message_count
                this.title = this.subject
                this.date = this.date_received
                typeof(this.isanswer) == 'undefined' ? this.isanswer = this.noanswer : ''
                this.isview = this.noview
                typeof(this.noassign) == 'undefined' ? this.noassign = !~~this.order_id : ''
                _this.ctAdd(_this.ctNew_element(this))
            })
            return true;
        },
        /**
         * отрисовка созданых элементов контрола
         * @return {cortegeThreads} возвращает класс с отрендеренными компонентами
         */
        ctRender:function()
        {
            $(this._config.renderTo).html('')
            if ($(this._config.renderTo).html() === '') {
                $.extend(this, $('<table class="threds-list"></table>'));
                var def = this._config.defaultItem;
                $.each(this._config.items, function()
                {
                    _this.ctAdd(_this.ctNew_element(this));
                });
                return this;
            } else {
                //alert('Developer message: conteiner must be empty!')
            }
        },
        /**
         * Метод добавляет в список новую строку (тред) Thread – объект класса {@link cortegeThreadsElement},
         * либо false. В случае если параметр не определён (false), метод сам создаёт объект
         * {@link cortegeThreadsElement} при помощи параметра {@link #defaultItem}.
         * @param {cortegeThreadsElement} thread объект {@link cortegeThreadsElement}
         * @return {cortegeThreadsElement} метод возвращает объект {@link cortegeThreadsElement}, который вставлен, либо false в случае неудачи.
         */
        ctAdd: function(thread)
        {
            typeof(thread) === 'undefined' ? thread = false : '';
            typeof(thread) === 'object' ? result = thread : '';
            this.ctItems.push(result);
            this.append(result);
            return result;
        },
        /**
         * Метод удаляет из списка строку с индексом pos (позиция относительно начала). Если индекс pos отрицательный,
         * то позиция строки отсчитывается от конца (-1 - это последний элемент).
         * @param {number} pos
         * @return {number} количество оставшихся строк
         */
        ctDel: function(pos)
        {
            typeof(pos) === 'undefined' ? pos = -1 : '';
            if (pos > this.ctLength() || this.ctLength() == 0) return false;
            pos =
                    pos >= 0 ?
                            pos :
                            this.ctLength() + pos;
            this.ctItems[pos].remove();
            this.ctItems.splice(pos, 1);
            return this.ctLength();
        },
        /**
         * метод вызывает конструктор потомка {@link cortegeThreadsElement} и передаёт ему
         * свойства props, но не добавляет объект в список.
         * @param {Object} props объект настроек
         * @return {cortegeThreadsElement} возвращает {@link cortegeThreadsElement}
         */
        ctNew_element:function(props, addDef)
        {
            typeof(addDef) === 'undefined' ? addDef = true : '';
            var _frondEndConf = {};
            _frondEndConf = addDef ? $.extend(true, _frondEndConf, this._config.defaultItem, props) : props;
            result = typeof(_frondEndConf) !== 'undefined' ?
                    new cortegeThreadsElement(_frondEndConf) : false;
            return result;
        },
        /**
         * Метод возвращает кол-во строк.
         * @return {number} количество строк в кортеже.
         */
        ctLength:function()
        {
            return this.ctItems.length;
        }
    });
    _init();
    this._config.afterInit();
}

/**
 * @class cortegeMessagesElement
 * Управляет внешним видом строки, описывающей основные свойства сообщения.
 * <p>Пример:</p>
 <pre><code>
 new cortegeMessagesElement({
 from: 'Somebody',
 title: 'Message from',
 tags:[{
 text:'<(fun)>',
 css:'high'
 }, ...
 ],
 digest:'!',
 noassign:true,
 priority: 1,
 body: 'This is message text',
 highlight:'noanswer',
 listeners:{
 'dblclick':function(){
 alert(cortegeRenderThreadConfPrintString(this));
 }
 }
 })</code></pre>
 * @constructor
 * Создать новый объект.
 * @param {array} _config объект настроек.
 * @return {cortegeMessagesElement} возвращает объект
 */
var cortegeMessagesElement = function(_config)
{
    var _this = this;
    /**
     * Объек фабрики тэгов {@link messageTag}
     */
    this.tagsFactory = {};
    //функция открытия закрытия одного элемента гармошки
    this._slide = function()
    {
        if (!this._config.superMini) {
            if (this._config.trafficEconom) {
                if (!this._config.loadMsgBody(this)) {
                    return true;
                }
            }
            this.cmeSelect(!this._config.select)
        }
    };
    //высчитываем сколько времени прошло
    function mathTimeAgo()
    {
        /*_this._config.time_ago = Math.floor((new Date()-_this._config.date)/1000);
         sec = _this._config.time_ago;
         day = Math.floor(sec/(60*60*24));
         sec %= (60*60*24);
         hour = Math.floor(sec/(60*60));
         sec %= (60*60);
         min = Math.floor(sec/60);
         sec = sec%60;
         result = '<nobr>';
         result+=day?day+'дн. ':''
         result+=hour?day+'час. ':''
         result+=min+'мин.';
         result+='</nobr>';
         $(_this._bodyList.time_ago).html(result);*/
        $(_this._bodyList.time_ago).html(compileGLikeAgo(_this._config.date))

    }

    //функция фикса для полей с затемнением
    function fixByWbr(s)
    {
        return s;
        r = '';
        for (i = 0; i < s.length; i++) {
            r += s[i] + '<wbr/>';
        }
        return r;
    }

    //функция инициализации элемента.
    function _init()
    {
        _this.tagsFactory =
                $.isArray(_this._config.tags) ?
                        new messageTagFactory(_this._config.tags) :
                        _this._config.tags;
        _this.priorityFactory = new messageTagFactory();
        _this.assignFactory = new messageTagFactory();
        _this.cmeRender();
        _this._bodyList.header.click($.proxy(_this, '_slide'));
        //дорисовываем
        _this.cmeSelect(_this._config.select);
        _this.cmeNoassign(_this._config.noassign);
        _this.cmePriority(_this._config.priority);
        _this.cmeFrom(_this._config.from);
        _this.cmeTitle(_this._config.title);
        _this.cmeDigest(_this._config.digest);
        _this.cmeDate(_this._config.date);
        cortegeProxyBind(_this, _this._config.listeners);
    }

    /**
     * конфиг
     */
    this._config = {
        /**
         * @event afterInit вызывается после инициализации объекта
         */
        afterInit:emptyFn,

        /**
         * @cfg {Object} message_id идентификатор сообщения (определяется сервером)
         */
        message_id:'',
        /**
         * @cfg {boolean} select выбор элемента (влияет на то, распахнуто сообщение или нет)
         */
        select:false,
        /**
         * @cfg {String} from от кого сообщение.
         */
        from:'none from',
        /**
         * @cfg {boolean} noassign (по умолчанию false) если сообщение не ассигновано.
         */
        noassign:false,
        /**
         * @cfg {number} priority (по умолчанию 0) приоритет сообщения (число от 0 до 3).
         */
        priority:0,
        /**
         * @cfg {Array} tags массив меток (метка – является объектом {@link messageTag} или конфигурационным объектом)
         */
        tags:[],
        /**
         * @cfg {String} title тема сообщения.
         */
        title:'none title',
        /**
         * @cfg {String} digest дайджест сообщения.
         */
        digest:'none digest',
        /**
         * @cfg {Date} date дата сообщения.
         */
        date:new Date(),
        /**
         * @cfg {number} time_ago сколько прошло времени с момента написания сообщения в секундах. !Считается автоматически!
         */
        time_ago:0,
        /**
         * @cfg {number} time_ago_interval (по умолчанию 0)интервал в секундах обновления поля time_ago в HTML шаблоне(0 - если не обновлять).
         */
        time_ago_interval:1,
        /**
         * @cfg {number} body текст сообщения.
         */
        body:'none body',
        /**
         * @cfg {Boolean} trafficEconom (по умолчанию false) позволяет экономить трафик за счет динамической подгрузки тел сообщений
         */
        trafficEconom: false,
        /**
         * @event loadMsgBody вызывается при попытке ракскрытия месаджа если значение {@link #trafficEconom} true
         * <p>Чтобы контрол не использовал свой стандартный slide для развертывания сообщения надо вернуть false </p>
         * @param {cortegeMessagesElement} messEl элемент массива сообщений
         * <pre><code>
         ...
         loadMsgBody: function(b){
         ...
         b.cmeBody('Это сообщение сгенерировано JS скриптом<br>');
         ...
         }
         ...
         </code></pre>
         */
        loadMsgBody: function()
        {
            return true
        },
        /**
         * @cfg {String} highlight – цвет подсветки.
         */
        highlight: '',
        /**
         * @cfg {Object} listeners объект эвентов c синтаксисом как у <a target="_blank" href="http://api.jquery.com/bind/">bind()</a>
         * <pre><code>
         listeners:{
         'click':function(){
         ...
         },
         'blur':function(){
         ...
         }
         }</code></pre>
         */
        listeners:{},
        superMini: false,
        /**
         * Инициализация кнопки ответа (верхний правый угол сообщения)
         */
        initAnswerBtn: function(data)
        {
            return false
        },
        /**
         * Нажатие на кнопку ответа внизу сообщения
         */
        answerClick: emptyFn,
        /**
         * Нажатие на кнопку "В обработанное" внизу сообщения
         */
        inTreatedClick: emptyFn,
        layerStyle: ''
    }
    // спариваем дефолтный и переданный конфиг
    $.extend(this._config, _config);

    $.extend(this, {
        /**
         * отрисовка и создание всех элементов треда
         * @return {cortegeThreadsElement} возвращает отрендерин класс
         */
        cmeRender:function()
        {
            // создаем DIV контейнер
            _html = $('<div class="h-slider-block"></div>')
                    .addClass(_this._config.highlight);

            // создаем головной блок сообщения
            // Если сообщение является не обработанным выделяем фон серым цветом, если обработано белым
            if (this._config['state_processing'] != 'answered') {
                var style_digest = "background-color:#F5F5F5;"
                var _digest = $('<span class="digest" style="font-weight:bold;"></span>');
            }
            else {
                var style_digest = "background-color:#FFFFFF;"
                var _digest = $('<span class="digest"></span>')
            }

            // Инициализируем блок выпадающего меню вверху справа
            var glikeAnswer = this._config.initAnswerBtn(this._config, this)
            var
                    _from,
                    _digest,
                    _time_ago,
                    _body,
                    _headerTbl = $('<table class="h-slider-block-tbl"></table>').append($('<tr></tr>').append(
                            _from = $('<td class="from"></td>'),
                            _tags_digest = $('<td>').addClass('tags-dayjest').attr('style', style_digest).html(
                                    $('<div>').addClass('tags-inner').html(
                                            $('<div>').addClass('tin-layer').append(
                                                    this.priorityFactory.mtf_HTML(),
                                                    this.assignFactory.mtf_HTML(),
                                                    this.tagsFactory.mtf_HTML(),
                                                    _digest
                                            )
                                    )
                            ),
                            _time_ago = $('<td class="time"></td>'),
                            $('<td class="answer" style="width: 300px"></td>').html(glikeAnswer)
                    ))

            _html.append(
                    _headerTbl,
                    _body = $('<div class="message-body"></div>').append(this._config.body),
                    $('<input id="msg_id" type="hidden" value="' + this._config.message_id + '">'),
                    $('<input id="reply_layer_id" type="hidden" value="' + this._config.reply_layer_id + '">')
                    /*$('<div class="bottom-button"></div>').append(
                     //$('<button class="button grey"></button>').html('Закрыть нить'),
                     //$('<button class="button grey"></button>').html('Метки'),
                     //$('<button class="button orange"></button>').html('Ответить')
                     )*/
            )

            // Добавляем место для контрола и кнопки
            var
                    blAnswer,
                    blInTreated,
                    answerPlace = $('<div></div>'),
                    editorPlace = $('<div>').addClass('editorPlace');

            // Если в меню существует пункт для ответа выводим его
            if (typeof _config.menuList.answer != 'undefined')
            {
                //  Если тип сообщения для редактирования перименовываем меню по изменённым требованиям
                if (_config.menuList.answer.type == 'edit')
                {
                    _config.menuList.answer.name = 'Редактировать черновик';
                    var class_icon = 'cmebl-btn-edit';

                    // Если тип сообщения для отправки и не отправлено физечески переименовываем меню по изменённым требованиям
                    if (_config['state'] == 'send' && _config['send_state'] != 'process') {
                        _config.menuList.answer.name = 'Редактировать и отменить отправку';
                        var class_icon = 'cmebl-btn-send';
                    }
                }
                else
                {
                    var class_icon = 'cmebl-btn-default';
                }

                var blAnswer = $('<div class="cmebl-btn ' + class_icon + '" id="' + _config.menuList.answer.type + '"></div>')
                        .html('<span></span>' + _config.menuList.answer.name)
                        .click(function(e)
                        {
                            _this._config.answerClick(_this, e)
                        })
            }

            // Если в меню существует пункт в обработанные выводим его
            if (typeof _config.menuList.processed != 'undefined') {
                var blInTreated = $('<div class="cmebl-btn cmebl-btn-' + _config.menuList.processed.id + '" id="'
                        + _config.menuList.processed.id + '"></div>')
                        .html('<span></span>' + _config.menuList.processed.name).click(function(e)
                        {
                            _this._config.inTreatedClick(_this, e)
                        });
            }


            var bottomLine = $('<div class="cme-bottom-line"></div>').append(
                    blAnswer,
                    blInTreated
            )

            // Указываем, каким цветом вывести нижнее меню сообщения
            var u_cfg = $.conf['u_cfg'];
            if (this._config['state'] == 'draft' && typeof u_cfg['draft'] != 'undefined') {
                bottomLine.css({backgroundColor: u_cfg['draft']['value']});
            }

            if (this._config['send_state'] == 'queue' && typeof u_cfg['queue'] != 'undefined') {
                bottomLine.css({backgroundColor: u_cfg['queue']['value']});
            }

            // Если сообщение физически уже отправлено выводим простую надпись
            if (this._config['is_send'] == true)
            {
                // Если дата отправки не известна (случай вывода внешнего спам сообщения) выводим date_received
                if(typeof this._config['date_sent'] == 'undefined')
                {
                    var date = this._config['date_received'];
                }
                else
                {
                    var date = this._config['date_sent'];
                }

                var bottomLine = $('<div class="cme-bottom-line"></div>').append(
                        $('<div class="cmebl-btn"></div>')
                                .html('<span></span>Сообщение отправлено: ' + date)
                )
                if (typeof u_cfg['process'] != 'undefined') {
                    bottomLine.css({backgroundColor: u_cfg['process']['value']});
                }
            }

            // Если сообщение отправлено с ошибкой выводим простую надпись
            // Перезаписывая bottomLine
            if (this._config['send_state'] == 'error') {
                var bottomLine = $('<div class="cme-bottom-line"></div>').append(
                        $('<div class="cmebl-btn"></div>')
                                .html('<span></span>Ошибка отправки: ' + this._config['date_sent'])
                )
                if (typeof u_cfg['error'] != 'undefined') {
                    bottomLine.css({backgroundColor: u_cfg['error']['value']});
                }
            }

            // Если сообщение отправлено с ошибкой выводим простую надпись
            // Перезаписывая bottomLine
            if (this._config['is_my_msg'] == false && this._config['layer_write'] == false) {
                var bottomLine = $('<div class="cme-bottom-line"></div>').append(
                        $('<div class="cmebl-btn"></div>')
                                .html('<span></span>Сообщение отправлено: ' + this._config['date_received'])
                )
            }

            attachPlace = $('<div>').addClass('attach-msg-block')

            // Вывод аттачментов
            if(typeof this._config.attachments != 'undefined' && typeof this._config.attachments != 'string')
            {
                $.each(this._config.attachments, function()
                {
                    attachPlace.append($('<div>').addClass('amb-elem').addClass(this.mime_type.split('/').join(' ')).append(
                            $('<span>').html(this.filename + ' размер:' + (this.size / 1024).toFixed(2) + ' Кб'),
                            $('<a>').html(this.filename).attr('href', '/attachments/' + this.link).attr('target', 'blank')
                                    .attr('style', 'color:red').html('  View')
                    ))
                })
            }

            _html.append(
                    answerPlace,
                    attachPlace,
                    editorPlace,
                    bottomLine
            )

            _from.addClass(this._config.layerStyle)

            //вливаем объект jQuery в наш класс
            $.extend(this, _html);
            /**
             * объект со ссылками на части-объекты мессаги
             */
            this._bodyList = {
                mainDiv:         this,
                header:            _headerTbl,
                from:             _from,
                title:             false,
                digest:         _digest,
                tags_digest : _tags_digest,
                body:             _body,
                date:            false,
                time_ago:        _time_ago,
                attachPlace:     attachPlace,
                answerPlace:     answerPlace,
                editorPlace:     editorPlace,
                blInTreated: (typeof blInTreated != 'undefined') ? blInTreated : '',
                blAnswer: (typeof blAnswer != 'undefined') ? blAnswer : '',
                glikeAnswer : glikeAnswer
            };
            this._config._mini ? this.cmeSelect(false) : '';

            // Добавляем список объектов, которые могут закрывать верхнее меню, если оно открыто
            // ТОЛЬКО ДЛЯ ЭТОГО СООБЩЕНИЯ
            glikeAnswer.listObjectHideMenu(
                    [this._bodyList.header, this._bodyList.body, this._bodyList.attachPlace]
            );

            return this;
        },
        /**
         * устанавливает идентификатор сообщения
         * (определяется сервером)(если не передавать параметр вернет текущее значение иначе возвращает установленное)
         * @param {Object} v присваиваемое значение.
         * @return {Object} текущее значение
         */
        cmeMessage_id: function(v)
        {
            v ? this._config.message_id = v : ''
            return this._config.message_id;
        },
        /**
         * устанавливает выбрано ли сообщение(распахнуто иль нет)
         * (если не передавать параметр вернет текущее значение иначе возвращает установленное)
         * @param {boolean} v присваиваемое значение.
         * @return {boolean} текущее значение
         */
        cmeSelect: function(v)
        {
            if (typeof(v) === 'boolean') {

                var
                        index = this._config._elementLocation.index,
                        len = this._config._elementLocation.parent.cmLength()


                if (!v && index == len) return this._config.select

                this._config.select = v;
                if (!v) {
                    this.addClass('mini')
                    /*this._bodyList.body.style.display = 'block';
                     this._bodyList.header.style.borderBottomWidth = '';*/
                } else {
                    this.removeClass('mini')
                    /*this._bodyList.body.style.display = 'none';
                     this._bodyList.header.style.borderBottomWidth = '1px'*/
                }
            }
            return this._config.select;

        },
        /**
         * устанавливает если сообщение не ассигновано
         * (если не передавать параметр вернет текущее значение иначе возвращает установленное)
         * @param {boolean} v присваиваемое значение.
         * @return {boolean} текущее значение
         */
        cmeNoassign: function(v)
        {
            if (typeof(v) === 'boolean' && this._config.isanswer !== v) {
                this._config.noassign = v;
                v ?
                        this.assignFactory.mtf_addTag({text:'no asign'}) :
                        this.assignFactory.mtf_delTag('no asign');
            }
            return this._config.noassign;
        },
        /**
         * устанавливает приоритет сообщения (число от 0 до 3).
         * (если не передавать параметр вернет текущее значение иначе возвращает установленное)
         * @param {number} v присваиваемое значение.
         * @return {number} текущее значение
         */
        cmePriority: function(v)
        {
            if (typeof(v = v * 1) === 'number' && v <= 3 && v >= 0) {
                this.priorityFactory.mtf_delTag(0);
                this._config.priority = v;
                priorityName = false;
                switch (v) {
                    case 1:
                        priorityName = 'high';
                        break;
                    case 2:
                        priorityName = 'critical';
                        break;
                    case 3:
                        priorityName = 'blocked';
                        break;
                }
                priorityName ?
                        this.priorityFactory.mtf_addTag({text:priorityName,css:priorityName}) : '';
            }
            return this._config.priority;
        },
        /**
         * устанавливает от кого сообщение.
         * (если не передавать параметр вернет текущее значение иначе возвращает установленное)
         * @param {String} v присваиваемое значение.
         * @return {String} текущее значение
         */
        cmeFrom: function(v)
        {
            if (typeof(v) !== 'undefined') {
                this._config.from = htmlspecialchars(v);
                $(this._bodyList.from).html(fixByWbr(this._config.from));
            }
            return this._config.from;
        },
        /**
         * read-only  возвращает массив меток (метка – является объектом {@link messageTagFactory})
         * для работы с тэгами используйте {@link #tagsFactory}
         * @return {messageTagFactory} текущее значение
         */
        cmeTags: function(v)
        {
            return this.tagsFactory;
        },
        /**
         * устанавливает тему сообщения.
         * (если не передавать параметр вернет текущее значение иначе возвращает установленное)
         * @param {String} v присваиваемое значение.
         * @return {String} текущее значение
         */
        cmeTitle: function(v)
        {
            if (typeof(v) !== 'undefined') {
                this._config.title = v;
                $(this._bodyList.title).html(this._config.title); //fixByWbr(this._config.title);
            }
            return this._config.title;
        },
        /**
         * устанавливает дайджест сообщения.
         * (если не передавать параметр вернет текущее значение иначе возвращает установленное)
         * @param {String} v присваиваемое значение.
         * @return {String} текущее значение
         */
        cmeDigest: function(v)
        {
            if (typeof(v) !== 'undefined') {
                this._config.digest = v;
                $(this._bodyList.digest).html(fixByWbr(this._config.digest));
            }
            return this._config.digest;
        },
        /**
         * устанавливает дату сообщения.
         * (если не передавать параметр вернет текущее значение иначе возвращает установленное)
         * @param {Object} v присваиваемое значение (String/Date).
         * @return {Object} текущее значение
         */
        cmeDate: function(v)
        {
            v = typeof(v) === 'string' ? new Date($.format.date(v, 'MM/dd/yyyy HH:mm:ss ')) : v;
            if (typeof(v) === 'object') {
                this._config.date = v;
                $(this._bodyList.date).html(
                        '<nobr>' + this._config.date.getDate() + ' '
                                + cortegeGetMonthName(this._config.date.getMonth()) + '</nobr>'
                )
                mathTimeAgo();
            }
            return this._config.date;
        },
        /**
         * установка имени CSS класс отображения сообщения.
         * (если не передавать параметр вернет текущее значение иначе возвращает установленное)
         * @param {String} v присваиваемое значение.
         * @return {String} текущее значение
         */
        cteHighlight: function(v)
        {
            if (typeof(v) === 'string') {
                this.removeClass(this._config.highlight);
                this._config.highlight = v;
                this.addClass(v);
            }
            return this._config.highlight;
        },
        /**
         * устанавливает текст сообщения.
         * (если не передавать параметр вернет текущее значение иначе возвращает установленное)
         * @param {String} v присваиваемое значение.
         * @return {String} текущее значение
         */
        cmeBody: function(v)
        {
            if (typeof(v) !== 'undefined') {
                this._config.body = v;
                $(this._bodyList.body).html(this._config.body); //fixByWbr(this._config.title);
            }
            return this._config.body;
        },
        cmeSuperMini:function(v)
        {
            if (typeof(v) !== 'undefined') {
                this._config.superMini = v
                v ? this.addClass('super') : this.removeClass('super')
            }
            return this._config.superMini;
        }
    });
    _init();
    this._config.afterInit();
    return this;
}

/**
 * @class cortegeMessages
 * cortegeMessages управляет списком, согласно чётко определённому HTML-шаблону.
 * cortegeMessages умеет либо сам генерировать этот HTML, из JSON структуры
 * (для AJAX использования), либо использовать уже готовые HTML блоки на странице,
 * <pre><code>


 &lt;имя параметра&gt; &lt;/имя параметра&gt; - все параметры оформляются так
 &lt;имя параметра/&gt; - так оформляются параметры типа boolean если есть то true иначе false

 Базовые параметры(элемент закрывается в тег &lt;cm_head&gt;&lt;/cm_head&gt;):
 order_id    ID
 email        Email
 date         дата

 Параметры сообщений(каждый конфиг месаджа закрывается в тег &lt;p&gt;&lt;/p&gt;):
 cme_message_id    идентификатор сообщения
 cme_select    выбор элемента (влияет на то, распахнуто сообщение или нет)
 cme_from    от кого сообщение.
 cte_noassign     если сообщение не ассигновано.
 cte_priority     приоритет сообщения (число от 0 до 3).
 cte_tags     массив меток (метка – является объектом {@link messageTag})
 <i>каждый конфиг тэга закрывается в тег &lt;_tag&gt;&lt;/_tag&gt;</i>
 text     текст метки.
 css     CSS класс отображения метки
 style     CSS стиль отображения метки
 cme_title     тема сообщения.
 cme_digest     дайджест сообщения.
 cme_date     дата сообщения.
 cme_time_ago     сколько прошло времени с момента написания сообщения.
 cme_highlight     цвет подсветки.

 </code></pre>
 * Пример HTML блока
 * <pre><code>
 &lt;cm_head&gt;
 &lt;order_id&gt;SM 6545476548664&lt;/order_id&gt;
 &lt;email&gt;lenfer.spb@gmail.com&lt;/email&gt;
 &lt;date&gt;11/13/2010 3:00:00&lt;/date&gt;
 &lt;/cm_head&gt;
 &lt;p&gt;
 &lt;cme_message_id&gt;ID_133&lt;/cme_message_id&gt;
 &lt;cme_select/&gt;
 &lt;cme_from&gt;От первого юзвера&lt;/cme_from&gt;
 &lt;cte_noassign/&gt;
 &lt;cte_priority&gt;3&lt;/cte_priority&gt;
 &lt;cme_tags&gt;
 &lt;_tag&gt;
 &lt;text&gt;ower download&lt;/text&gt;
 &lt;css&gt;myDesign&lt;/css&gt;
 &lt;style&gt;border:1px solid #F00;&lt;/style&gt;
 &lt;/_tag&gt;
 &lt;_tag&gt;
 &lt;text&gt;no login&lt;/text&gt;
 &lt;css&gt;nologin&lt;/css&gt;
 &lt;/_tag&gt;
 &lt;/cme_tags&gt;
 &lt;cme_title&gt;Это сгенерирговано из HTML блока!&lt;/cme_title&gt;
 &lt;cme_digest&gt;Раз два три&lt;/cme_digest&gt;
 &lt;cme_date&gt;11/13/2010 3:32:00&lt;/cme_date&gt;
 &lt;cme_highlight&gt;selected&lt;/cme_highlight&gt;
 &lt;/p&gt;
 </code></pre>
 * При генерации из HTML шаблона объекты описанные в поле {@link #items} добавляются.
 * <p>Пример:</p>
 <pre><code>
 new cortegeMessages({
 renderTo: '.c-rounded-body.msg',
 defaultItem:{
 from: 'SomeBODY',
 title:'!23',
 tags:[
 {text:'<(fun)>', css:'high'},
 ...
 {text:'<(fun)>', css:'high'},
 ],
 digest:'Console D',
 noassign:true,
 date: '11/11/2010 15:15:45',
 priority: 2,
 body: 'smile',
 highlight:'noanswer notview',
 listeners:{
 'click':function(){
 ...
 },
 ...
 'dblclick':function(){
 ...
 }
 }
 },
 items:[
 {
 from: 'Me',
 title:'))))',
 digest:';p',
 date: '1/24/2009 14:00:12',
 priority: 3,
 body: '&^%&^%&^#$#%^',
 },
 ...
 {}
 ]
 }
 </code></pre>
 * При генерации из HTML шаблона объекты описанные в поле {@link #items} тоже добавляются.
 * @constructor
 * Создать новый объект.
 * @param {Object} _config объект настроек
 */
var cortegeMessages = function(_config)
{
    var _this = this;
    // последний в mini
    var lastMiniNum = 0;
    // первый в main
    var firstMainNum = 0;
    //функция убирает сжатость гармошки
    this.setFullStyle = function()
    {
        var i = 0;
        for (var i = this.cmLength() - this._config.nonHiddenMax; i >= 0; i--) {
            _this.cmItems[i]._config._mini = false;
            _this._bodyList.mainSide.prepend(_this.cmItems[i]);
        }
        lastMiniNum = firstMainNum = 0
    }
    //функция сжимает гармошку
    //функция инициализации элемента.

    function _init()
    {
        _this.cmRender();
        $(_this._config.renderTo).append(_this);
        _this.cmOrder_id(_this._config.order_id);
        _this.cmEmail(_this._config.email);
        _this.cmDate(_this._config.date);
        cortegeProxyBind(_this, _this._config.listeners);
        _this.click(function(e)
        {
            //console.log($(e.target))
            if ($(e.target).hasClass('super')) {
                $.each(_this.cmItems.slice(0,
                        _this.cmLength() - _this._config.nonHiddenMax), function()
                {
                    this.cmeSuperMini(false)
                })
            }
        })
    }

    /**
     * конфиг
     */
    this._config = {
        /**
         * @event afterInit вызывается после инициализации объекта
         */
        afterInit:emptyFn,
        /**
         * @cfg {String} renderTo куда будет рисоваться элемент (имя задавать в соотвествие со стандартами jQuery селекторов)
         */
        renderTo:'body',

        /**
         * @cfg {Object} order_id
         */
        order_id:'node ID',
        /**
         * @cfg {String} email
         */
        email:'none e-mail',
        /**
         * @cfg {Date} date
         */
        date:new Date(),
        /**
         * @cfg {Array} items список элементов {@link cortegeMessagesElement} может состоять как из объектов настргоек так и из откомпелированных объектов.
         */
        items:[],
        /**
         * @cfg {Number} nonHiddenMax (по умолчанию 10)максиммальное количество элементов в контроле когда показывается нормальный вариант, как только элементов становиться больше гармошка превращается в мини
         */
        nonHiddenMax:5,
        /**
         * @cfg {Object} defaultItem дефолтные настройки для всех сообщений {@link cortegeMessagesElement}.
         */
        defaultItem:{},
        /**
         * @cfg {Object} listeners объект эвентов c синтаксисом как у <a target="_blank" href="http://api.jquery.com/bind/">bind()</a>
         * <pre><code>
         listeners:{
         'click':function(){
         ...
         },
         'blur':function(){
         ...
         }
         }</code></pre>
         */
        listeners:{},
        // Обработчик для определения данных меню
        // Формат данных для меню
        // { edit: {class:class, id:id, text:text}}, ...]
        menuList : emptyFn
    }
    // спариваем дефолтный и переданный конфиг
    $.extend(this._config, _config);
    /**
     * Список тредов {@link cortegeThreadsElement}
     */
    this.cmItems = [];
    $.extend(this, {
        /**
         * Метод адаптации под JSON
         * @param {JSON} data Данные с сервера
         * @return {boolean} возвращает TRUE/FALSE
         */
        cmProxy: function(data)
        {
            $.each(data, function()
            {
                this.message_id = this.msg_id
                this.title = this.subject
                this.date = this.date_received
                this.body = this.text
                // Определение данных для меню
                this.menuList = _this._config.menuList(this);

                this.layerStyle = 'layerStyle_' + this.layer_id

                _this.cmAdd(_this.cmNew_element(this))
            })
            // раскрываем последний на всякий
            this.cmItems[this.cmItems.length - 1].cmeSelect(true)
            return true;
        },
        /**
         * отрисовка созданых элементов контрола
         * @return {cortegeMessages} возвращает класс с отрендеренными компонентами
         */
        cmRender:function()
        {
            $(this._config.renderTo).html('')
            if ($(this._config.renderTo).html() === '') {
                $.extend(this, $('<div class="message-thread"></div>'));

                /**
                 * объект со ссылками на части-объекты контрола
                 */
                this._bodyList = {mainDiv: this};

                this.append(this._bodyList.miniSide = $('<div class="mini-side"></div>'));
                this._bodyList.miniSide.click($.proxy(this, 'setFullStyle'));
                this.append(this._bodyList.mainSide = $('<div class="main-side"></div>'));

                $.each(this._config.items, function()
                {
                    _this.cmAdd(_this.cmNew_element(this));
                });
                return this;
            } else {
                //alert('Developer message: conteiner must be empty!')
            }
        },
        /**
         * Метод добавляет в список новую строку (тред) Thread – объект класса {@link cortegeMessagesElement},
         * либо false. В случае если параметр не определён (false), метод сам создаёт объект
         * {@link cortegeMessagesElement} при помощи параметра {@link #defaultItem}.
         * @param {cortegeMessagesElement} msg объект {@link cortegeMessagesElement}
         * @return {cortegeMessagesElement} метод возвращает объект {@link cortegeMessagesElement},
         * который вставлен, либо false в случае неудачи.
         */
        cmAdd: function(msg)
        {
            typeof(msg) === 'undefined' ? msg = false : '';
            typeof(msg) === 'object' ? result = msg : '';

            this.cmItems.push(result);

            if (this.cmLength() > this._config.nonHiddenMax) {
                $.each(this.cmItems.slice(0,
                        this.cmLength() - this._config.nonHiddenMax), function()
                {
                    this.cmeSelect(false)
                    this.cmeSuperMini(true)
                })
            }

            this._bodyList.mainSide.append(result)
            return result;
        },
        /**
         * Метод удаляет из списка строку с индексом pos (позиция относительно начала). Если индекс pos отрицательный,
         * то позиция строки отсчитывается от конца (-1 - это последний элемент).
         * @param {number} pos
         * @return {number} количество оставшихся строк
         */
        cmDel: function(pos)
        {
            typeof(pos) === 'undefined' ? pos = -1 : '';
            if (pos > this.cmLength() || this.cmLength() == 0) return false;
            pos =
                    pos >= 0 ?
                            pos :
                            this.cmLength() + pos;

            this.cmItems[pos].remove();
            if (!this.cmItems[pos]._config._mini) {
                this._bodyList.mainSide.prepend(this.cmItems[lastMiniNum--]);
                firstMainNum--;
            }
            this.cmItems.splice(pos, 1);
            return this.cmLength();
        },
        /**
         * метод вызывает конструктор потомка {@link cortegeMessagesElement} и передаёт ему
         * свойства props, но не добавляет объект в список.
         * @param {Object} props объект настроек
         * @param {Object} addDef необезательный параметр, по умолчанию true указывает нужно
         * ли добавлять параметры из переменной {@link #defaultItem}
         * @return {cortegeMessagesElement} возвращает {@link cortegeMessagesElement}
         */
        cmNew_element:function(props, addDef)
        {
            typeof(addDef) === 'undefined' ? addDef = true : '';
            var _frondEndConf = {};
            _frondEndConf._elementLocation = {
                index: (this.cmLength() + 1),
                parent: this
            }
            _frondEndConf = addDef ? $.extend(true, _frondEndConf, this._config.defaultItem, props) : props;
            result = typeof(_frondEndConf) !== 'undefined' ?
                    new cortegeMessagesElement(_frondEndConf) : false;
            return result;
        },
        /**
         * Метод возвращает кол-во строк.
         * @return {number} количество строк в кортеже.
         */
        cmLength:function()
        {
            return this.cmItems.length;
        },
        /**
         * устанавливает ID сообщения.
         * (если не передавать параметр вернет текущее значение иначе возвращает установленное)
         * @param {Object} v присваиваемое значение.
         * @return {Object} текущее значение
         */
        cmOrder_id: function(v)
        {
            if (typeof(v) !== 'undefined') {
                this._config.order_id = v;
                $(this._bodyList.order_id).html('Order ID: ' + this._config.order_id);
            }
            return this._config.order_id;
        },
        /**
         * устанавливает e-mail отправителя.
         * (если не передавать параметр вернет текущее значение иначе возвращает установленное)
         * @param {String} v присваиваемое значение.
         * @return {String} текущее значение
         */
        cmEmail: function(v)
        {
            if (typeof(v) !== 'undefined') {
                this._config.email = v;
                $(this._bodyList.email).html('Email: <a href="mailto:' + this._config.email + '" >' + this._config.email + '</a>');
            }
            return this._config.email;
        },
        /**
         * устанавливает время сообщения.
         * (если не передавать параметр вернет текущее значение иначе возвращает установленное)
         * @param {Date} v присваиваемое значение.
         * @return {Date} текущее значение
         */
        cmDate: function(v)
        {
            v = typeof(v) === 'string' ? new Date($.format.date(v, 'MM/dd/yyyy hh:mm:ss ')) : v;
            if (typeof(v) !== 'undefined') {
                this._config.date = v;

                //this._bodyList.date.innerHTML = '<nobr>Date Start: ' + this._config.date.getDate() +'.'+this._config.date.getMonth() +'.'+this._config.date.getYear()+'</nobr>';
                //this._bodyList.time.innerHTML = '<nobr>'+this._config.date.getHours() +':'+this._config.date.getMinutes() +':'+this._config.date.getSeconds()+'</nobr>';

                $(this._bodyList.date).html($.format.date(this._config.date, "dd.MM.yyyy"));
                ss = this._config.date.getSeconds();
                ss = ss < 10 ? '0' + ss : ss;
                $(this._bodyList.time).html($.format.date(this._config.date, "HH:mm:") + ss);
            }

            return this._config.date;
        }
    });
    _init();
    this._config.afterInit();
}