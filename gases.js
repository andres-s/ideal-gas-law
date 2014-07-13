
var gases = (function() {

    'use strict';

    var svgNS = "http://www.w3.org/2000/svg";

    function GasBox(htmlElem, numMolecules, moleculeRadius) {
        this._htmlElem = htmlElem;
        this._molecules = new MoleculeCollection();
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

            var pos = randomPoint(widthRange, heightRange, moleculeRadius, moleculeRadius);
            var mol = new Molecule(pos.x, pos.y, moleculeRadius);

            while ( ! this._molecules.addMolecule(mol) ) {
                mol.setCentre(
                    randomPoint(widthRange, heightRange, 
                                moleculeRadius, moleculeRadius));
            }

            this._htmlElem.appendChild(mol.svgElem());
        }

    };


    function MoleculeCollection() {
        this._molecules = []; // sparse array, if we delete molecules
        return this;
    }

    // Returns true if addition was successful, false otherwise
    MoleculeCollection.prototype.addMolecule = function(molecule) {
        for (var i = 0; i < this._molecules.length; i++)
            if (this._molecules[i].collides(molecule))
                return false;
        

        this._molecules.push(molecule);
        return true;
    };


    MoleculeCollection.prototype.getMolecules = function() {
        var ret = {};
        this._molecules.forEach(function (elem, idx) {
            ret[idx] = elem;
        });
        return ret;
    };

    function Molecule(x, y, r) {
        r = r || 10; // note this prevents r = 0

        this._centre = new Point(x, y);
        this._radius = r;

        this._svgElem = document.createElementNS(svgNS, 'circle');
        this._svgElem.setAttributeNS(null, "cx", x);
        this._svgElem.setAttributeNS(null, "cy", y);
        this._svgElem.setAttributeNS(null, "r", r);
        this._svgElem.setAttributeNS(null, "fill", "black");
        this._svgElem.setAttributeNS(null, "stroke", "none");
        return this;
    }

    Molecule.prototype.svgElem = function () {
        return this._svgElem;
    };

    Molecule.prototype.getCentre = function () {
        return this._centre;
    };

    Molecule.prototype.setCentre = function (point) {
        this._centre = point;
        this._svgElem.setAttribute("cx", point.x);
        this._svgElem.setAttribute("cy", point.y);
    };

    Molecule.prototype.getRadius = function() {
        return this._radius;
    };

    Molecule.prototype.collides = function(otherMol) {
        var distanceSquared = this._centreDistSqrd(otherMol);
        var sumRadiusSquared = Math.pow((this.getRadius() + otherMol.getRadius()), 2);
        return distanceSquared <= sumRadiusSquared;
    };

    Molecule.prototype._centreDistSqrd = function(otherMol) {
        var thisCentre = this.getCentre();
        var otherCentre = otherMol.getCentre();
        return Math.pow((thisCentre.x - otherCentre.x), 2) + 
               Math.pow((thisCentre.y - otherCentre.y), 2);
    };

    function randomPoint(xrange, yrange, xoffset, yoffset) {
        if (typeof(xoffset) !== 'number')
            xoffset = 0;
        if (typeof(yoffset) !== 'number')
            yoffset = 0;
        var x = Math.random() * xrange + xoffset;
        var y = Math.random() * yrange + yoffset;
        return new Point(x, y);
    }

    function Point(x, y) {
        // note x and y properties are non-writeable
        Object.defineProperty(this, 'x',
                              { value: x, enumerable: true });
        Object.defineProperty(this, 'y', 
                              { value: y, enumerable: true });
    }

    Point.prototype.add = function(otherPt) {
        return new Point(this.x + otherPt.x, this.y + otherPt.y);
    };

    return {

        GasBox: GasBox,

        exposedforTESTINGONLY: {
            Point: Point,
            Molecule: Molecule,
            MoleculeCollection: MoleculeCollection
        }

    };

})();
