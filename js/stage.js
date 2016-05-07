// Game Stage

(function( w ) {

    var container = null;

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

    var api = {
        "init": init,
        "render": render,
        "show": show,
        "hide": hide,
        "add": add
    };

    // Attach to global namespace
    w.stageApi = api;

})( window );
