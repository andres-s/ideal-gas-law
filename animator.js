
var animator = (function () {
    
    'use strict';

    var BoxController = controller.BoxController;

    function Animator() {
        this._controller = (new BoxController(
                                    document.getElementById('box')));
        this._animationId = window.requestAnimationFrame(this.getStepper());
    }

    Animator.prototype.getStepper = function() {
        var self = this;

        function step(highResTimeStamp) {
            self._controller.advance(highResTimeStamp);
            window.requestAnimationFrame(step);
        }

        return step;
    };

    return {
        Animator: Animator
    };

})();