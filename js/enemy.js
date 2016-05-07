// Enemy extends player
function Enemy( status, renderer ) {

    if ( this instanceof Enemy ) {
        Player.call( this, status, renderer );

        this.reviveDelayCounter = 0;
        this.zeny = status.zeny;

        return this;
    } else {
        return new Enemy( status );
    }
}

Enemy.prototype = Object.create( Player.prototype );
Enemy.prototype.constructor = Enemy;

Player.prototype.getZeny = function getZeny() {
    return this.zeny;
};

Enemy.prototype.getExperience = function() {
    return this.experience;
};

Enemy.prototype.regen = function() {
    this.reviveDelayCounter++;

    if ( this.reviveDelayCounter >= this.reviveDelay ) {
        this.reviveDelayCounter = 0;
        this.hp = this.maxHp;
    }
};

// Enemy.prototype.renderAvatar = function renderAvatar( status ) {
//     var pos = "";
//
//     if ( status === "attacking" ) {
//         // TODO: constant 20 = max attack move distance
//         var x = this.atkSpeedCounter / (this.atkSpeed / 2);
//         x = x < 1 ?
//             -x * 20 : -(2 - x) * 20;
//         var pos = "-webkit-transform: translateX(" + x + "px);";
//     }
//
//     var result = '<div class="avatar enemy ' + status + '" ' +
//         'style="' + pos + '"></div>';
//
//     return result;
// };
