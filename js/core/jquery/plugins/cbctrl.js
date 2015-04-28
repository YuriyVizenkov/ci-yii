/**
 * @class gCBCtrl
 * Это класс контрол чекбокса аля gmail
 * <p>Пример:</p>
 <pre><code>
new gCBCtrl({
	renderTo: '#debug', 
	actionList: [
		{name: 'Все', type: 'all'},
		{name: 'Ни одного', type: 'nothing'},
		{name: 'Прочитанные', type: 'isread'},
		{name: 'Не прочитанные', type: 'notread'},
		{name: 'Просмотренные', type: 'isview'},
		{name: 'Не просмотренные', type: 'notview'},
	], 
	delegition: function(n, t){
		alert(n,t)
	}, 
	check: function(flag){
		alert(flag)
	}
})  
 </code></pre>
 * @constructor
 * Создать новый объект.
 * @param {Object} _config объект настроек.
 * @return {gCBCtrl} возвращает объект
 */
function gCBCtrl(_config){
	var $this = this
	// показать меню
	function _show(e){
		if(e.target.name=='select_threads') return;
		if ($this._domList.ctrl.hasClass('kdown')) return true
		$this._domList.ctrl.addClass('kdown')
		$this._domList.menu.slideDown('fast')
		return false;
	}
	//скрыть меню
	function _hide(e){
		$this._domList.ctrl.removeClass('kdown')
		$this._domList.menu.slideUp('fast')
	}
	// клик по элементу меню
	function _menuClick(e){
		if(e.target.tagName == 'LI'){
			var $ul= $(e.target)
			$this._config.delegition($ul.html(), $ul.attr('date-type'))
		}
	}
	//Объявление дефолтного конфига
	this._config = {
		renderTo: 'body', 
		actionList: [], 
		check: function(flag){}, 
		delegition: function(name, type){return fasle}
	}
	// Слияние дефотного и переданного при создании
	$.extend(this._config, _config)
	// Объявление методов класса
	$.extend(this,{
		/**
		 * Функция отрисовки 
		 * @return {bool} возращает TRUE если все ОК 
		 */
		gcbRender: function(){
			// создаем меню
			var $ul = $('<ul class="cb-ctrl-sd-menu"></ul>')
			var menuItems = '';
			$.each(this._config.actionList, function(){
				menuItems += 
					'<li class="cb-ctrl-sd-item" date-type="'+
					this.type+
					'">'+
					this.name+
					'</li>'
			})
			$ul.html(menuItems).click(_menuClick)
			var $menu = $('<div class="cb-ctrl-slide-down-layer"></div>').append($ul)
			var innerC, input, arrow
			var ctrl = $('<div class="cb-ctrl"></div>').append(
				innerC = $('<div class="cb-ctrl-main"></div>')
					.append(
						input = 
							$('<input type="checkbox" name="select_threads" class="cb-ctrl-select-threads">')
							.click(this.selectAll), 
						arrow = $('<span class="cb-ctrl-arrow">&nbsp;&nbsp;</span>')
					).click(_show), 
				$menu
			)
			$.extend(this, ctrl);
			$(this._config.renderTo).append(this);
			this._domList = {
				menu: $menu, 
				ctrl: innerC, 
				checkbox: input, 
				arrow:  arrow	
			}
		}, 
		/**
		 * Функция выбрать все!
		 */
		selectAll: function(e){
			$this._config.check($this._domList.checkbox.attr('checked'))
		}
	})
	//Инициализация и создание объекта 
	this.gcbRender()
	$(document).click(_hide)
	return this;
}