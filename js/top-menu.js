(function( w ) {

    /**
     * Private variables
     */
    var container = null;


    /**
     * Public api
     */
    w.topMenuApi = {
        "init": init,
        "render": render,
        "show": show,
        "hide": hide
    };


    /**
     * Private methods
     */
    function renderContent( element, content ) {
        element.innerHTML = content;
    };

    function init( element ) {

        container = element;

        return this;
    }

    function render( experience, zeny ) {

        renderContent( container,
            [
                '<div class="experience">' + experience + '</div>',
                '<div class="zeny">' + zeny + '</div>',
            ].join( "" )
        );

        return this;
    }

    function show() {
        container.classList.remove( "hide" );
    }

    function hide() {
        container.classList.add( "hide" );
    }

})( window );
