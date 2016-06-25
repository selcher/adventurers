( function ( w, utils ) {

    /**
     * Public api
     */
    w.PlayerRender = PlayerRender;

    function PlayerRender( playerDOM ) {
        this.dom = playerDOM;

        this.prevState = "";
        this.prevHp = 0;
        this.prevAvatarStatus = [];

        this.hpDOM = null;
        this.statusIconsDOM = null;
        this.avatarDOM = null;
        this.avatarPlayerDOM = null;

        return this;
    }

    PlayerRender.prototype.getDOM = function getDOM() {
        return this.dom;
    };

    PlayerRender.prototype.update = function update( player ) {
        if ( this.avatarDOM === null ) {
            this.initialRender( player );
        } else {
            this.render( player );
        }
    };

    PlayerRender.prototype.initialRender = function initialRender( player ) {
        var playerState = player.state;
        var content = [
            '<div class="info">',
                renderStatusIcons( player.status ),
                renderHp( playerState, player.hp, player.maxHp ),
            '</div>',
            renderAvatar( player.name, playerState, player.atkSpeed, player.atkSpeedCounter ),
            renderAvatarStatus( player.status )
        ].join( "" );

        this.dom.className = "player-avatar";
        this.dom.innerHTML = content;

        this.prevState = playerState;
        this.prevHp = player.hp;
        this.prevAvatarStatus = utils.getKeys( player.status );

        this.hpDOM = this.dom.querySelector( ".hp" );
        this.statusIconsDOM = this.dom.querySelector( ".status-icon-container" );
        this.avatarDOM = this.dom.querySelector( ".avatar-container" );
        this.avatarPlayerDOM = this.dom.querySelector( "." + player.name + ".avatar" );
    };

    PlayerRender.prototype.render = function render( player ) {
        var playerState = player.state;

        if ( this.prevState !== playerState ) {
            this.hpDOM.className = "hp " + playerState;
            this.avatarPlayerDOM.className = player.name + " avatar " + playerState;
        }
        if ( isAvatarAnimationActive( playerState ) ) {
            this.avatarPlayerDOM.style.cssText += getAvatarAnimationStyle(
                playerState, player.atkSpeed, player.atkSpeedCounter );
        }

        if ( this.prevHp !== player.hp ) {
            this.hpDOM.innerHTML = renderHpBar( player.hp, player.maxHp );
        }

        if ( this.prevAvatarStatus.length !== utils.getKeys( player.status ).length ) {
            this.statusIconsDOM.innerHTML = renderStatusIconsList( player.status );
            updateAvatarStatus( this.avatarDOM, this.prevAvatarStatus, player.status );

            // Reference avatarPlayerDOM again since avatarDOM.innerHTML was used
            this.avatarPlayerDOM = this.dom.querySelector( "." + player.name + ".avatar" );
        }

        this.prevState = playerState;
        this.prevHp = player.hp;
        this.prevAvatarStatus = utils.getKeys( player.status );
    };


    /**
     * Private methods
     */
    function renderStatusIcons( statusDict ) {
        var result = [
            '<div class="status-icon-container">',
                renderStatusIconsList( statusDict ),
            '</div>'
        ].join( "" );

        return result;
    }

    function renderStatusIconsList( statusDict ) {
        var result = "";

        for ( var status in statusDict ) {
            result += '<div class="status-icon ' + status + '"></div>';
        }

        return result;
    }

    function renderHp( state, hp, maxHp ) {
        var result = '<div class="hp ' + state  + '">' +
            renderHpBar( hp, maxHp ) +
        '</div>';

        return result;
    }

    function renderHpBar( hp, maxHp ) {
        var currentHp = ( hp / maxHp ) * 100;
        var amount = currentHp < 25 ? "low": "";
        var result = '<div class="current ' + amount + '" style="width:' + currentHp + '%;"></div>' +
            '<div class="max"></div>';

        return result;
    }

    function renderAvatar( name, state, atkSpeed, atkSpeedCounter ) {
        var avatarClassName = name + ' avatar ' + state;
        var avatarShadowClassName = name + ' avatar-shadow ' + state;
        var animationStyle = getAvatarAnimationStyle( state, atkSpeed, atkSpeedCounter );
        var result = [
            '<div class="avatar-container" ' +'style="' + animationStyle + '">',
                '<div class="' + avatarClassName + '"></div>',
                '<div class="' + avatarShadowClassName + '"></div>',
            '</div>'
        ].join( "" );

        return result;
    };

    function isAvatarAnimationActive( state ) {
        return state === "attacking";
    }

    function getAvatarAnimationStyle( state, atkSpeed, atkSpeedCounter ) {
        var animationStyle = "";

        if ( state === "attacking" ) {
            var maxMoveDistance = 20;
            var x = atkSpeedCounter / (atkSpeed / 2);

            x = x < 1 ? x * maxMoveDistance : (2 - x) * maxMoveDistance;
            animationStyle += "-webkit-transform: translateX(" + x + "px);";
        }

        return animationStyle;
    }

    function renderAvatarStatus( statusDict ) {
        return renderAvatarStatusList( statusDict );
    }

    function renderAvatarStatusList( statusDict ) {
        var result = "";

        for ( var status in statusDict ) {
            result += statusDict[ status ].getRenderTemplate();
        }

        return result;
    }

    function updateAvatarStatus( avatarDOM, prevStatusList, statusDict ) {
        var removedStatusList = [];

        utils.each( prevStatusList, function( prevStatus ) {
            if ( !statusDict[ prevStatus ] ) {
                removedStatusList.push( prevStatus );
            }
        });

        utils.each( removedStatusList, function( removedStatus ) {
            var removedStatusElements = avatarDOM.getElementsByClassName( "status-" + removedStatus );

            while ( removedStatusElements[ 0 ] ) {
                removedStatusElements[ 0 ].parentNode.removeChild( removedStatusElements[ 0 ] );
            }
        }, this );

        var addedStatusDict = {};

        for ( var status in statusDict ) {
            if ( prevStatusList.indexOf( status ) < 0 ) {
                addedStatusDict[ status ] = statusDict[ status ];
            }
        }

        avatarDOM.innerHTML += renderAvatarStatusList( addedStatusDict );
    }

} )( window, window.utilsApi );
