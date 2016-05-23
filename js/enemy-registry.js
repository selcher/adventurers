(function( w ) {

    /**
     * Private variables
     */
    var registry = {};


    /**
     * Public api
     */
    w.enemyRegistryApi = {
        "register": register,
        "get": get
    };


    /**
     * Private methods
     */
    function register( key, value ) {
        registry[ key ] = value;
    }

    function get( key ) {
        return registry[ key ];
    }

})( window );
