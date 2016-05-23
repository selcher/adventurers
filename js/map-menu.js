// Game Map

(function( w ) {

    /**
     * Private variables
     */
    var container = null;
    var actions = {};


    /**
     * Public api
     */
    w.mapMenuApi = {
        "init": init,
        "setActions": setActions,
        "render": render,
        "show": show,
        "hide": hide
    };


    /**
     * Private methods
     */
    function init( element ) {

        container = element;
        container.addEventListener( "click", onClickMap );
    }

    function onClickMap( e ) {

        var target = e.target;

        if ( target.classList.contains( "location" ) ) {

            var locationId = target.getAttribute( "data-name" );
            actions.onLocationSelected( locationId );

            hide();

            e.preventDefault();
            return false;
        }
    }

    function setActions( gameActions ) {
        actions = gameActions;
    }

    function render( locations ) {

        var content =  "";
        var location = "";
        var classStyle = "";

        for ( var i = locations.length; i--; ) {
            location = locations[ i ];

            if ( !location.locked ) {

                classStyle = [
                    "location",
                    location.locked ? "locked" : "unlocked",
                    location.id,
                ].join( " " );

                content += '<div ' +
                    'class="' + classStyle + '" ' +
                    'data-name="' + location.id + '">' +
                    '</div>';

            }
        }

        container.innerHTML = content;
    }

    function show() {
        container.classList.remove( "hide" );
    }

    function hide() {
        container.classList.add( "hide" );
    }

})( window );
