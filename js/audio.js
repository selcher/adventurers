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

    function play( id ) {

        audioPlayerSrc.src = registry[ id ].src;
        audioPlayer.loop = true;
        audioPlayer.load();
        audioPlayer.play();
        audioPlayer.volume = 0.5;
    }

    function pause() {
        audioPlayer.pause();
    }

})( window, document );
