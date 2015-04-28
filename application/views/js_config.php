<?php
/**
 * @var $config array|JsonSerializable
 */
?>
<script type="text/javascript">
    (function($)
    {
        $.conf = $.extend({
            ext : '.html',
            support : '',
            PAGINATION_THREADS_PER_PAGE  : 30,
            PAGINATION_MESSAGES_PER_PAGE : 30,
            //boolLoadRedactor : false,
            historyInit : false,
            inputFromUrl : false,
            debug : true,
            time_save_draft : 30000,
            server_hours : false,
            difference_hours : false,
            u_cfg : false
        }, <?= json_encode($config); ?>);
    })(jQuery);
</script>

