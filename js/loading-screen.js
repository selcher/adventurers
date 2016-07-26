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

    var progressBar = null;
    var progressBarWidth = 0;
    var progressIcon = null;
    var progressIconWidth = 0;

    function render( progress, label ) {

        if ( progressBar ) {

            progressBar.style.cssText += getProgressBarStyle( progress );
            progressIcon.style.cssText += getProgressIconStyle( progress );

        } else {

            initialRender( progress, label );

        }
    }

    function initialRender( progress, label ) {

        renderContent( container,
            [
                '<div class="loading-label">',
                    ( label || '' ),
                '</div>',
                '<div class="loading-progress">',
                    '<div class="progress-bar-start"></div>',
                    '<div class="progress-bar" style="' + getProgressBarStyle( progress ) + '"></div>',
                    '<div class="progress-icon" style="' + getProgressIconStyle( progress ) + '"></div>',
                    '<div class="progress-bar-end"></div>',
                '</div>',
            ].join( "" )
        );

        progressBar = container.querySelector( ".progress-bar" );
        progressBarWidth = progressBar.getBoundingClientRect().width;
        progressIcon = container.querySelector( ".progress-icon" );
        progressIconWidth = progressIcon.getBoundingClientRect().width;

        return this;
    }

    function getProgressBarStyle( progress ) {
        var transform = "transform:scaleX(" + progress + ");";

        return transform + "-webkit-" + transform;
    }

    function getProgressIconStyle( progress ) {

        var x = (progress * progressBarWidth) - progressIconWidth;
        var transform = "transform:translateX(" + x + "px) scaleX(-1);";

        return transform + "-webkit-" + transform;
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
