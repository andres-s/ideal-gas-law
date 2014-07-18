
var userinterface =  (function () {
    
    var Animator = animator.Animator;

    var START_CLASS = 'start-button',
        STOP_CLASS  = 'stop-button';


    function UserInterface(animation) {
        this._animation = new Animator(document.getElementById('box'));
        this._stopstart = new StopStartButton();
        this._runningRealTime = true;
        this._stopstart
            .addEventListener('click', 
                              this.toggleRealTime.bind(this));
    }

    UserInterface.prototype.toggleRealTime = function() {
        if (this._runningRealTime) {
            this._animation.stop();
            this._stopstart.displayStart();
        } else {
            this._animation.realTimeAnimate();
            this._stopstart.displayStop();
        }
        this._runningRealTime = !this._runningRealTime;
    };

    function StopStartButton () {
        this._labelElem = document.getElementById('stop-start-button');
    }

    StopStartButton.prototype.displayStart = function() {
        this._labelElem.innerHTML = 'Start';
        this._labelElem.classList.remove(STOP_CLASS);
        this._labelElem.classList.add(START_CLASS);
    };

    StopStartButton.prototype.displayStop = function() {
        this._labelElem.innerHTML = 'Stop';
        this._labelElem.classList.remove(START_CLASS);
        this._labelElem.classList.add(STOP_CLASS);
    };

    StopStartButton.prototype.addEventListener = function() {
        this._labelElem.addEventListener.apply(this._buttonElem, arguments);
    };

    return {
        UserInterface: UserInterface
    };
})();