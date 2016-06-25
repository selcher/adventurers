(function( w,
    doc,
    utils,
    createjsApi,
    loadingScreenApi,
    dataApi,
    gameApi,
    mainMenuApi,
    creditsApi,
    messageApi,
    audioApi,
    topMenuApi,
    contentApi,
    controlsApi ) {

    /**
     * Private methods
     */
    function init() {

        initLoadingScreen();
        initPreloading();
    }


    function initLoadingScreen() {

        var loadingScreen = doc.querySelector( ".loading-screen" );

        loadingScreenApi.init( loadingScreen ).show();
        loadingScreenApi.render( "", 0 );
    }


    function updateLoadingScreen( progressEvent ) {

        var loadProgress = progressEvent.loaded;

        if ( loadProgress === 1 ) {
            loadingScreenApi.render( 100, "" );
            loadingScreenApi.hide();
        } else {
            loadingScreenApi.render( Math.round( loadProgress * 100 ), "" );
        }
    }


    function initPreloading() {

        var assetsFilePath = "js/assets.js";

        preloadAssets( assetsFilePath, {
            "complete": InitGame,
            "progress": updateLoadingScreen
        });
    }


    function preloadAssets( url, handlers ) {

        var queue = new createjsApi.LoadQueue( true );

        queue.installPlugin( createjsApi.Sound );
        queue.on( "complete", handlers.complete, this );
        queue.on( "progress", handlers.progress, this );

        utils.getData( url ).then( function( result ) {
            var assetsList = utils.parse( result );
            queue.loadManifest( assetsList );
        });
    }


    function InitGame() {

        // Game Initialize:
        // 1. Load Game Data
        // 2. Initialize Modules
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

            // Main Menu
            var mainMenu = doc.querySelector( ".main-menu" );
            mainMenuApi.init( mainMenu );

            if ( dataApi.hasSavedData() ) {
                mainMenuApi.enableOption( "continue" );
            }

            mainMenuApi.render().show();

            // Main Menu - Credits
            var credits = doc.querySelector( ".credits" );
            creditsApi.init( credits ).render().hide();

            // Audio
            var audio = doc.querySelector( ".audio" );
            audioApi.init( audio ).render();
            audioApi.play( "title" );

            // Save Game Data on page close / refresh
            w.addEventListener( "beforeunload", function( e ) {
                if ( dataApi.isAutoSaveEnabled() ) {
                    dataApi.saveData( gameApi.getData() );
                }
            }, false );
        });
    }


    init();

})( window,
    document,
    window.utilsApi,
    window.createjs,
    window.loadingScreenApi,
    window.dataApi,
    window.gameApi,
    window.mainMenuApi,
    window.creditsApi,
    window.messageApi,
    window.audioApi,
    window.topMenuApi,
    window.contentApi,
    window.controlsApi
);
