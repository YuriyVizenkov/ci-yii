<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">

	    <meta http-equiv="X-UA-Compatible" content="IE=edge">
	    <meta name="viewport" content="width=device-width">
	    <meta name="keywords" content="<?= $this->load->getRootController()->getClientManager()->getMetaKeywords(); ?>">
	    <meta name="description" content="<?= (isset($Description)) ? $Description
                                                : $this->load->getRootController()->getClientManager()->getDescription(); ?>">

	    <title><?= $this->load->getRootController()->getClientManager()->getTitle(); ?></title>

        <?= $this->load->getRootController()->getClientManager()->getCanonical(); ?>

        <?php $this->load->getRootController()->getClientManager()->includeCSS(); ?>

    </head>

    <body>
