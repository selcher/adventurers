(function ( w, doc ) {

    /**
     * Private variables
     */
    var container = null;
    var audioPlayer = null;
    var audioPlayerSrc = null;
    var dir = "assets/audio/";
    var registry = {
        "title": {
            "src": dir + "01. Title.mp3"
        },
        "status": {
            "src": dir + "10. Splendid Dreams.mp3"
        },
        "boss": {
            "src": dir + "11. Rag All Night Long.mp3"
        },
        "map": {
            "src": dir + "12. Streamside.mp3"
        },
        "poring_field": {
            "src": dir + "01. One Step Closer.mp3"
        },
        "poring_field2": {
            "src": dir + "05. Tread On The Ground.mp3"
        }
    };
    var bgm = null;


    /**
     * Public api
     */
    window.audioApi = {
        "init": init,
        "render": render,
        "play": play,
        "pause": pause
    };


    /**
     * Private methods
     */
    function init( element ) {

        container = element;

        return this;
    }

    function render () {

        var content = [
            '<audio class="audio-player">',
                '<source class="audio-src"',
                    'type="audio/mpeg"',
                    'src="">',
            '</audio>'
        ].join( "" );

        container.innerHTML = content;

        audioPlayer = doc.querySelector( ".audio-player" );
        audioPlayerSrc = doc.querySelector( ".audio-src" );
    }

    function getPath() {

        var path = "";
        var platform = device ? device.platform : "";

        if ( platform.toLowerCase() === "android" ) {

            path = "file:///android_asset/www/";

        } else {

            var str = location.pathname;
            var i = str.lastIndexOf( "/" );

            path = str.substring( 0, i + 1 );

        }

        return path;
    }

    function play( id ) {

        if ( typeof Media !== "undefined" ) {

            if ( bgm ) {
                pause();
            }

            // Mobile
            var bgmPath = getPath() + registry[ id ].src;
            bgm = new Media( bgmPath, function onSuccess() {
                // audio played
            });
            bgm.play();

        } else {

            if ( !audioPlayer.paused ) {
                pause();
            }

            // Web
            audioPlayerSrc.src = registry[ id ].src;
            audioPlayer.loop = true;
            audioPlayer.load();
            audioPlayer.play();
            audioPlayer.volume = 0.5;

        }
    }

    function pause() {

        if ( typeof Media !== "undefined" ) {

            bgm.pause();
            bgm = null;

        } else {

            audioPlayer.pause();

        }
    }

})( window, document );
