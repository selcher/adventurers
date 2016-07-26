( function ( w ) {

    /**
     * Public api
     */
    w.EnemyRender = EnemyRender;

    function EnemyRender( enemyDOM ) {
        this.dom = enemyDOM;

        this.avatarDOM = null;
        this.hpDOM = null;
        this.currentHpDOM = null;

        this.prevState = "";
        this.prevHp = 0;

        return this;
    }

    EnemyRender.prototype.getDOM = function getDOM() {
        return this.dom;
    };

    EnemyRender.prototype.update = function update( enemy ) {
        if ( this.avatarDOM === null ) {
            this.initialRender( enemy );
        } else {
            this.render( enemy );
        }
    };

    EnemyRender.prototype.initialRender = function initialRender( enemy ) {
        var enemyState = enemy.state;
        var content = '<div class="info">' +
                     renderHp( enemyState, enemy.hp, enemy.maxHp ) +
                '</div>' +
                    renderAvatar( enemy.name, enemyState,
                        enemy.atkSpeed, enemy.atkSpeedCounter );

        this.dom.className = "player-avatar";
        this.dom.innerHTML = content;

        this.avatarDOM = this.dom.querySelector( ".avatar" );
        this.hpDOM = this.dom.querySelector( ".hp" );
        this.currentHpDOM = this.hpDOM.querySelector( ".current" );

        this.prevState = enemyState;
        this.prevHp = enemy.hp;
    };

    EnemyRender.prototype.render = function render( enemy ) {
        var enemyState = enemy.state;
        var transform = "";

        if ( this.prevState !== enemyState ) {
            this.hpDOM.className = "hp " + enemyState;
            this.avatarDOM.className = enemy.name + " avatar enemy " + enemyState;
        }

        if ( enemyState === "attacking" ) {
            transform = getAvatarAnimationStyle(
                enemyState, enemy.atkSpeed, enemy.atkSpeedCounter );

            if ( transform ) {
                this.avatarDOM.style.cssText += transform;
            }
        } else if ( enemyState === "attack" || enemyState === "dead" ) {

            transform = "transform:translate3d(0, 0, 0);";
            this.avatarDOM.style.cssText += transform + "-webkit-" + transform;
        }

        if ( this.prevHp !== enemy.hp ) {
            var currentHp = getHpAmount( enemy.hp, enemy.maxHp );
            this.currentHpDOM.className = "current " + getHpStatus( currentHp );

            transform = getHpStyle( currentHp );
            this.currentHpDOM.style.cssText += transform;
        }

        this.prevState = enemyState;
        this.prevHp = enemy.hp;
    };


    /**
     * Private methods
     */
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

    function getAvatarAnimationStyle( state, atkSpeed, atkSpeedCounter ) {
        var animationStyle = "";

        if ( state === "attacking" ) {
            var maxMoveDistance = 20;
            var x = atkSpeedCounter / (atkSpeed / 2);
            var transform = "";

            x = x < 1 ? -x * maxMoveDistance : -(2 - x) * maxMoveDistance;
            transform = "transform:translate3d(" + x + "px, 0, 0);";
            transform = transform + "-webkit-" + transform;

            animationStyle += transform;
        }

        return animationStyle;
    }

    function renderAvatar( name, state, atkSpeed, atkSpeedCounter ) {
        var avatarClassName = name + ' avatar enemy ' + state;
        var avatarShadowClassName = name + ' avatar-shadow enemy ' + state;
        var animationStyle = getAvatarAnimationStyle( state, atkSpeed, atkSpeedCounter );
        var result = [
            '<div class="' + avatarClassName + '" ' + 'style="' + animationStyle + '"></div>',
            '<div class="' + avatarShadowClassName + '"></div>'
        ].join( "" );

        return result;
    };

} )( window );
