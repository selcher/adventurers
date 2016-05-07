// Player
function Player( status, renderer ) {

    if ( this instanceof Player ) {
        this.name = status.name;
        this.level = status.level;
        this.experience = status.experience;
        this.maxExperience = status.maxExperience;
        this.status = status.hp ? "standby" : "dead";
        this.class = status.class;
        this.hp = status.hp;
        this.maxHp = status.maxHp;
        this.mp = status.mp;
        this.maxMp = status.mp;
        this.atk = status.atk;
        this.def = status.def;
        this.atkDelayCounter = 0;
        this.atkDelay = status.atkDelay;
        this.atkSpeedCounter = 0;
        this.atkSpeed = status.atkSpeed;
        this.reviveDelay = status.reviveDelay;
        this.increase = status.increase;
        this.image = status.image;
        this.imageStyle = status.imageStyle;

        this.renderer = renderer;

        return this;
    } else {
        return new Player( status );
    }
}

Player.prototype.isAlive = function isAlive() {
    return this.status !== "regen" && this.status !== "dead";
};

/**
 * Function: updateStatus
 *
 * Possible states:
 * standby > attacking > attack > standby
 * dead > regen > alive > standby
 */
Player.prototype.updateStatus = function updateStatus() {

    // TODO: state pattern ?
    if ( this.status === "regen" ) {
        this.regen();
        if ( this.hp >= this.maxHp ) {
            this.hp = this.maxHp;
            this.status = "alive";
        }
    } else if ( this.status === "dead" ) {
        this.status = "regen";
    } else if ( this.hp <= 0 ) {
        this.status = "dead";
    } else if ( this.status === "alive" ) {
        this.status = "standby";
    } else if ( this.status === "standby" ) {
        this.atkDelayCounter++;
        if ( this.atkDelayCounter >= this.atkDelay ) {
            this.atkDelayCounter = 0;
            this.status = "attacking";
        }
    } else if ( this.status === "attacking" ) {
        this.atkSpeedCounter++;
        if ( this.atkSpeedCounter >= this.atkSpeed ) {
            this.atkSpeedCounter = 0;
            this.status = "attack";
        }
    } else if ( this.status === "attack" ) {
        this.status = "standby";
    }
};

Player.prototype.resetStatus = function resetStatus() {
    this.status = "standby";
    this.hp = this.maxHp;
    this.mp = this.maxMp;
    this.atkDelayCounter = 0;
    this.atkSpeedCounter = 0;
};

Player.prototype.regen = function regen() {
    if ( this.hp < this.maxHp ) {
        this.hp += Math.floor( this.maxHp / this.reviveDelay );
    }
};

Player.prototype.attack = function attack( enemy ) {
    enemy && enemy.isAlive() && enemy.attacked( this.atk );
};

Player.prototype.attacked = function attacked( damage ) {
    var totalDamage = damage > this.def ? damage - this.def : 1;
    this.hp -= totalDamage;

    if (this.hp <= 0) {
        this.hp = 0;
    }
};

Player.prototype.getZeny = function getZeny() {
    return 0;
};

Player.prototype.getExperience = function getExperience() {
    return 0;
};

Player.prototype.getMaxExperience = function getMaxExperience() {
    return this.maxExperience;
};

Player.prototype.canLevelUp = function canLevelUp(exp) {
    return exp >= this.maxExperience;
};

Player.prototype.levelUp = function levelUp() {
    this.level++;
    this.maxHp += this.increase.hp;
    this.maxMp += this.increase.mp;
    this.hp = this.maxHp;
    this.mp = this.maxMp;
    this.atk += this.increase.atk;
    this.def += this.increase.def;
    this.maxExperience += Math.floor( this.maxExperience * 0.63 );
};

Player.prototype.getDOM = function getDOM() {
    return this.renderer.getDOM();
};

Player.prototype.render = function render() {
    this.renderer.update( this );
};

Player.prototype.update = function update() {
    this.updateStatus();
    this.render();
};
