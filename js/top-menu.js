(function (w) {

    function renderContent( element, content ) {
        element.innerHTML = content;
    };

    var container = null;

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

    window.topMenuApi = {
        "init": init,
        "render": render,
        "show": show,
        "hide": hide
    };

})(window);
