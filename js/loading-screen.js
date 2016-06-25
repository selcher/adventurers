(function( w ) {

    /**
     * Private variables
     */
    var container = null;


    /**
     * Public api
     */
    w.loadingScreenApi = {
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

    function render( progress, label ) {

        renderContent( container,
            [
                '<div class="loading-label">',
                    ( label || '' ),
                '</div>',
                '<div class="loading-progress">',
                    '<div class="progress-bar-start"></div>',
                    '<div class="progress-bar" style="width:' + progress + '%;">',
                        '<div class="progress-icon"></div>',
                    '</div>',
                    '<div class="progress-bar-end"></div>',
                '</div>',
            ].join( "" )
        );

        return this;
    }

    function show() {
        container.classList.remove( "hide" );
    }

    function hide() {
        container.classList.add( "fade" );
        setTimeout( function() {
            container.classList.add( "hide" );
            container.classList.remove( "fade" );
        }, 1000 );
    }

})( window );
