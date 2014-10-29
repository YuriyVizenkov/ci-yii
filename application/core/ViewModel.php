<?php
/**
 * Class ViewModel
 */
class ViewModel
{
    /**
     * Массив "виртуальных" свойств
     *
     * @var array
     */
    protected $props = array();

    /**
     * Массив ошибок.
     * Содержит все типы ошибок (транзакции, валидации ...) для вывода клиенту.
     * Типизирование ошибки производится по ключу:
     * <code>
     * $this->errors['transaction']
     * </code>
     *
     * @var array
     */
    protected $errors = array();

    /**
     * Имя класса для формирования пространства имён полей.
     * <code>
     * echo '<input name="BuyForm[nameField]" />';
     * </code>
     *
     * @var string
     */
    protected $class = '';

    /**
     * @var LangManager
     */
    protected $langManager = null;

    /**
     * @var Transliteration
     */
    protected $transliteration = null;

    /**
     * @var ClientManager
     */
    protected $clientManager = null;

    /**
     *
     */
    public function __construct()
    {
        $this->class = get_class($this);

        /* @var $currentController Base_Controller */
        $currentController = app()->load->getRootController();

        $this->clientManager = $currentController->getClientManager();
        $this->transliteration = $currentController->getTransliteration();
        $this->langManager = $currentController->getLangManager();
    }

    /**
     * Получение "виртуального" свойства.
     *
     * @param $nameProperty
     * @return mixed
     * @throws Exception
     */
    public function __get($nameProperty)
    {
	    if ($nameProperty === 'properties') {
		    return $this->props;
        }
	    else {
		    if (!isset($this->props[$nameProperty])) {
                throw new Exception('Property `' . $nameProperty . '` is not exists!');
            }

		    return $this->props[$nameProperty];
	    }
    }

    /**
     * Заполнение "виртуальных" свойств значениями.
     * Так же возможен вариант пакетного заполнения:
     * <code>
     * $obj->properties = array('name' => 'value', ...);
     * </code>
     *
     * @param string $nameProperty
     * @param mixed $value
     * @throws Exception
     */
    public function __set($nameProperty, $value)
    {
        if ($nameProperty === 'properties') {
            if (!is_array($value)) {
                throw new Exception('Option `properties` should be an array!');
            }

            foreach ($value as $property => $val) {

                $this->props[$property] = ($val === null) ? '' : $val;
            }
        }
        else {
            $this->props[$nameProperty] = ($value === null) ? '' : $value;
        }
    }

    /**
     * Предварительные операции перед валидацией.
     *
     * @return bool
     */
    public function beforeValidate()
    {
        return true;
    }

    /**
     * Исполнение действий после валидации.
     *
     * @return bool
     */
    public function afterValidate()
    {
        return true;
    }

    /**
     * Валидация свойств-полей по пользовательским и системным правилам.
     * Системные правила задаются объектом транзакции, который стандартизирует требуемые данные от удалённого сервера.
     *
     * @return bool
     * @throws Exception
     */
    public function validate()
    {
        if (empty($this->props)) {
            throw new Exception('This ' . $this->class . ' POST request empty!');
        }

        $this->beforeValidate();

        $rulesFields = $this->rules();
        foreach ($rulesFields as $field => $rules) {
            // Проверка на пользовательские правила
            foreach ($rules as $rule) {

	            $nameRule = key($rule);
	            if (!is_string($nameRule) && isset($rule[0])) {
		            $nameRule = $rule[0];
		            $equalsValue = false;
	            }
	            else {
                    $equalsValue = $rule[$nameRule];
	            }

                if (!$this->checkRule($nameRule, $equalsValue, $this->$field)) {
                    $this->errors[$field] = $rule['error'];
                    break;
                }
            }
        }

        $this->afterValidate();

        return (count($this->errors) === 0) ? true : false;
    }

    /**
     * Проверка правил для полей.
     * В методе инкапсулируются системные и пользовательские правила.
     *
     * @todo протестировать вызова пользовательских методов-фильтров валидации
     * @param $rule
     * @param $valRule
     * @param $value
     * @return bool
     * @throws Exception
     */
    protected final function checkRule($rule, $valRule, $value)
    {
        $result = false;
        switch ($rule) {
            case 'pattern':
                $result = preg_match($valRule, $value);
                break;

            case 'min':
                $result = (strlen($value) > (int)$valRule) ? true : false;
                break;

	        case 'max':
		        $result = (strlen($value) <= (int)$valRule) ? true : false;
                break;

	        case 'require':
		        $result = (strlen($value) > 0 || !empty($value)) ? true : false;
		        break;

            default:
                if (is_callable(array($this, $rule))) {
                    $result = call_user_func(array($this, $rule));
                }
                else {
                    throw new Exception('Not defined rule: ' . $valRule);
                }
        }

        return $result;
    }

    /**
     * Правила валидации.
     *
     * @return array
     */
    protected function rules()
    {
        return array();
    }

    /**
     * Проверка формы на ошибки.
     *
     * @return bool
     */
    public function isErrors()
    {
        return (count($this->errors) === 0) ? false : true;
    }

    /**
     * Получение всех ошибок, возникших при обработке объекта-формы.
     * В список ошибок входят все типы: системные, транзакционные и представления .
     *
     * @return array
     */
    public function getErrors()
    {
        return $this->errors;
    }

    /**
     * Получение сообщения ошибки представления по его имени.
     *
     * @param $name
     * @return string
     */
    public function error($name)
    {
        return (isset($this->errors[$name])) ? $this->errors[$name] : '';
    }

    /**
     * Позволяет устанавливать ошибки представления "вручную"
     *
     * @param array $errors
     */
    public function setErrors(array $errors)
    {
        foreach ($errors as $nameError => $message) {
            $this->errors[$nameError] = $message;
        }
    }

    /**
     * Проверка существования ошибки по её конкретному имени ("атомарно").
     *
     * @param $nameError
     * @return bool
     */
    public function hasError($nameError)
    {
        return (isset($this->errors[$nameError])) ? true : false;
    }
}
