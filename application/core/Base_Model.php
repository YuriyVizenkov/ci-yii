<?php
/**
 * Class Base_Model
 * @property CI_DB_active_record $db
 * @property Base_Loader $load
 * @property CI_DB_mysql_forge $dbforge
 * @property array $properties
 */
class Base_Model extends CI_Model
{
    const TABLE_NAME = '';

	/**
	 * @var string
	 */
	protected $tableName;

	/**
	 * @var string
	 */
	protected $schema;

	 public function __construct()
	 {
	     parent::__construct();
	     $this->load->dbforge();
	     if(!$this->tableName) {
	         return;
	     }

	     if(!$this->db->table_exists($this->db->dbprefix($this->tableName))) {
	         $this->dbforge->add_field($this->schema);
	         if(isset($this->schema['id'])) {
	             $this->dbforge->add_key('id', TRUE);
	         }
	         $this->dbforge->create_table($this->db->dbprefix($this->tableName));
	     }
	 }

	/**
	 * @return string
	 */
	public function getTableName()
	{
		return '';
	}

    /**
     * @param string $name
     * @param mixed $value
     * @throws LogicException
     */
    public function __set($name, $value)
    {
        if ($name === 'properties') {
            if (!is_array($value)) {
                throw new LogicException('At asset package properties value must be array type');
            }
            foreach ($value as $field => $val) {
                $this->$field = $val;
            }
        }
        else {
            $this->$name = $value;
        }
    }

    /**
     * @param string $key
     * @return bool
     */
    public function __get($key)
    {
        $CI =& get_instance();
        if (isset($CI->$key)) {
            return $CI->$key;
        }
        if (isset($this->$key)) {
            return $this->$key;
        }
        elseif(method_exists($this, 'get') && $this->get($key)) {
            return $this->get($key);
        }
        else {
            return false;
        }
    }

    /**
     * @param array $models
     * @return Base_Model
     */
    public function withModels(array $models)
    {
        foreach ($models as $nameModel => $nameProperty) {
            if (!$nameProperty) {
                $nameProperty = strtolower($nameModel);
            }
            $this->load->model($nameModel, $nameProperty);
        }

        return $this;
    }

    /**
     * @return Base_Model[]
     */
    public function findAll()
    {
        /* @var $class Base_Model */
        $class = get_called_class();
        $this->db->from($this->getTableName() . ' as t');

        $data = array();
        $result = $this->db->get();
        if ($result !== false)
        {
            foreach ($result->result() as $row)
            {
                $model = new $class();
                $model->properties = (array) $row;

                $data[] = $model;
            }

            $result->free_result();
        }

        return $data;
    }

    /**
     * @return Base_Model
     */
    public function find()
    {
        /* @var $class Base_Model */
        $class = get_called_class();
	    $tableName = $this->getTableName();
        $this->db->from($tableName . ' as t');

        $result = $this->db->get();
        if ($result !== false) {
            $model = new $class();
            $concreteResult = $result->result();

            if (isset($concreteResult[0])) {
                $model->properties = (array) $concreteResult[0];
            }
            else {
                $model = null;
            }

            return $model;
        }
        else {
            return null;
        }
    }

    /**
     * @param int $id
     * @return Base_Model
     */
    public function findById($id)
    {
        $this->db->where('t.id', $id);
        return $this->find();
    }

    /**
     * @return mixed
     */
    public function getLastInsertId()
    {
        return$this->db->insert_id();
    }
}
