<?php

/**
 * Class JSConfig
 */
class JSConfig 
{
    /**
     * @var array
     */
    private $config = array();

    /**
     * @param array $params
     */
    public function set(array $params)
    {
        $this->config = array_merge($this->config, $params);
    }

    /**
     * @param bool $param
     * @return null
     */
    public function get($param = false)
    {
        $value = null;
        if ($param && isset($this->config[$param])) {
            $value = $this->config[$param];
        }

        return $value;
    }

    /**
     * @return array
     */
    public function getConfig()
    {
        return $this->config;
    }
}
