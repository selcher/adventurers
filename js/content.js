(function ( w, doc, stage, map, statusMenu ) {

    /**
     * Private variables
     */
    var container = null;


    /**
     * Public api
     */
    window.contentApi = {
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

    function render() {

        var content = [
            '<div class="stage hide"></div>',
            '<div class="shop hide"></div>',
            '<div class="map hide"></div>',
            '<div class="status hide"></div>'
        ].join( "" );

        renderContent( container, content );

        stage.init( doc.querySelector( ".stage" ) );
        map.init( doc.querySelector( ".map" ) );
        statusMenu.init( doc.querySelector( ".status" ) );

        return this;
    }

    function show() {
        container.classList.remove( "hide" );
    }

    function hide() {
        container.classList.add( "hide" );
    }

})( window,
    document,
    window.stageApi,
    window.mapMenuApi,
    window.statusMenuApi);
