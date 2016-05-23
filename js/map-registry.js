(function( w, utils ) {

    /**
     * Private variables
     */
    var registry = {};


    /**
     * Public api
     */
    w.mapRegistryApi = {
        "register": register,
        "get": get,
        "getLocations": getLocations,
        "lock": lock,
        "unlock": unlock,
        "getUnlockedLocations": getUnlockedLocations,
        "current": current,
        "getCurrent": getCurrent
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


    function getLocations() {

        var locations = [];
        var locationData = null;

        for ( var i in registry ) {

            locationData = registry[ i ];
            locations.push({
                "id": locationData.id,
                "current": locationData.current,
                "locked": locationData.locked
            });
        }

        return locations;
    }


    function lock( locationName ) {

        var location = get( locationName );

        location.locked = true;
    }


    function unlock( locationName ) {

        var location = get( locationName );

        location.locked = false;
    }


    function getUnlockedLocations() {

        var locations = [];
        var locationData = null;

        for ( var i in registry ) {

            locationData = registry[ i ];

            if ( !locationData.locked ) {
                locations.push( locationData.id );
            }
        }

        return locations;
    }


    function current( locationId ) {

        var location = null;

        for ( var i in registry ) {

            location = registry[ i ];
            location.current = location.id === locationId;
        }
    }


    function getCurrent() {

        var currentLocation = null;

        for ( var i in registry ) {

            if ( registry[ i ].current ) {
                currentLocation = registry[ i ];
                break;
            }
        }

        return currentLocation;
    }

})( window,
    window.utilsApi
);
