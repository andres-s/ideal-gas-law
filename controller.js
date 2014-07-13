
var GasBox = gases.GasBox;

var controller = (function () {
    
    'use strict';

    function BoxController (boxHTMLElem, boxModel) {
        this._htmlElem = boxHTMLElem;
        if (boxModel)
            this._model = boxModel;
        else {
            this._model = new GasBox();
            // extra initialisation maybe?
        }

        
    }

    BoxController.prototype.getBoxHeight = function() {
        return Number(this._htmlElem.clientHeight);
    };

    BoxController.prototype.getBoxWidth = function() {
        return Number(this._htmlElem.clientWidth);
    };    

    // BoxController.prototype. = function() {
        
    // };

})();