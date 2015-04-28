/**
 * @class glAnswerBtnCtrl
 * Это класс контрол кнопка ответить аля gmail
 * <p>Пример:</p>
 <pre><code>
 new glAnswerBtnCtrl({
 renderTo: '#debug',
 menuList: [
 {name: 'Ответить', type: 'answer'},
 {name: 'В обработанные', type: 'incompil'}
 ],
 delegition: function(n, t){
 alert(n,t)
 },
 answerClick: function(){
 alert('Answer action')
 }
 })
 </code></pre>
 * @constructor
 * Создать новый объект.
 * @param {Object} config объект настроек.
 * @return {glAnswerBtnCtrl} возвращает объект
 */
function glAnswerBtnCtrl(config)
{
    var $this = this

    // показать меню
    function _show(e)
    {
        $this._domList.menu.fadeIn('fast')
        return false;
    }

    //скрыть меню
    function _hide(e)
    {
        $this._domList.menu.fadeOut('fast')
        return false;
    }

    /**
     * Функция принимает список объектов, которые могут закрывать верхнее меню при клике на сам объект
     * @param list
     */
    this.listObjectHideMenu = function(list)
    {
        $.each(list, function(index, value)
        {
            value.click(_hide)
        });
    }

    /**
     * Функция непосредственно является интерфейсом класса и при вызове закрывает ферхнее меню
     * @param e
     */
    this.hideMenu = function(e)
    {
        _hide(e)
    }

    // клик по элементу меню
    function _click(e)
    {
        if (e.target.tagName == 'LI') {
            var $ul = $(e.target)
            $this._config.delegition($ul.html(), $ul.attr('date-type'))
        }
    }

    function _answerClick(e)
    {
        _hide(e)
        config.answerClick(e)
        return false;
    }

    //Объявление дефолтного конфига
    this._config = {
        renderTo: 'body',
        menuList: [],
        delegation: function(name, type)
        {
            return false
        },
        answerClick: function()
        {
        }
    }

    // Слияние дефотного и переданного при создании
    $.extend(this._config, config)
    config = this._config
    // Объявление методов класса
    $.extend(this, {
        /**
         * Функция отрисовки
         * @return {bool} возращает TRUE если все ОК
         */
        gcbRender: function()
        {
            var $menu = $('<div class="glabCtrl-menu-layer"></div>');

            // Если сообщение отправлено с ошибкой, выводим дату
            if(config.data['send_state'] == 'error')
            {
                var date = config.data['date_sent'].split(' ');
                var ctrl = $('<div class="glabCtrl"></div>').append(
                            button = $('<div class="glabCtrl-cap">' + date[0] + '</div>'),
                            $menu
                        )

                // Задаём цвет для текста, если существует в пользовательской конфигурации
                if(typeof $.conf['u_cfg']['error'] != 'undefined')
                {
                    ctrl.css({color: $.conf['u_cfg']['error']['value']});
                }
            }

            // Если сообщение не было отослано или не имеет состояния ошибки выводим полностью меню
            if(config.data['send_state'] != 'process' && config.data['send_state'] != 'error')
            {
                // Если сообщение является другого пользователя и он находится в том же слое
                if(config.data['is_my_msg'] == false && config.data['layer_write'] == false )
                {
                    var ctrl = '';
                }
                else
                {
                    // Создание выпадающего меню
                    var $ul = $('<ul class="glabCtrl-menu"></ul>')
                    var menuItems = {};
                    $.each(this._config.menuList, function(index, value)
                    {
                        if(this.name != '')
                        {
                            $ul.append(
                                   li = $('<li class="glabCtrl-item" date-type="' + this.type
                                            + '" id="' + this.id + '">' + this.name + '</li>')
                            );
                            menuItems[index] = li;
                        }
                    })
                    
                    $ul.bind('click', _click);

                    $menu.append($ul)

                    var button, preBtn, arrow

                    if(this._config.menuList.answer.type == 'edit')
                    {
                        var class_icon = 'glabCtrl-arrow-left edit';
                        // Если тип сообщения для отправки и не отправлено физечески переименовываем
                        // меню по изменённым требованиям
                        if(config.data['state'] == 'send' && config.data['send_state'] != 'process')
                        {
                            var class_icon = 'glabCtrl-arrow-left send';
                        }
                    }
                    else
                    {
                        var class_icon = 'glabCtrl-arrow-left';
                    }

                    var ctrl = $('<div class="glabCtrl"></div>').append(
                                preBtn = $('<div class="' + class_icon + '"></div>').click(_answerClick),
                                button = $('<div class="glabCtrl-cap">'
                                            + this._config.menuList.answer.name + '</div>').click(_answerClick),
                                arrow = $('<div class="glabCtrl-arrow"></div>').click(_show),
                                $menu
                            ).click(_show)
                }
            }

            // Если сообщение является отправленным физически выводим только дату отправки
            if(config.data['is_send'] == true || (config.data['is_my_msg'] == false && config.data['layer_write'] == false))
            {
                // Если дата отправки не известна (случай вывода внешнего спам сообщения) выводим date_received
                if(typeof config.data['date_sent'] == 'undefined')
                {
                    var date = config.data['date_received'].split(' ');
                }
                else
                {
                    var date = config.data['date_sent'].split(' ');
                }

                var ctrl = $('<div class="glabCtrl"></div>').append(
                                $('<div class="glabCtrl-cap" style="margin: 2px 0 0 30px;">' + date[0] + '</div>'),
                                $menu
                        )

                // Задаём цвет для текста, если существует в пользовательской конфигурации
                /*if(typeof $.conf['u_cfg']['process'] != 'undefined')
                {
                    ctrl.css({color: $.conf['u_cfg']['process']['value']});
                }*/
            }

            $.extend(this, ctrl);
            $(this._config.renderTo).append(this);
            this._domList = {
                ctrl: ctrl,
                menu: $menu ,
                preBtn: preBtn,
                button: button,
                arrow: arrow,
                menuItems : menuItems
            }
        }
    })
    //Инициализация и создание объекта
    this.gcbRender()
    // TODO: Создаёт конфликт для других плагинов
    //$(document).bind('click', _hide);
    //return this;
}

var dbg;
/*$(document).ready(function()
{
    dbg = new glAnswerBtnCtrl({
        renderTo: '#debug',
        menuList: [
            {name: 'Ответить', type: 'answer'},
            {name: 'В обработанные', type: 'incompil'}
        ],
        delegition: function(n, t)
        {
            alert(n, t)
        },
        answerClick: function()
        {
            alert('answerClick')
        }
    })
})*/
