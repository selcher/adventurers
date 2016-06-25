// Status class

function Status( info ) {

    this.id = info.id;
    this.duration = info.duration;
    this.durationCounter = 0;
    this.delay = info.delay;
    this.delayCounter = 0;
    this.constant = info.constant;
    this.effect = info.effect;
    this.undo = info.undo;
    this.renderTemplate = info.renderTemplate;
}


Status.prototype.getId = function getId() {
    return this.id;
};


Status.prototype.isActive = function isActive() {

    var active = this.durationCounter < this.duration;

    if ( active ) {
        this.durationCounter++;
    }

    return active;
};


Status.prototype.delayComplete = function delayComplete() {
    return this.delayCounter >= this.delay;
};


Status.prototype.updateDelay = function updateDelay() {
    this.delayCounter++;
};


Status.prototype.resetDelay = function resetDelay() {
    this.delayCounter = 0;
};


Status.prototype.update = function update( target ) {

    var active = this.isActive();

    if ( active && this.constant && this.durationCounter <= 1 ) {

        this.effect( target );

    } else if ( active && this.constant && this.durationCounter > 1 ) {

        // Wait for entire duration

    } else if ( active && this.delayComplete() ) {

        this.resetDelay();
        this.effect( target );

    } else if ( active && !this.delayComplete() ) {

        this.updateDelay();

    } else if ( !active ) {

        this.undo( target );

    }
};


Status.prototype.getRenderTemplate = function getRenderTemplate() {
    return this.renderTemplate;
};
