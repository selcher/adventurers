// Game Map

(function( w ) {

    var container = null;

    function init( element ) {

        container = element;
        container.addEventListener( "click", onClickMap );
    }

    function onClickMap( e ) {

        var target = e.target;

        if ( target.classList.contains( "location" ) ) {

            var locationName = target.getAttribute( "data-name" );
            actions.onLocationSelected( locationName );

            hide();

            e.preventDefault();
            return false;
        }
    }

    var actions = {};

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
                    location.name,
                ].join( " " );

                content += '<div ' +
                    'class="' + classStyle + '" ' +
                    'data-name="' + location.name + '">' +
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

    var api = {
        "init": init,
        "setActions": setActions,
        "render": render,
        "show": show,
        "hide": hide
    };

    // Attach to global namespace
    w.mapMenuApi = api;

})( window );
