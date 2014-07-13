
var controller = (function () {

    'use strict';

    var GasBox = gases.GasBox;

    function BoxController (boxHTMLElem, boxModel) {
        this._htmlElem = boxHTMLElem;
        if (boxModel)
            this._model = boxModel;
        else {
            this._model = new GasBox(this._htmlElem, 10, 10);
            // extra initialisation maybe?
        }
    }

    BoxController.prototype.getAnimator = function() {
        var self = this;
        var i = 0;
        return function(highResTimeStamp) {
            i = (i + 1) % 20;
            if (i === 0)
                console.log(highResTimeStamp);
        };
    };

    BoxController.prototype.getDOMBoxHeight = function() {
        return Number(this._htmlElem.clientHeight);
    };

    BoxController.prototype.getDOMBoxWidth = function() {
        return Number(this._htmlElem.clientWidth);
    };    


    return {
        
        BoxController: BoxController

    };

})();