// Utils Api

(function( w, doc, ObjectApi, MathApi, JSONApi ) {

    var floor = MathApi.floor;
    var random = MathApi.random;

    w.utilsApi = {

        // list and objects
        "getKeys": function getKeys( obj ) {
            return ObjectApi.keys( obj );
        },
        "each": function each( list, callback, context ) {
            for ( var i = 0, length = list.length; i < length; i++ ) {
                callback && callback.call( context || null, list[ i ], i );
            }
        },
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
                    this.getKeys( picks ).length !== total ) {
                    picks[ pickIndex ] = null;
                    pick = null;
                }
            }

            return pick;
        },

        // JSON
        "parse": function parse( text ) {
            return JSONApi.parse( text );
        },
        "toString": function toString( json ) {
            return JSONApi.stringify( json );
        },

        // UI
        "createElement": function createElement( tag, className ) {

            var container = doc.createElement( tag );

            if ( className ) {
                container.className = className;
            }

            return container;
        }

    };

})( window, document, Object, Math, JSON );
