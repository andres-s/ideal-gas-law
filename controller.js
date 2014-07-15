
var controller = (function () {

    'use strict';

    var svgNS = "http://www.w3.org/2000/svg";

    var GasBox = gases.GasBox;
    var RandomGasBox = gases.RandomGasBox;
    var SimpleGasBox = gases.SimpleGasBox;
    var Vector = gases.Vector;

    function BoxController (boxHTMLElem, boxModel) {
        this._htmlElem = boxHTMLElem;
        if (boxModel)
            this._model = boxModel;
        else {
            // this._model = new SimpleGasBox(this._htmlElem.clientWidth, 
            //                                this._htmlElem.clientHeight);
            this._model = new RandomGasBox(this._htmlElem.clientWidth, 
                                           this._htmlElem.clientHeight,
                                           5, 40);
        }
        this._circles = new CircleCollection(boxHTMLElem);
    }

    BoxController.prototype.advance = function(millisElapsed) {
        this._model.setHeight(this.getDOMBoxHeight());
        this._model.setWidth(this.getDOMBoxWidth());

        if (this._millisElapsed) {
            var delta = millisElapsed - this._millisElapsed;
            this._model.advance(delta);
        }
        this._millisElapsed = millisElapsed;
        var modelState = this._model.getMolecules();
        this._circles.update(modelState);
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
                    //note we don't update radii
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
        this._svgElem.setAttributeNS(null, "fill", "#333");
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
        
        BoxController: BoxController,

        exposedforTESTINGONLY: {
            CircleCollection: CircleCollection,
            SVGCircle: SVGCircle
        }
    };

})();