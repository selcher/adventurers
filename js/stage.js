// Game Stage

(function( w ) {

    /**
     * Private variables
     */
    var container = null;


    /**
     * Public api
     */
    w.stageApi = {
        "init": init,
        "render": render,
        "show": show,
        "hide": hide,
        "add": add
    };


    /**
     * Private methods
     */
    function init( element ) {
        container = element;
    }

    function render( location ) {

        if ( !container.classList.contains( location ) ) {
            container.className = "stage " + location;
        }

        container.innerHTML = "";

        return this;
    }

    function show( showElement ) {
        container.classList.remove( "hide" );
    }

    function hide() {
        container.classList.add( "hide" );
    }

    function add( element ) {
        container.appendChild( element );
    }

})( window );
