(function( w, doc, dataApi, gameApi, mainMenuApi, creditsApi, messageApi, topMenuApi, contentApi, controlsApi ) {

    // Game Initialize:
    // 1. Load Game Data
    // 2. Initialize Game
    dataApi.loadData(function() {

        // Message
        var message = doc.querySelector( ".message" );
        messageApi.init( message ).hide();

        // Top menu
        var topMenu = doc.querySelector( ".top-menu" );
        topMenuApi.init( topMenu ).render().hide();

        // Content
        var content = doc.querySelector( ".game-container .content" );
        contentApi.init( content ).render().hide();

        // Bottom menu
        var controls = doc.querySelector(".controls");
        controlsApi.init( controls ).render().show();

        // Save Game Data on page close / refresh
        w.addEventListener( "beforeunload", function( e ) {
            if ( dataApi.isAutoSaveEnabled() ) {
                dataApi.saveData( gameApi.getData() );
            }
        }, false );

        // Main Menu
        var mainMenu = doc.querySelector( ".main-menu" );
        mainMenuApi.init( mainMenu );

        if ( dataApi.hasSavedData() ) {
            mainMenuApi.enableOption( "continue" );
        }

        mainMenuApi.render().show();

        var credits = doc.querySelector( ".credits" );
        creditsApi.init( credits ).render().hide();
    });

})( window,
    document,
    window.dataApi,
    window.gameApi,
    window.mainMenuApi,
    window.creditsApi,
    window.messageApi,
    window.topMenuApi,
    window.contentApi,
    window.controlsApi
);
