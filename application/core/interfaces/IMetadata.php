<?php

/**
 * Interface IMetadata
 */
interface IMetadata {

    /**
     * @return string
     */
    public function getTitle();

    /**
     * @return string
     */
    public function getDescription();

    /**
     * @return string
     */
    public function getKeywords();
}
