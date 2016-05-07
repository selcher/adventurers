(function( w, doc ) {

    var floor = Math.floor;
    var random = Math.random;

    w.utilsApi = {

        // Util
        "getRandom": function getRandom( list ) {
            return floor( random() * list.length );
        },
        "pickRandomTarget": function pickRandomTarget( list ) {
            var total = list.length;
            var pick = null;
            var pickIndex = 0;
            var picks = {};

            while ( total && !pick ) {
                pickIndex = this.getRandom( list );
                pick = list[ pickIndex ];

                if ( !pick.isAlive() &&
                    Object.keys( picks ).length !== total ) {
                    picks[ pickIndex ] = null;
                    pick = null;
                }
            }

            return pick;
        },
        "createElement": function createElement( tag, className ) {

            var container = doc.createElement( tag );

            if ( className ) {
                container.className = className;
            }

            return container;
        }

    };

})( window, document );
