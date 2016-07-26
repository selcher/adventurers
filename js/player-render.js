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
        this.currentHpDOM = null;
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
        this.currentHpDOM = this.hpDOM.querySelector( ".current" );
        this.statusIconsDOM = this.dom.querySelector( ".status-icon-container" );
        this.avatarDOM = this.dom.querySelector( ".avatar-container" );
        this.avatarPlayerDOM = this.dom.querySelector( "." + player.name + ".avatar" );
    };

    PlayerRender.prototype.render = function render( player ) {
        var playerState = player.state;
        var transform = "";

        if ( this.prevState !== playerState ) {
            this.hpDOM.className = "hp " + playerState;
            this.avatarPlayerDOM.className = player.name + " avatar " + playerState;
        }

        if ( isAvatarAnimationActive( playerState ) ) {
            transform = getAvatarAnimationStyle(
                playerState, player.atkSpeed, player.atkSpeedCounter );

            if ( transform ) {
                this.avatarPlayerDOM.style.cssText += transform;
            }
        } else if ( playerState === "attack" || playerState === "dead" ) {

            transform = "transform:translate3d(0,0,0);";
            this.avatarPlayerDOM.style.cssText += transform + "-webkit-" + transform;
        }

        if ( this.prevHp !== player.hp ) {
            var currentHp = getHpAmount( player.hp, player.maxHp );
            this.currentHpDOM.className = "current " + getHpStatus( currentHp );

            transform = getHpStyle( currentHp );
            this.currentHpDOM.style.cssText += transform;
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

    function getHpStatus( hp ) {
        return hp < 0.25 ? "low" : "";
    }

    function getHpAmount( hp, maxHp ) {
        return ( hp / maxHp );
    }

    function getHpStyle( hp ) {
        var transform = "transform:scaleX(" + hp + ");";

        return transform + "-webkit-" + transform;
    }

    function renderHp( state, hp, maxHp ) {
        var currentHp = getHpAmount( hp, maxHp );
        var status = getHpStyle( currentHp );
        var result = '<div class="hp ' + state + '">' +
            '<div class="current ' + status + '" style="' + currentHp + '"></div>' +
            '<div class="max"></div>' +
        '</div>';

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
            var transform = "";

            x = x < 1 ? x * maxMoveDistance : (2 - x) * maxMoveDistance;
            transform = "transform:translate3d(" + x + "px, 0, 0);";
            transform = transform + "-webkit-" + transform;

            animationStyle += transform;
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
