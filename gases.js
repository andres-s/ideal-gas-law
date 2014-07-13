
var gases = (function() {

    'use strict';

    var svgNS = "http://www.w3.org/2000/svg";

    function GasBox(htmlElem, numMolecules, moleculeRadius) {
        this._htmlElem = htmlElem;
        this._molecules = new MoleculeCollection(this);
        this._initialise(numMolecules, moleculeRadius);
        return this;
    }

    GasBox.prototype.height = function() {
        return this._htmlElem.clientHeight;
    };

    GasBox.prototype.width = function() {
        return this._htmlElem.clientWidth;
    };


    GasBox.prototype.advance = function(timeDeltaMillis) {
        this._molecules.advance(timeDeltaMillis);
    };

    GasBox.prototype.bounce = function(mol) {
        var molCentre = mol.getCentre();
        var molRadius = mol.getRadius();
        var molVel = mol.getVelocity();
        var xCentreMax = this.width() - molRadius;
        var yCentreMax = this.height() - molRadius;
        var xBounced = this._bounce1D(molRadius, xCentreMax, 
                                      molCentre.x, molVel.x);
        var yBounced = this._bounce1D(molRadius, yCentreMax, 
                                      molCentre.y, molVel.y);
        mol.setCentre(new Vector(xBounced.pos, yBounced.pos));
        mol.setVelocity(new Vector(xBounced.vel, yBounced.vel));
    };

    GasBox.prototype._bounce1D = function(min, max, pos, vel) {
        if (pos < min) {
            pos += 2 * (min - pos);
            vel *= -1;
        } else if (pos > max) {
            pos -= 2 * (pos - max);
            vel *= -1;
        }
        return {
            pos: pos,
            vel: vel
        };
    };

    GasBox.prototype._initialise = function(numMolecules, moleculeRadius) {

        var heightRange = this.height() - 2*moleculeRadius;
        var widthRange  = this.width() - 2*moleculeRadius;
        
        for (var i = 0; i < numMolecules; i++) {

            var pos = randomVector(widthRange, heightRange, moleculeRadius, moleculeRadius);
            var mol = new Molecule(pos.x, pos.y, moleculeRadius);

            while ( ! this._molecules.addMolecule(mol) ) {
                mol.setCentre(
                    randomVector(widthRange, heightRange, 
                                moleculeRadius, moleculeRadius));
            }

            this._htmlElem.appendChild(mol.svgElem());
        }

    };


    function MoleculeCollection(box) {
        this._box = box;
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

    MoleculeCollection.prototype.advance = function(timeDeltaMillis) {
        this._molecules.map(function (mol) {
            mol.advance(timeDeltaMillis);
            this._box.bounce(mol);
        });
    };


    /**
     * Model of a circular gas molecule
     * @param {Number} x  pixels from left
     * @param {Number} y  pixels from top
     * @param {Number} r  radius of molecule
     * @param {Number} vx x-velocity in pixels/millisecond
     * @param {Number} vy y-velocity in pixels/millisecond
     */
    function Molecule(x, y, r, vx, vy) {
        r = r || 10; // note this prevents r = 0
        vx = vx || 0;
        vy = vy || 0;

        this._centre = new Vector(x, y);
        this._radius = r;
        this._velocity = new Vector(vx, vy);

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
        return this;
    };

    Molecule.prototype.getVelocity = function() {
        return this._velocity;
    };

    Molecule.prototype.setVelocity = function(vector) {
        this._velocity = vector;
        return this;
    };

    Molecule.prototype.getRadius = function() {
        return this._radius;
    };

    Molecule.prototype.advance = function(timeDeltaMillis) {
        var newx = this._centre.x + this._velocity.x*timeDeltaMillis;
        var newy = this._centre.y + this._velocity.y*timeDeltaMillis;
        this.setCentre(new Vector(newx, newy));
        return this;
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

    function randomVector(xrange, yrange, xoffset, yoffset) {
        if (typeof(xoffset) !== 'number')
            xoffset = 0;
        if (typeof(yoffset) !== 'number')
            yoffset = 0;
        var x = Math.random() * xrange + xoffset;
        var y = Math.random() * yrange + yoffset;
        return new Vector(x, y);
    }

    function Vector(x, y) {
        // note x and y properties are non-writeable
        Object.defineProperty(this, 'x',
                              { value: x, enumerable: true });
        Object.defineProperty(this, 'y', 
                              { value: y, enumerable: true });
    }

    Vector.prototype.add = function(otherPt) {
        return new Vector(this.x + otherPt.x, this.y + otherPt.y);
    };

    return {

        GasBox: GasBox,

        exposedforTESTINGONLY: {
            Vector: Vector,
            Molecule: Molecule,
            MoleculeCollection: MoleculeCollection
        }

    };

})();
