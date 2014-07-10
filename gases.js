
var GasBox = (function() {

    var svgNS = "http://www.w3.org/2000/svg";

    function GasBox(htmlElem, numMolecules, moleculeRadius) {
        this._htmlElem = htmlElem;
        this._initialise(numMolecules, moleculeRadius);
        return this;
    }

    GasBox.prototype.height = function() {
        return this._htmlElem.clientHeight;
    };

    GasBox.prototype.width = function() {
        return this._htmlElem.clientWidth;
    };

    GasBox.prototype._initialise = function(numMolecules, moleculeRadius) {

        var heightRange = this.height() - 2*moleculeRadius;
        var widthRange  = this.width() - 2*moleculeRadius;
        
        for (var i = 0; i < numMolecules; i++) {
            var x = Math.random() * widthRange + moleculeRadius;
            var y = Math.random() * heightRange + moleculeRadius;
            this._placeCircle(x, y, moleculeRadius);
        }
    };

    GasBox.prototype._placeCircle = function(x, y, r) {
        r = r || 10;
        var myCircle = document.createElementNS(svgNS, 'circle');
        myCircle.setAttributeNS(null, "cx", x);
        myCircle.setAttributeNS(null, "cy", y);
        myCircle.setAttributeNS(null, "r", r);
        myCircle.setAttributeNS(null, "fill","black");
        myCircle.setAttributeNS(null, "stroke","none");
        this._htmlElem.appendChild(myCircle);
    };

    return GasBox;

})();

(function() {

    var gasBox = new GasBox(document.getElementById('box'), 1, 10);

})();