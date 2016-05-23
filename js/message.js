(function ( w, utils ) {

    /**
     * Private variables
     */
    var container = null;
    var title = "";
    var type = "";

    /**
     * Button Format:
     *
     * buttons = [
     *     {
     *         "id": "ok-button",
     *         "class": "button confirm",
     *         "text": "Ok",
     *         "click": function() {}
     *     }
     * ];
     */
    var buttons = [];


    /**
     * Public api
     */
    w.messageApi = {
        "init": init,
        "show": show,
        "hide": hide,
        "render": render,
        "setTitle": setTitle,
        "setType": setType,
        "setButtons": setButtons,
        "reset": reset
    };


    /**
     * Private methods
     */
    function init( element ) {

        container = element;
        container.addEventListener( "click", onClickMessage );

        return this;
    }

    function onClickMessage( e ) {

        var targetId = e.target.id;
        var action = null;

        utils.each( buttons, function( button ) {
            if ( targetId === button.id ) {
                action = button.click;
            }
        });

        if ( action ) {
            action();
            e.preventDefault();
            return false;
        }
    }

    function show() {
        container.classList.remove( "hide" );
    }

    function hide() {
        container.classList.add( "hide" );
    }

    function render( message ) {

        var content = [
            '<div class="' + type + '">',
                renderHeader(),
                renderContent( message ),
                renderButtons(),
            '</div>'
        ].join( "" );

        container.innerHTML = content;

        return this;
    }

    function renderHeader() {

        var headerHtml = [
            '<div class="message-header">',
                '<div class="title">',
                    title,
                '</div>',
            '</div>'
        ];

        return headerHtml.join( "" );
    }

    function renderContent( message ) {

        var contentHtml = [
            '<div class="message-content">',
                '<div class="info-tip"></div>',
                '<div class="info">',
                    message,
                '</div>',
            '</div>'
        ];

        return contentHtml.join( "" );
    }

    function renderButtons() {

        var buttonsHtml = [ '<div class="message-buttons">' ];

        utils.each( buttons, function( button ) {
            var id = button.id || "";
            var className = button.class || "";

            buttonsHtml = buttonsHtml.concat([
                '<div id="' + id + '" class="' + className + '">',
                    button.text,
                '</div>'
            ]);
        });

        buttonsHtml.push( '</div>' );

        return buttonsHtml.join( "" );
    }

    function setTitle( newTitle ) {
        title = newTitle;
    }

    function setType( messageType ) {
        type = messageType;

        return this;
    }

    function setButtons( buttonsList ) {
        buttons = buttonsList ? buttonsList.slice() : [];
    }

    function reset() {
        setTitle( "" );
        setType( "" );
        setButtons( [] );
    }

})( window, window.utilsApi );
