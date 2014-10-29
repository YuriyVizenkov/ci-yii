<?php

/**
 * Class AdminModule
 */
class AdminModule extends CWebModule
{
    const MODULE_SIMPLE_NAME = 'Admin';

    /**
     * @return array
     */
    public function getImport()
    {
        return array(
            'admin/components/',
            'admin/components/interfaces/',
            'admin/controllers/',
            'admin/models/',
            'admin/models/views/',
            'admin/widgets/',
        );
    }
}
