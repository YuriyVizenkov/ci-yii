(function ($) {
    $.format = (function () {

        var parseMonth = function (value) {
                       
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
        
        var parseTime = function (value) {
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
            date: function (value, format) {
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
var emptyFn = function(){}

//функция локализации месяца
function cortegeGetMonthName(n){
	r = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
	return r[n]; 
}
//Генерит строку со всеми параметрами 1 уровня объекта 
function cortegeRenderThreadConfPrintString(t, br){
	br = typeof(br) === 'undefined'?'\n':br;
	var result = '';
	for (var key in t._config) {
		result += key+':\t'+t._config[key]+ br+br;
	}
	return result;
}
//Функция служит для добавления эвентов, благодаря ей из тела эвента доступен сам объект {@link #_this} 
//т.е. this указывает на объек {@link #_this} 
function cortegeProxyBind(_this, events){
	if(typeof(_this)!=='object'||typeof(events)!=='object') return false;
	proxyEvents = {};
	for (var key in events) {
		_this['_eventFunction_'+key] = events[key];
		proxyEvents[key] = $.proxy(_this,'_eventFunction_'+key)
	}_this.bind(proxyEvents);
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
var messageTagFactory = function(_config){
	typeof(_config)==='undefined'?_config=[]:'';
	_this = this;
	var _html;
	this.mtf_items = [];
	function init(){
		$.each(_config, function(){
			this.jquery?
				_this.mtf_items.push(this):
				_this.mtf_items.push(new messageTag(this));
		});
		_this.mtf_render();
	}
	
	$.extend(this, {
		/**
		 * возвращает jQuery блок со всеми тегами.
		 * @return {jQuery}
		 */
		mtf_HTML:function(){return _html}, 
		/**
		 * Собирает по настройкам и возвращает jQuery блок с тегами.
		 * @return {jQuery}
		 */
		mtf_render: function(){
			_html = $('<div class="stat-icons"></div>');
			$.each(this.mtf_items, function(){
				_html.append(this);
			});
			return _html;
		}, 
		/**
		 * добавляет один элемент на основе объекта настроек или готового элемента {@link messageTag}
		 * @param {messageTag} t объект настроек или созданный элемент
		 * @return {messageTag} возвращает {@link messageTag}
		 */
		mtf_addTag:function(t){
			result = !t.jquery?new messageTag(t):t;
			this.mtf_items.push(result)
			_html.append (this.mtf_items[this.mtf_items.length-1]);
			return result;				
		}, 
		/**
		 * удаляет элемент по параметру, который моржет принимать 
		 * следующие значения:номер элемента, текст метки (удалит все с такой меткой), имя класса отображения (удалит все с таким классом)
		 * @param {Object} t
		 */
		mtf_delTag:function(t){
			if (typeof(t)==='number'){
				try {
					this.mtf_items[0].remove();
					this.mtf_items.splice(t,1);
				}catch (e){}
			}else{
				sIt = this.mtf_findTag(t);
				$.each(sIt, function(){
					var deletingItem = this;
					_this.mtf_items = $.grep(_this.mtf_items, function(value) {
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
		mtf_findTag:function(f){
			var result = [];
			f===''?f='noCSS':'';
			$.each(this.mtf_items, function(){
				if (this.css===f || this.text===f){
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
var messageTag = function(_config){
	var _this= this;
	/**
	 * конфиг
	 */
	this._config = {
		/**
		 * @cfg {String} text текст тэга
		 */
		text:	'ho',
		/**
		 * @cfg {String} css имя CSS класса для отображения
		 */ 
		css:	'noCSS',
		/**
		 * @cfg {String} style строка стиля для отображения
		 */ 
		style:	'', 
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
	function _init(){
		_this.mtRender();
		cortegeProxyBind(_this, _this._config.listeners);
	}
	// спариваем дефолтный и переданный конфиг
	$.extend(this._config, _config);
		
	$.extend(this,{
		/**
		 * Создает тэг по настройкам
		 * @return {jQuery} 
		 */
		mtRender: function(){
			//<div class="iconStatButton"><nobr>ho</nobr></div>
			_html =  $.extend(this, 
				$('<div class="iconStatButton"></div>').
					append(
						$('<nobr></nobr>')
						.html(this._config.text)
						.attr('style',this._config.style)
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
		mtText:function(v){
			if(typeof(v)!=='undefined'){
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
		mtCss:function(v){
			if(typeof(v)!=='undefined'){
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
		mtStyle:function(v){
			if(typeof(v)!=='undefined'){
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
var threadMark = function(_config){ 
	var _this = this;
	/**
	 * конфиг
	 */
	this._config = {
		/**
		 * @cfg {String} text Хинт который появляется при наведение
		 */
		text:	'',
		/**
		 * @cfg {String} type (по умолчанию star) тип-класс CSS отображения thread-mark-
		 */ 
		type:	'star',
		/**
		 * @cfg {String} css (по умолчанию black) класс являющийся подклассом type 
		 * (на данный момент принимат три значения: black, grey, yellow)
		 */ 
		css:	'black',
		/**
		 * @cfg {String} style строка стиля
		 */ 
		style:	'', 
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
	function _init(){
		_this.tmRender();
		cortegeProxyBind(_this, _this._config.listeners);
	}
	// спариваем дефолтный и переданный конфиг
	$.extend(this._config, _config);
		
	$.extend(this,{
		/**
		 * Создает элемент маркировки по настройкам
		 * @return {jQuery} 
		 */
		tmRender: function(){
			//<div class="cell thread-mark-star"><a href="#" class="gray"></a></div>
			$.extend(this, 
				$('<div name="mark" class="cell"></div>').
					append(
						$('<a href="#"></a>')
						.addClass(this._config.css)
						.attr('title', this._config.text)
					)
					.addClass('thread-mark-'+this._config.type)
					.attr('style',this._config.style)
					//фикса для оперы
					.css('padding-top', $.browser.opera?'10px':'0px')
			);
			this.markImageBody = _this.find('a');
			return this;
		}, 
		/**
		 * текст примечание маркировки (если не передавать параметр вернет текущее значение иначе возвращает установленное)
		 * @param {String} v значение параметра
		 * @return {String} текущее значение 
		 */
		tmText:function(v){
			if(typeof(v)!=='undefined'){
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
		tmType:function(v){
			if(typeof(v)!=='undefined'){
				this.removeClass(this._config.type); 
				this._config.type = v;
				this.addClass('thread-mark-'+v);
			}
			return this._config.type;
		},
		/**
		 * дополнительный css класс для отображения 
		 * (если не передавать параметр вернет текущее значение иначе возвращает установленное)
		 * @param {Object} v значение параметра
		 * @return {String} текущее значение
		 */
		tmCss:function(v){
			if(typeof(v)!=='undefined'){
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
		tmStyle:function(v){
			if(typeof(v)!=='undefined'){
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
var cortegeThreadsElement = function(_config){
	var _this = this;
	/**
	 * Объек фабрики тэгов {@link messageTag}
	 */
	this.tagsFactory = {};
	
	//функция фикса для полей с затемнением
	function fixByWbr(s){
		r='';
		for(i=0; i<s.length;i++){r+=s[i]+'<wbr/>';}
		return r;
	}
	//функция фикса для поля дайджест (советую не врубать если много элементов)
	this.digest_width_fix = function(){
		this._bodyList.digest.style.width = (this._bodyList.digest.parentNode.offsetWidth+100)+'px';
		//this._bodyList.digest.offsetWidth;
	}
	//функция инициализации элемента.
	function _init(){
		//$(window).resize($.proxy(_this,'digest_width_fix'));
		_this.tagsFactory = 
			$.isArray(_this._config.tags)? 
				new messageTagFactory(_this._config.tags):
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
		* @cfg {String} elemName имя элемента по которому кликнули (совпадает с именем переменной для настройки этого элемента (например имя tags соотвествует Элементу с тэгами)).
		* @cfg {jQuery} elem элемент по которому кликнули.
		*/ 
		click:emptyFn, 
		/**
		* @cfg {String} elemName имя элемента по которому дабл кликнули (совпадает с именем класса для рендеринга).
		* @cfg {jQuery} elem элемент по которому дабл кликнули.
		*/ 
		dblclick:emptyFn,
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
	this._clickRout = function(event){
		el = $(event.currentTarget);
		switch (event.type){
			case 'click':
				this._config.click(el.attr('name'), el)
			break;
			case 'dblclick':
				this._config.dblclick(el.attr('name'), el)
			break;
		}
	}
	this.markClick = function(e){markClickFlag=true; this._config.markClick(e);}	
	this.checkboxClick = function(e){checkboxClickFlag=true; this._config.checkboxClick(e);}
	this.onClick = function(e){
		if (markClickFlag){markClickFlag = false;return;} 
		if (checkboxClickFlag){checkboxClickFlag = false;return;}
		this._config.onClick(e);
	}
	$.extend(this,{
		/**
		 * отрисовка и создание всех элементов треда
		 * @return {cortegeThreadsElement} возвращает отрендерин класс 
		 */
		cteRender:function(){
			// создаем главный DIV контейнер
			_html = $('<div class="row"></div>');
        	_html.addClass(this._config.highlight);
			this._config.locked?_html.addClass('thread_locked'):''
			!this._config.isview?_html.addClass('notview'):''
			
			// добавляем checkbox
			_html.append(
				$('<div name="select" class="cell chk"></div>').append(
					$('<input type="checkbox"/>').removeAttr("checked")
					.change(function (){
						_this._config.select = this.checked;
					})
					.click($.proxy(this, 'checkboxClick'))
					)
			);
			
			// добавляем звездочку на основе threadMark
			_html.append(this.mark = new threadMark(this._config.mark).click($.proxy(this, 'markClick')));
			
			// добавляем от кого
			_html.append(
				$('<div name="from" class="cell from"></div>')
				.html('<div class="gDiv"></div> <p></p>')
			);
						
			// поле для стат иконок и заполняем его на основе priorityFactory
			_html.append(
				$('<div name="priority" class="cell icon"></div>')
				//.css({'min-width': '0','width': '0'})
				.append(this.priorityFactory.mtf_HTML())
				
			);
			// поле для стат иконок и заполняем его на основе assignFactory
			_html.append(
				$('<div name="noassign" class="cell icon"></div>')
				//.css({'min-width': '0','width': '0'})
				.append(this.assignFactory.mtf_HTML())
			);
			// поле для стат иконок и заполняем его на основе tagsFactory
			_html.append(
				$('<div name="tags" class="cell icon"></div>').
				append(this.tagsFactory.mtf_HTML())
			);
			
			// добавляем заголовок
			_html.append(
				$('<div name="title" class="cell caption"></div>')
				.html('<div class="gDiv"></div><p><nobr></nobr></p>')
				//.html('<p><nobr></nobr></p>')
			);
			// дайджест сообщения
			_html.append(
				$('<div name="digest" class="cell subject"></div>')
				.html('<div class="gDiv"></div> <p></p>')
			);
			
			//количество
			_html.append($('<div name="count" class="cell count">COUNT</div>'));
			//дата
			_html.append($('<div name="date" class="cell date">DATE</div>'));
									
			//вливаем объект jQuery в наш класс
			$.extend(this,_html);
			
			/**
			 * объект со ссылками на части-объекты треда
			 */
			this._bodyList = {
				mainDiv: 		this, 
				checkbox: 		$(_html.find('.cell.chk input')[0]), 
				from: 			_html.find('.cell.from p')[0],
				title: 			_html.find('.cell.caption p nobr')[0],
				digest: 		_html.find('.cell.subject p')[0],
				date:  			_html.find('.cell.date')[0], 
				count: 			_html.find('.cell.count')[0]
			};
			dbg01 = _html.find('>div');
			_html.find('>div')
				.click($.proxy(this, '_clickRout'))
				.dblclick($.proxy(this, '_clickRout'));
			return this;					
		}, 
		/**
		 * устанавливает идентификатор треда 
		 * (определяется сервером)(если не передавать параметр вернет текущее значение иначе возвращает установленное)
		 * @param {Object} v присваиваемое значение.
		 * @return {Object} текущее значение 
		 */
		cteThread_id: function(v){
			v?this._config.thread_id=v:''
			return this._config.thread_id;
		}, 
		/**
		 * устанавливает выбран ли тред(контрол checkbox)
		 * (если не передавать параметр вернет текущее значение иначе возвращает установленное)
		 * @param {boolean} v присваиваемое значение.
		 * @return {boolean} текущее значение 
		 */
		cteSelect: function(v){
			this._config.locked?v=false:'';
			if (typeof(v)==='boolean'){
				this._config.select=v;
				v?this._bodyList.checkbox.attr("checked","checked"):
				  this._bodyList.checkbox.removeAttr("checked");	
			}
			return this._config.select;
			
		},
		/**
		 * read-only пометка (объект класса {@link threadMark})
		 * @return {threadMark} текущее значение 
		 */ 
		cteMark: function(){return this.mark;},
		/**
		 * устанавливает флаг блокировки, если он равен true, свойство 
		 * highlight использует светлосерый цвет, и вся 
		 * линия отображается CSS классом .thread_locked
		 * (если не передавать параметр вернет текущее значение иначе возвращает установленное)
		 * @param {boolean} v присваиваемое значение.
		 * @return {boolean} текущее значение 
		 */ 
		cteLocked: function(v){
			if(typeof(v)==='boolean'){
				if(v){
					this.cteSelect(false);
					this.find('input').attr('disabled','disabled');
					this.addClass('thread_locked');
				}else{
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
		cteLocked_user: function(v){
			typeof(v)!=='undefined'?this._config.locked_user = v:'';
			return this._config.locked_user;
		},
		/**
		 * устанавливает флаг, который равен true, если сообщение просмотрено
		 * (если не передавать параметр вернет текущее значение иначе возвращает установленное)
		 * @param {boolean} v присваиваемое значение.
		 * @return {boolean} текущее значение 
		 */ 
		cteIsview: function(v){
			if(typeof(v)==='boolean'){
				this._config.isview=v;
				this._config.isview?
					this.removeClass('notview'):
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
		cteIsanswer: function(v){
			if(typeof(v)==='boolean'){
				this._config.isanswer=v;
				this._config.isanswer?
					this.removeClass('noanswer'):
					this.addClass('noanswer');
			}
			return this._config.isanswer;
		},
		/**
		 * устанавливает если сообщение не ассигновано
		 * (если не передавать параметр вернет текущее значение иначе возвращает установленное)
		 * @param {boolean} v присваиваемое значение.
		 * @return {boolean} текущее значение 
		 */ 
		cteNoassign: function(v){
			if(typeof(v)==='boolean' && this._config.isanswer!==v){
				this._config.noassign=v;
				v?
					this.assignFactory.mtf_addTag({text:'no asign'}):
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
		ctePriority: function(v){
			if (typeof(v=v*1) === 'number' && v <= 3 && v >= 0) {
				this.priorityFactory.mtf_delTag(0);	
				this._config.priority = v;
				priorityName = false;
				switch(v){
					case 1: priorityName = 'high';break;
					case 2: priorityName = 'critical';break;
					case 3: priorityName = 'blocked';break;
				}
				priorityName?
					this.priorityFactory.mtf_addTag({text:priorityName,css:priorityName}):'';
			}
			return this._config.priority;
		},
		/**
		 * устанавливает от кого сообщение.
		 * (если не передавать параметр вернет текущее значение иначе возвращает установленное)
		 * @param {String} v присваиваемое значение.
		 * @return {String} текущее значение 
		 */ 
 		cteFrom: function(v){
			if(typeof(v)!=='undefined'){
				this._config.from=v;
				$(this._bodyList.from).html(fixByWbr(this._config.from));
			}
			return this._config.from;
		},
		/**
		 * read-only  возвращает массив меток (метка – является объектом {@link messageTagFactory})
		 * для работы с тэгами используйте {@link #tagsFactory}
		 * @return {messageTagFactory} текущее значение 
		 */ 
		cteTags: function(v){return this.tagsFactory;},
		/**
		 * устанавливает тему сообщения.
		 * @param {String} v присваиваемое значение.
		 * @return {String} текущее значение 
		 */ 
		cteTitle: function(v){
			if (typeof(v)!=='undefined') {
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
		cteDigest: function(v){
			if (typeof(v)!=='undefined') {
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
		cteDate: function(v){
			v=typeof(v)==='string'? new Date($.format.date(v, 'MM/dd/yyyy hh:mm:ss ')):v;
			if(typeof(v)==='object'){
				this._config.date=v;
				$(this._bodyList.date).html(this._config.date.getDate()+' '+cortegeGetMonthName(this._config.date.getMonth()));
			}
			return this._config.date;
		},
		/**
		 * установка количество сообщений в треде.
		 * (если не передавать параметр вернет текущее значение иначе возвращает установленное)
		 * @param {number} v присваиваемое значение.
		 * @return {number} текущее значение 
		 */ 
		cteCount: function(v){
			if(typeof(v=v*1)==='number'){
				this._config.count=v;
				$(this._bodyList.count).html(this._config.count); 
			}
			return this._config.count;
		},
		/**
		 * установка имени CSS класс отображения треда.
		 * (если не передавать параметр вернет текущее значение иначе возвращает установленное)
		 * @param {String} v присваиваемое значение.
		 * @return {String} текущее значение 
		 */ 
		cteHighlight: function(v){
			if(typeof(v)==='string') {
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

&lt;div id="имя параметра"&gt; &lt;/div&gt; - все параметры оформляются так
&lt;div id="имя параметра"/&gt;&lt;/div&gt; - так оформляются параметры типа boolean если есть то true иначе false

Параметры сообщений(каждое конфиг треда закрывается в тег &lt;div class="cte_item"&gt;&lt;/div&gt;):

cte_thread_id		идентификатор треда (определяется сервером)
cte_select		выбор элемента (контрол checkbox)
cte_mark		пометка (объект класса {@link threadMark})
	text		текст или примечание маркировки
	type		тип маркировки (на данный момент всегда «star»). 
			Тип влияет на выбор основного CSS класса, название 
			которого пишется как: «.thread_mark_[type]».
	css		дополнительный css класс для отображения
	style		дополнительный стиль для отображения
cte_locked		флаг блокировки, если он равен true, свойство highlight 
			использует светлосерый цвет, и вся линия отображается 
			CSS классом .thread_locked
cte_locked_user 	указывает кто сейчас работает с тредом.
cte_isview 		флаг, который равен true, если сообщение просмотрено.
cte_isanswer 		флаг, если сообщение обработано.
cte_noassign 		если сообщение не ассигновано.
cte_priority 		приоритет сообщения (число от 0 до 3).
cte_from 		от кого сообщение.
cte_tags 		массив меток (метка – является объектом {@link messageTag})
	<i>каждый конфиг тэга закрывается в тег &lt;cte_icon&gt;&lt;/cte_icon&gt;</i>
	text 		текст метки.
	css 		CSS класс отображения метки
	style 		CSS стиль отображения метки
cte_title 		тема сообщения.
cte_digest 		дайджест сообщения.
cte_date 		дата сообщения.
cte_count 		количество сообщений в треде.
cte_highlight 		цвет подсветки.
</code></pre>
 
 * Пример HTML блока
 * <pre><code>
&lt;div id=&quot;cte_item&quot;&gt; 
	&lt;div id=&quot;cte_thread_id&quot;&gt;tID6754345&lt;/div&gt; 
	&lt;div id=&quot;cte_highlight&quot;&gt;myRow&lt;/div&gt;  
	&lt;div id=&quot;cte_select&quot;&gt;&lt;/div&gt; 
	&lt;div id=&quot;cte_mark&quot;&gt;  
		&lt;div id=&quot;type&quot;&gt;star&lt;/div&gt;  
		&lt;div id=&quot;text&quot;&gt;Hohoho&lt;/div&gt;  
		&lt;div id=&quot;css&quot;&gt;yellow&lt;/div&gt;  
	&lt;/div&gt;  
	&lt;div id=&quot;cte_from&quot;&gt;lalala&lt;/div&gt;  
	&lt;div id=&quot;cte_noassign&quot;&gt;&lt;/div&gt; 
	&lt;div id=&quot;cte_priority&quot;&gt;3&lt;/div&gt; 
	&lt;div id=&quot;cte_tags&quot;&gt;  
		&lt;div id=&quot;cte_icon&quot;&gt;  
			&lt;div id=&quot;text&quot;&gt;ower download&lt;/div&gt;  
			&lt;div id=&quot;css&quot;&gt;myDesign&lt;/div&gt;  
			&lt;div id=&quot;style&quot;&gt;border:1px solid #F00;&lt;/div&gt;  
		&lt;/div&gt;  
		&lt;div id=&quot;cte_icon&quot;&gt;  
			&lt;div id=&quot;text&quot;&gt;no login&lt;/div&gt;  
			&lt;div id=&quot;css&quot;&gt;nologin&lt;/div&gt;  
		&lt;/div&gt; 
	&lt;/div&gt; 
	&lt;div id=&quot;cte_title&quot;&gt;Это сообщение сгенерировано из HTML&lt;/div&gt; 
	&lt;div id=&quot;cte_digest&quot;&gt;Тема сообщения или просто дайджест&lt;/div&gt; 
	&lt;div id=&quot;cte_count&quot;&gt;13&lt;/div&gt; 
	&lt;div id=&quot;cte_date&quot;&gt;12/7/1990&lt;/div&gt; 
&lt;/div&gt;
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
var cortegeThreads = function(_config){
	var _this = this;
	//функция инициализации элемента.
	function _init(){
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
	$.extend(this,{
		/**
		 * отрисовка созданых элементов контрола
		 * @return {cortegeThreads} возвращает класс с отрендеренными компонентами 
		 */
		ctRender:function(){
			if($(this._config.renderTo).html() === ''){
				$.extend(this,$('<div class="jq-cortege threads"></div>'));
				var def = this._config.defaultItem;
				$.each(this._config.items,function(){
					_this.ctAdd(_this.ctNew_element(this));
				});
				return this;		
			}else{
				$(this._config.renderTo).find('>div#cte_item').each(function(){
					_cortegeThreadsItemConf = {};
					//thread_id
					if ((c = $(this).find('div#cte_thread_id')).length) {
						_cortegeThreadsItemConf['thread_id'] = c.html();
					}
					//locked
					_cortegeThreadsItemConf['locked'] = 
						$(this).find('div#cte_locked').length?true:false;
					//locked_user
					if ((c = $(this).find('div#cte_locked_user')).length) {
						_cortegeThreadsItemConf['locked_user'] = c.html();
					}
					//isview
					_cortegeThreadsItemConf['isview'] = 
						$(this).find('div#cte_isview').length?true:false;
					//isanswer
					_cortegeThreadsItemConf['isanswer'] = 
						$(this).find('div#cte_isanswer').length?true:false;
					//highlight
					if ((c = $(this).find('div#cte_highlight')).length) {
						_cortegeThreadsItemConf['highlight'] = c.html();
					}
					//select
					_cortegeThreadsItemConf['select'] = 
						$(this).find('div#cte_select').length?true:false;
					//mark
					if ((c = $(this).find('div#cte_mark')).length) {
						_cortegeThreadsItemConf['mark'] = {};
						_cortegeThreadsItemConf['mark']['type'] = (b = c.find('div#type')).length ? b.html() : '';
						_cortegeThreadsItemConf['mark']['text'] = (b = c.find('div#text')).length ? b.html() : '';
						_cortegeThreadsItemConf['mark']['css'] = (b = c.find('div#css')).length ? b.html() : '';
						_cortegeThreadsItemConf['mark']['style'] = (b = c.find('div#css')).length ? b.html() : '';
					}
					//from
					if ((c = $(this).find('div#cte_from')).length) {
						_cortegeThreadsItemConf['from'] = c.html();
					}
					//noassign
					_cortegeThreadsItemConf['noassign'] = 
						$(this).find('div#cte_noassign').length?true:false;
					//priority
					if ((c = $(this).find('div#cte_priority')).length) {
						_cortegeThreadsItemConf['priority'] = c.html();
					}
					//tags
					if ((c = $(this).find('div#cte_tags')).length) {
						var a = [];
						(d=c.find('div#cte_icon')).length?
							d.each(function(){
								statItem = {};
								(b = $(this).find('div#text')).length ? statItem['text'] = b.html() : '';
								(b = $(this).find('div#css')).length ? statItem['css'] = b.html() : '';
								(b = $(this).find('div#style')).length ? statItem['style'] = b.html() : '';
								a.push(statItem);
							}):'';
						_cortegeThreadsItemConf['tags'] = a;
					}
					//title
					if ((c = $(this).find('div#cte_title')).length) {
						_cortegeThreadsItemConf['title'] = c.html();
					}
					//digest
					if ((c = $(this).find('div#cte_digest')).length) {
						_cortegeThreadsItemConf['digest'] = c.html();
					}
					//count
					if ((c = $(this).find('div#cte_count')).length) {
						_cortegeThreadsItemConf['count'] = c.html();
					}
					//date
					if ((c = $(this).find('div#cte_date')).length) {
						_cortegeThreadsItemConf['date'] = c.html();
					}
					_this._config.items.push(_cortegeThreadsItemConf);					
				});
				$(this._config.renderTo).html('');
				this.ctRender();
			}
		}, 
		/**
		 * Метод добавляет в список новую строку (тред) Thread – объект класса {@link cortegeThreadsElement}, 
		 * либо false. В случае если параметр не определён (false), метод сам создаёт объект 
		 * {@link cortegeThreadsElement} при помощи параметра {@link #defaultItem}.
		 * @param {cortegeThreadsElement} thread объект {@link cortegeThreadsElement}
		 * @return {cortegeThreadsElement} метод возвращает объект {@link cortegeThreadsElement}, который вставлен, либо false в случае неудачи.
		 */
		ctAdd: function(thread){
			typeof(thread)==='undefined'?thread=false:'';
			typeof(thread) === 'object'?result = thread:'';
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
		ctDel: function(pos){
			typeof(pos)==='undefined'?pos=-1:'';
			if(pos>this.ctLength()||this.ctLength()==0) return false;
			pos = 
				pos>=0?
					pos:
					this.ctLength()+pos;
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
		ctNew_element:function(props, addDef){
			typeof(addDef)==='undefined'?addDef=true:'';
			var _frondEndConf = {};
			_frondEndConf = addDef?$.extend(true,_frondEndConf,this._config.defaultItem,props):props;
			result = typeof(_frondEndConf)!=='undefined'?
				new cortegeThreadsElement(_frondEndConf):false;
			return result;
		},
		/**
		 * Метод возвращает кол-во строк.
		 * @return {number} количество строк в кортеже.
		 */ 
		ctLength:function(){
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
var cortegeMessagesElement = function(_config){
	var _this = this;
	/**
	 * Объек фабрики тэгов {@link messageTag}
	 */
	this.tagsFactory = {};
	//функция открытия закрытия одного элемента гармошки 
	this._slide = function(){
		if (!this._config._mini) {
			if (this._config.trafficEconom) {
				if (!this._config.loadMsgBody(this)) {
					return true;
				}
			}
			this.cmeSelect(!this._config.select)
		}
	}; 
	//высчитываем сколько времени прошло
	function mathTimeAgo(){
		_this._config.time_ago = Math.floor((new Date()-_this._config.date)/1000);  
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
		$(_this._bodyList.time_ago).html(result);
	}
	//функция фикса для полей с затемнением
	function fixByWbr(s){
		r='';
		for(i=0; i<s.length;i++){r+=s[i]+'<wbr/>';}
		return r;
	}
	//функция инициализации элемента.
	function _init(){
		_this.tagsFactory = 
			$.isArray(_this._config.tags)? 
				new messageTagFactory(_this._config.tags):
				_this._config.tags;
		_this.priorityFactory = new messageTagFactory();
		_this.assignFactory = new messageTagFactory();
		_this.cmeRender();
		$(_this._bodyList.header).click($.proxy(_this, '_slide'));
		//дорисовываем
		_this.cmeSelect(_this._config.select);
		_this.cmeNoassign(_this._config.noassign);
		_this.cmePriority(_this._config.priority);
		_this.cmeFrom(_this._config.from);
		_this.cmeTitle(_this._config.title);
		_this.cmeDigest(_this._config.digest);
		_this.cmeDate(_this._config.date);
		_this.cmeStatus(_this._config.status);
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
		loadMsgBody: function(){return true}, 
		/**
		* @cfg {String} highlight – цвет подсветки.
		*/
		highlight: '',
		/**
		* @cfg {String} status – текст иконки статуса сообщения.
		*/
		status: '',
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
		
	$.extend(this,{
		/**
		 * отрисовка и создание всех элементов треда
		 * @return {cortegeThreadsElement} возвращает отрендерин класс 
		 */
		cmeRender:function(){
			// создаем головной DIV контейнер
			_html = $('<div class="row"></div>');
        	
			// добавляем от кого
			_html.append(
				$('<div class="cell from"></div>')
				.html('<div class="gDiv"></div> <p></p>')
			);
						
			// поле для стат иконок и заполняем его на основе priorityFactory
			_html.append(
				$('<div class="cell icon"></div>')
				//.css({'min-width': '0','width': '0'})
				.append(this.priorityFactory.mtf_HTML())
				
			);
			// поле для стат иконок и заполняем его на основе assignFactory
			_html.append(
				$('<div class="cell icon"></div>')
				//.css({'min-width': '0','width': '0'})
				.append(this.assignFactory.mtf_HTML())
			);
			// поле для стат иконок и заполняем его на основе tagsFactory
			_html.append(
				$('<div class="cell icon"></div>').
				append(this.tagsFactory.mtf_HTML())
			);
			
			// добавляем заголовок
			_html.append(
				$('<div class="cell caption"></div>')
				.html('<div class="gDiv"></div><p><nobr></nobr></p>')
			);
			
			// дайджест сообщения
			_html.append(
				$('<div class="cell subject"></div>')
				.html('<div class="gDiv"></div> <p></p>')
			);
			
			//дата
			_html.append($('<div class="cell t date">date</div>'));
			//времени прошло
			_html.append($('<div class="cell t time_ago">time_ago</div>'));
			//статус сообщения
			_html.append($('<div class="cell status">Q</div><div class="cell fill"></div>'))
						
			_html = $('<p></p>')
				.append(
					$('<div class="message-header"></div>')
					.addClass(_this._config.highlight)
					.append(_html)
				)
				.append(
					$('<div class="message-body">'+this._config.body+'<div class="ans" id="id' + this._config.message_id + '"></div></div>')
					.addClass(_this._config.highlight)
				);
			
			//вливаем объект jQuery в наш класс
			$.extend(this,_html);
			/**
			 * объект со ссылками на части-объекты мессаги
			 */
			this._bodyList = {
				mainDiv: 		this, 
				header:			_html.find('.message-header')[0],
				from: 			_html.find('.cell.from p')[0],
				title: 			_html.find('.cell.caption p nobr')[0],
				digest: 		_html.find('.cell.subject p')[0], 
				body: 			_html.find('.message-body')[0], 
				date:			_html.find('.cell.date')[0],
				time_ago:		_html.find('.cell.time_ago')[0], 
				status: 		_html.find('.cell.status')[0] 
			};
			this._config._mini?this.cmeSelect(false):'';
			return this;					
		}, 
		/**
		 * устанавливает идентификатор сообщения 
		 * (определяется сервером)(если не передавать параметр вернет текущее значение иначе возвращает установленное)
		 * @param {Object} v присваиваемое значение.
		 * @return {Object} текущее значение 
		 */
		cmeMessage_id: function(v){
			v?this._config.message_id=v:''
			return this._config.message_id;
		}, 
		/**
		 * устанавливает выбрано ли сообщение(распахнуто иль нет)
		 * (если не передавать параметр вернет текущее значение иначе возвращает установленное)
		 * @param {boolean} v присваиваемое значение.
		 * @return {boolean} текущее значение 
		 */
		cmeSelect: function(v){
			if (typeof(v)==='boolean'){
				this._config.select=v;
				if(v){
					this._bodyList.body.style.display = 'block';
					this._bodyList.header.style.borderBottomWidth = '';
				}else{
					this._bodyList.body.style.display = 'none';	
					this._bodyList.header.style.borderBottomWidth = '1px';
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
		cmeNoassign: function(v){
			if(typeof(v)==='boolean' && this._config.isanswer!==v){
				this._config.noassign=v;
				v?
					this.assignFactory.mtf_addTag({text:'no asign'}):
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
		cmePriority: function(v){
			if (typeof(v=v*1) === 'number' && v <= 3 && v >= 0) {
				this.priorityFactory.mtf_delTag(0);	
				this._config.priority = v;
				priorityName = false;
				switch(v){
					case 1: priorityName = 'high';break;
					case 2: priorityName = 'critical';break;
					case 3: priorityName = 'blocked';break;
				}
				priorityName?
					this.priorityFactory.mtf_addTag({text:priorityName,css:priorityName}):'';
			}
			return this._config.priority;
		},
		/**
		 * устанавливает от кого сообщение.
		 * (если не передавать параметр вернет текущее значение иначе возвращает установленное)
		 * @param {String} v присваиваемое значение.
		 * @return {String} текущее значение 
		 */ 
 		cmeFrom: function(v){
			if(typeof(v)!=='undefined'){
				this._config.from=v;
				$(this._bodyList.from).html(fixByWbr(this._config.from));
			}
			return this._config.from;
		},
		/**
		 * read-only  возвращает массив меток (метка – является объектом {@link messageTagFactory})
		 * для работы с тэгами используйте {@link #tagsFactory}
		 * @return {messageTagFactory} текущее значение 
		 */ 
		cmeTags: function(v){return this.tagsFactory;},
		/**
		 * устанавливает тему сообщения.
		 * (если не передавать параметр вернет текущее значение иначе возвращает установленное)
		 * @param {String} v присваиваемое значение.
		 * @return {String} текущее значение 
		 */ 
		cmeTitle: function(v){
			if (typeof(v)!=='undefined') {
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
		cmeDigest: function(v){
			if (typeof(v)!=='undefined') {
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
		cmeDate: function(v){
			v=typeof(v)==='string'?new Date($.format.date(v, 'MM/dd/yyyy hh:mm:ss ')):v;
			if(typeof(v)==='object'){
				this._config.date=v;
				$(this._bodyList.date).html(
					'<nobr>'+this._config.date.getDate()+' '
					+cortegeGetMonthName(this._config.date.getMonth())+'</nobr>'
				);
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
		cteHighlight: function(v){
			if(typeof(v)==='string') {
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
		cmeBody: function(v){ 
			if (typeof(v)!=='undefined') {
				this._config.body = v;
				$(this._bodyList.body).html(this._config.body); //fixByWbr(this._config.title); 
			}
			return this._config.body;
		},
		/**
		 * устанавливает статус сообщения.
		 * (если не передавать параметр вернет текущее значение иначе возвращает установленное)
		 * @param {String} v присваиваемое значение.
		 * @return {String} текущее значение 
		 */ 
		cmeStatus: function(v){ 
			if (typeof(v)!=='undefined') {
				this._config.status = v;
				$(this._bodyList.status).html(this._config.status);
				(v=='')?
					$(this._bodyList.status).removeClass('status'):
					$(this._bodyList.status).addClass('status');
			}
			return this._config.status;
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
	order_id	ID 
	email		Email
	date 		дата

Параметры сообщений(каждый конфиг месаджа закрывается в тег &lt;cme_item&gt;&lt;/cme_item&gt;):
	cme_message_id	идентификатор сообщения
	cme_select	выбор элемента (влияет на то, распахнуто сообщение или нет)
	cme_from	от кого сообщение.
	cme_noassign 	если сообщение не ассигновано.
	cme_priority 	приоритет сообщения (число от 0 до 3).
	cme_tags 	массив меток (метка – является объектом {@link messageTag})
		<i>каждый конфиг тэга закрывается в тег &lt;cte_icon&gt;&lt;/cte_icon&gt;</i>
		text 	текст метки.
		css 	CSS класс отображения метки
		style 	CSS стиль отображения метки
	cme_title 	тема сообщения.
	cme_digest 	дайджест сообщения.
	cme_body тело сообщения
	cme_date 	дата сообщения.
	cme_time_ago 	сколько прошло времени с момента написания сообщения.
	cme_highlight 	цвет подсветки.

</code></pre> 
 * Пример HTML блока
 * <pre><code>
&lt;div id=&quot;cm_head&quot;&gt;
	&lt;div id=&quot;order_id&quot;&gt;SM 6545476548664&lt;/div&gt;
	&lt;div id=&quot;email&quot;&gt;lenfer.spb@gmail.com&lt;/div&gt;
	&lt;div id=&quot;date&quot;&gt;11/13/2010 3:00:00&lt;/div&gt;
&lt;/div&gt; 
&lt;div id=&quot;cme_item&quot;&gt;
	&lt;div id=&quot;cme_message_id&quot;&gt;ID_133&lt;/div&gt;
	&lt;div id=&quot;cme_select&quot;&gt; &lt;/div&gt;
	&lt;div id=&quot;cme_from&quot;&gt;От первого юзвера&lt;/div&gt; 
	&lt;div id=&quot;cme_noassign&quot;&gt; &lt;/div&gt;
	&lt;div id=&quot;cme_priority&quot;&gt;3&lt;/div&gt; 
	&lt;div id=&quot;cme_tags&quot;&gt; 
		&lt;div id=&quot;cme_icon&quot;&gt; 
			&lt;div id=&quot;text&quot;&gt;ower download&lt;/div&gt; 
			&lt;div id=&quot;css&quot;&gt;myDesign&lt;/div&gt;
			&lt;div id=&quot;style&quot;&gt;border:1px solid #F00;&lt;/div&gt;
		&lt;/div&gt;
		&lt;div id=&quot;cme_icon&quot;&gt;
			&lt;div id=&quot;text&quot;&gt;no login&lt;/div&gt;
			&lt;div id=&quot;css&quot;&gt;nologin&lt;/div&gt;
		&lt;/div&gt;
	&lt;/div&gt; 
	&lt;div id=&quot;cme_title&quot;&gt;Это сгенерирговано из HTML блока!&lt;/div&gt; 
	&lt;div id=&quot;cme_digest&quot;&gt;Раз два три&lt;/div&gt; 
	&lt;div id=&quot;cme_date&quot;&gt;11/13/2010 3:32:00&lt;/div&gt; 
	&lt;div id=&quot;cme_highlight&quot;&gt;selected&lt;/div&gt; 
	&lt;div id=&quot;cme_body&quot;&gt;Some text here&lt;/div&gt;
&lt;/div&gt; 
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
var cortegeMessages = function(_config){
	var _this = this;
	// последний в mini
	var lastMiniNum = 0; 
	// первый в main
	var firstMainNum = 0;
	//функция убирает сжатость гармошки 
	this.setFullStyle = function(){
		var i=0;
		for(var i = this.cmLength()-this._config.nonHiddenMax; i>=0; i--){
			_this.cmItems[i]._config._mini = false;
			_this._bodyList.mainSide.prepend(_this.cmItems[i]);
		}
		lastMiniNum=firstMainNum=0
	}
	//функция сжимает гармошку
	//функция инициализации элемента.
	function _init(){
		_this.cmRender();
		$(_this._config.renderTo).append(_this);
		_this.cmOrder_id(_this._config.order_id);
		_this.cmEmail(_this._config.email);
		_this.cmDate(_this._config.date);
		_this.cmStatus(_this._config.status);
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
		 * @cfg {string} status Статус сообщения 
		 */
		status:'Q',
		/**
		 * @cfg {Array} items список элементов {@link cortegeMessagesElement} может состоять как из объектов настргоек так и из откомпелированных объектов.
		 */
		items:[], 
		/**
		 * @cfg {Number} nonHiddenMax (по умолчанию 10)максиммальное количество элементов в контроле когда показывается нормальный вариант, как только элементов становиться больше гармошка превращается в мини  
		 */
		nonHiddenMax:10,
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
		listeners:{}	
	}
	// спариваем дефолтный и переданный конфиг
	$.extend(this._config, _config);
	/**
	 * Список тредов {@link cortegeThreadsElement}
	 */
	this.cmItems = [];
	$.extend(this,{
		/**
		 * отрисовка созданых элементов контрола
		 * @return {cortegeMessages} возвращает класс с отрендеренными компонентами 
		 */
		cmRender:function(){
			if($(this._config.renderTo).html() === ''){
				$.extend(this,$('<div class="jq-cortege message"></div>'));
				
				this.append(
					$('<div class="row thread-header">')
					.append($('<div class="cell ID">Order ID: SM 9997987234732</div>'))
                	.append($('<div class="cell email">Email: subteach@mast.com</div>'))
                	.append($('<div class="cell date">Date Start: 2010.09.10</div>'))
					.append($('<div class="cell time">15:02:03</div>'))
					.append($('<div class="cell status">Q</div><div class="cell fill"></div>'))	
				);
				/**
			 	* объект со ссылками на части-объекты контрола
			 	*/
				this._bodyList = {
					mainDiv: 		this, 
					order_id:		this.find('.thread-header .cell.ID')[0],
					email: 			this.find('.thread-header .cell.email')[0],
					date: 			this.find('.thread-header .cell.date')[0], 
					time: 			this.find('.thread-header .cell.time')[0], 
					status: 		this.find('.thread-header .cell.status')[0]
				};
				
				// спрятанный STATUS
				$(this._bodyList.status).remove();
				
				this.append(this._bodyList.miniSide = $('<div class="mini-side"></div>'));
				this._bodyList.miniSide.click($.proxy(this, 'setFullStyle'));
				this.append(this._bodyList.mainSide = $('<div class="main-side"><div id="ans"></div></div>'));
				
				$.each(this._config.items,function(){
					_this.cmAdd(_this.cmNew_element(this));
				});
				return this;		
			}else{
				//head
				if ((c = $(this._config.renderTo).find('div#cm_head')).length) {
					(b = $(c).find('div#order_id')).length?this._config['order_id'] = b.html() : '';
					(b = $(c).find('div#email')).length?this._config['email'] = b.html() : '';
					(b = $(c).find('div#date')).length?this._config['date'] = b.html() : '';
					(b = $(c).find('div#status')).length?this._config['status'] = b.html() : '   nmnkjkjkj';
				}
				$(this._config.renderTo).find('>div#cme_item').each(function(){
					_cortegeMessagesItemConf = {};
					//message_id
					if ((c = $(this).find('div#cme_message_id')).length) {
						_cortegeMessagesItemConf['message_id'] = c.html();
					}
					//highlight
					if ((c = $(this).find('div#cme_highlight')).length) {
						_cortegeMessagesItemConf['highlight'] = c.html();
					}
					//select
					_cortegeMessagesItemConf['select'] = 
						$(this).find('div#cme_select').length?true:false;
					//from
					if ((c = $(this).find('div#cme_from')).length) {
						_cortegeMessagesItemConf['from'] = c.html();
					}
					//noassign
					_cortegeMessagesItemConf['noassign'] = 
						$(this).find('div#cme_noassign').length?true:false;
					//priority
					if ((c = $(this).find('div#cme_priority')).length) {
						_cortegeMessagesItemConf['priority'] = c.html();
					}
					//tags
					if ((c = $(this).find('div#cme_tags')).length) {
						var a = [];
						(d=c.find('div#cme_icon')).length?
							d.each(function(){
								statItem = {};
								(b = $(this).find('div#text')).length ? statItem['text'] = b.html() : '';
								(b = $(this).find('div#css')).length ? statItem['css'] = b.html() : '';
								(b = $(this).find('div#style')).length ? statItem['style'] = b.html() : '';
								a.push(statItem);
							}):'';
						_cortegeMessagesItemConf['tags'] = a;
					}
					//title
					if ((c = $(this).find('div#cme_title')).length) {
						_cortegeMessagesItemConf['title'] = c.html();
					}
					//body
					if ((c = $(this).find('div#cme_body')).length) {
						_cortegeMessagesItemConf['body'] = c.html();
					}
					//digest
					if ((c = $(this).find('div#cme_digest')).length) {
						_cortegeMessagesItemConf['digest'] = c.html();
					}
					//date
					if ((c = $(this).find('div#cme_date')).length) {
						_cortegeMessagesItemConf['date'] = c.html();
					}
					//status
					if ((c = $(this).find('div#cme_state')).length) {
						_cortegeMessagesItemConf['status'] = c.html();
					}
					_this._config.items.push(_cortegeMessagesItemConf);					
				});
				$(this._config.renderTo).html('');
				this.cmRender();
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
		cmAdd: function(msg){
			typeof(msg)==='undefined'?msg=false:'';
			typeof(msg)==='object'?result = msg:'';
						
			this.cmItems.push(result);
			
			if (this.cmLength() > this._config.nonHiddenMax) {
				this.cmItems[lastMiniNum=firstMainNum]._config._mini = true;
				this.cmItems[lastMiniNum].cmeSelect(false);
				this._bodyList.miniSide.append(this.cmItems[firstMainNum++]);
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
		cmDel: function(pos){
			typeof(pos)==='undefined'?pos=-1:'';
			if(pos>this.cmLength()||this.cmLength()==0) return false;
			pos = 
				pos>=0?
					pos:
					this.cmLength()+pos;
			
			this.cmItems[pos].remove();
			if(!this.cmItems[pos]._config._mini){
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
		cmNew_element:function(props, addDef){
			typeof(addDef)==='undefined'?addDef=true:'';
			var _frondEndConf = {};
			_frondEndConf = addDef?$.extend(true,_frondEndConf,this._config.defaultItem,props):props;
			result = typeof(_frondEndConf)!=='undefined'?
				new cortegeMessagesElement(_frondEndConf):false;
			return result;
		},
		/**
		 * Метод возвращает кол-во строк.
		 * @return {number} количество строк в кортеже.
		 */ 
		cmLength:function(){
			return this.cmItems.length;	
		}, 
		/**
		 * устанавливает ID сообщения.
		 * (если не передавать параметр вернет текущее значение иначе возвращает установленное)
		 * @param {Object} v присваиваемое значение.
		 * @return {Object} текущее значение 
		 */ 
 		cmOrder_id: function(v){
			if(typeof(v)!=='undefined'){
				this._config.order_id=v;
				$(this._bodyList.order_id).html('Order ID: '+this._config.order_id);
			}
			return this._config.order_id;
		},
		/**
		 * устанавливает e-mail отправителя.
		 * (если не передавать параметр вернет текущее значение иначе возвращает установленное)
		 * @param {String} v присваиваемое значение.
		 * @return {String} текущее значение 
		 */ 
 		cmEmail: function(v){
			if(typeof(v)!=='undefined'){
				this._config.email=v;
				$(this._bodyList.email).html('Email: <a href="mailto:'+this._config.email+'" >'+this._config.email + '</a>');
			}
			return this._config.email;
		},
		/**
		 * устанавливает время сообщения.
		 * (если не передавать параметр вернет текущее значение иначе возвращает установленное)
		 * @param {Date} v присваиваемое значение.
		 * @return {Date} текущее значение 
		 */ 
 		cmDate: function(v){
			v=typeof(v)==='string'?new Date($.format.date(v, 'MM/dd/yyyy hh:mm:ss ')):v;
			if(typeof(v)!=='undefined'){
				this._config.date=v;
				
				//this._bodyList.date.innerHTML = '<nobr>Date Start: ' + this._config.date.getDate() +'.'+this._config.date.getMonth() +'.'+this._config.date.getYear()+'</nobr>';
				//this._bodyList.time.innerHTML = '<nobr>'+this._config.date.getHours() +':'+this._config.date.getMinutes() +':'+this._config.date.getSeconds()+'</nobr>';
				
				$(this._bodyList.date).html($.format.date(this._config.date,"dd.MM.yyyy"));
				ss=this._config.date.getSeconds();
				ss=ss<10?'0'+ss:ss;
				$(this._bodyList.time).html($.format.date(this._config.date,"HH:mm:")+ss);
			}
			return this._config.date;
		},
		/**
		 * устанавливает текст иконки статуса сообщения.
		 * (если не передавать параметр вернет текущее значение иначе возвращает установленное)
		 * @param {String} v присваиваемое значение.
		 * @return {String} текущее значение 
		 */ 
 		cmStatus: function(v){
			if(typeof(v)!=='undefined'){
				this._config.date=v;
				$(this._bodyList.status).html(v);
			}
			return this._config.status;
		}  
	});
	_init();
	this._config.afterInit();
}