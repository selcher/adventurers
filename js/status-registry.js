(function( w, StatusClass ) {

    /**
     * Private variables
     */
    var registry = {
        "vulture-eye": {
            "id": "vulture-eye",
            "duration": 3200,
            "delay": 3200,
            "constant": true,
            "effect": function( target ) {
                target.setBonus( "atk", target.getBonus( "atk" ) + target.getAttack() );
            },
            "undo": function( target ) {
                target.setBonus( "atk", target.getBonus( "atk" ) - target.getAttack() );
            },
            "renderTemplate": [
                '<div class="status-vulture-eye"></div>'
            ].join( "" )
        },
        "angelus": {
            "id": "angelus",
            "duration": 3200,
            "delay": 3200,
            "constant": true,
            "effect": function( target ) {
                target.setBonus( "def", target.getBonus( "def" ) + target.getDefense() );
            },
            "undo": function( target ) {
                target.setBonus( "def", target.getBonus( "def" ) - target.getDefense() );
            },
            "renderTemplate": [
                '<div class="status-angelus barrier"></div>'
            ].join( "" )
        },
        "blessing": {
            "id": "blessing",
            "duration": 3200,
            "delay": 3200,
            "constant": true,
            "effect": function( target ) {
                target.setBonus( "atk", target.getBonus( "atk" ) + target.getAttack() );
                target.setBonus( "def", target.getBonus( "def" ) + target.getDefense() );
            },
            "undo": function( target ) {
                target.setBonus( "atk", target.getBonus( "atk" ) - target.getAttack() );
                target.setBonus( "def", target.getBonus( "def" ) - target.getDefense() );
            },
            "renderTemplate": [
                '<div class="status-blessing status-animation-line line-1"></div>',
                '<div class="status-blessing status-animation-line line-2"></div>',
                '<div class="status-blessing status-animation-line line-3"></div>',
                '<div class="status-blessing status-animation-line line-4"></div>',
                '<div class="status-blessing status-animation-line line-5"></div>',
                '<div class="status-blessing status-animation-line line-6"></div>',
                '<div class="status-blessing status-animation-line line-7"></div>'
            ].join( "" )
        }
    };


    /**
     * Public api
     */
    w.statusRegistryApi = {
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
        return new StatusClass( registry[ key ] );
    }

})( window, Status );
