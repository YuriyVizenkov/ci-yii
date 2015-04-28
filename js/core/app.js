(function($)
{
    var config = $.conf;

    if (config.debug === true) {
        console.log(config);
    }

    $.app = {
        /**
         *
         * @param param
         * @returns {*}
         */
        get: function(param)
        {
            var v = null;
            if (typeof config[param] != 'undefined') {
                v = config[param];
            }

            return v;
        }
    };

    return $.app;

})(jQuery);
