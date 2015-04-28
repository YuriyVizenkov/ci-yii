<?php
/**
 * @var $content string
 * @var $this Base_Loader
 * @var $clientManager ClientManager
 * @var $config array
 */
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">

	    <meta http-equiv="X-UA-Compatible" content="IE=edge">
	    <meta name="viewport" content="width=device-width">
	    <meta name="keywords" content="<?= $clientManager->getMetaKeywords(); ?>">
	    <meta name="description"
              content="<?= (isset($Description)) ? $Description : $clientManager->getDescription(); ?>">

	    <title><?= $clientManager->getTitle(); ?></title>

        <?= $clientManager->getCanonical(); ?>

        <?php $clientManager->includeCSS(); ?>

        <?php $clientManager->registerCoreJQuery('core/jquery-1.10.2.min'); ?>
        <?php $clientManager->registerCoreJQuery('core/jquery-migrate-1.2.2.min'); ?>

    </head>

    <body>

        <?= $content; ?>

        <div id="overlay"></div>

        <?php $this->renderPartial('js_config', ['config' => $config]); ?>

        <?php $clientManager->renderModalWindows(); ?>
        <?php $clientManager->includeJS(); ?>
    </body>
</html>
