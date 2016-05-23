// Enemy Class inherits Player Class

function Enemy( status, renderer ) {

    if ( this instanceof Enemy ) {
        Player.call( this, status, renderer );

        this.reviveDelayCounter = 0;
        this.minions = status.minions || 0;

        return this;
    } else {
        return new Enemy( status );
    }
}

Enemy.prototype = Object.create( Player.prototype );
Enemy.prototype.constructor = Enemy;

Enemy.prototype.regen = function() {
    this.reviveDelayCounter++;

    if ( this.reviveDelayCounter >= this.reviveDelay ) {
        this.reviveDelayCounter = 0;
        this.hp = this.maxHp;
    }
};
