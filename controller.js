
var controller = (function () {

    'use strict';

    var svgNS = "http://www.w3.org/2000/svg";

    var GasBox = gases.GasBox;
    var Vector = gases.Vector;

    function BoxController (boxHTMLElem, boxModel) {
        this._htmlElem = boxHTMLElem;
        if (boxModel)
            this._model = boxModel;
        else {
            this._model = new GasBox(this._htmlElem, 1, 10);
            // extra initialisation maybe?
        }
        this._circles = new CircleCollection(boxHTMLElem);
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

    BoxController.prototype.advance = function(millisElapsed) {
        if (!this._millisElapsed) {
            this._millisElapsed = millisElapsed;
            var initState = this._model.getMolecules();
            this._circles.update(initState);
            return;
        }

        var delta = millisElapsed - this._millisElapsed;
        this._millisElapsed = millisElapsed;

        this._model.advance(delta);
        var newState = this._model.getMolecules();
        this._circles.update(newState);
    };


    BoxController.prototype.getDOMBoxHeight = function() {
        return Number(this._htmlElem.clientHeight);
    };

    BoxController.prototype.getDOMBoxWidth = function() {
        return Number(this._htmlElem.clientWidth);
    };


    function CircleCollection(boxHTMLElem) {
        this._boxHTMLElem = boxHTMLElem;
        this._circles = {};
        return this;
    }

    CircleCollection.prototype.update = function(molecules) {
        for (var prop in molecules)
            if (Object.hasOwnProperty.call(molecules, prop)) {
                if (this._circles[prop])
                    this._circles[prop].setCentre( molecules[prop].getCentre() );
                else {
                    var molCentre = molecules[prop].getCentre();
                    var molRadius = molecules[prop].getRadius();
                    var svgCircle = new SVGCircle(molCentre, molRadius);
                    this._boxHTMLElem.appendChild(svgCircle.getSVGElem());
                    this._circles[prop] = svgCircle;
                }
            }
    };

    function SVGCircle(centreVec, r) {
        r = r || 10; // note this prevents r = 0
        
        this._svgElem = document.createElementNS(svgNS, 'circle');
        this._svgElem.setAttributeNS(null, "cx", centreVec.x);
        this._svgElem.setAttributeNS(null, "cy", centreVec.y);
        this._svgElem.setAttributeNS(null, "r", r);
        this._svgElem.setAttributeNS(null, "fill", "black");
        this._svgElem.setAttributeNS(null, "stroke", "none");
        return this;
    }

    SVGCircle.prototype.getCentre = function() {
        var x = Number(this._svgElem.getAttribute("cx"));
        var y = Number(this._svgElem.getAttribute("cy"));
        return new Vector(x, y);
    };

    SVGCircle.prototype.setCentre = function(vec) {
        this._svgElem.setAttribute("cx", vec.x);
        this._svgElem.setAttribute("cy", vec.y);
        return this;
    };    

    SVGCircle.prototype.getSVGElem = function() {
        return this._svgElem;
    };

    return {
        
        BoxController: BoxController

    };

})();