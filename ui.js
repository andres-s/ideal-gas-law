
var userinterface =  (function () {
    
    var Animator = animator.Animator;

    var START_CLASS = 'start-button',
        STOP_CLASS  = 'stop-button',
        PRESS_CLASS = 'pressable',
        DELTA_MILLIS = 13;


    function UserInterface(animation) {
        this._animation = new Animator(document.getElementById('box'));
        this._runningRealTime = true;

        this._stepButton = new StepButton(this.step.bind(this));
        this._stepButton.disable();

        this._stopstartButton = new StopStartButton();
        this._stopstartButton
            .addEventListener('click', 
                              this.toggleRealTime.bind(this));
    }

    UserInterface.prototype.toggleRealTime = function() {
        if (this._runningRealTime) {
            this._animation.stop();
            this._stopstartButton.displayStart();
            this._stepButton.enable();
        } else {
            this._animation.realTimeAnimate();
            this._stepButton.disable();
            this._stopstartButton.displayStop();
        }
        this._runningRealTime = !this._runningRealTime;
    };

    UserInterface.prototype.step = function() {
        this._animation.manualAdvance(DELTA_MILLIS);
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
        this._labelElem.addEventListener.apply(this._labelElem, arguments);
    };


    function StepButton (stepFunction) {
        this._stepFunction = stepFunction;
        this._buttonElem = document.getElementById('step-button');
    }

    StepButton.prototype.disable = function() {
        this._buttonElem.removeEventListener('click', this._stepFunction);
        this._buttonElem.classList.remove(PRESS_CLASS);
    };

    StepButton.prototype.enable = function() {
        this._buttonElem.classList.add(PRESS_CLASS);
        this._buttonElem.addEventListener('click', this._stepFunction);
    };


    return {
        UserInterface: UserInterface
    };
})();