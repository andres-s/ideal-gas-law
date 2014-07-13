
var gases = (function() {

    'use strict';

    var svgNS = "http://www.w3.org/2000/svg";

    function RandomGasBox(width, height, numMolecules, moleculeRadius) {
        var gasBox = new GasBox(width, height);
        gasBox._initialise(numMolecules, moleculeRadius);
        return gasBox;
    }

    function SimpleGasBox(width, height) {
        var gasBox = new GasBox(width, height);
        gasBox._molecules.addMolecule(
            new Molecule(100, 100, 20, -0.3, -0.3));
        return gasBox;
    }

    function GasBox(width, height) {
        this._height = height;
        this._width = width;
        this._molecules = new MoleculeCollection(this);
        return this;
    }

    GasBox.prototype.height = function() {
        return this._height;
    };

    GasBox.prototype.width = function() {
        return this._width;
    };

    GasBox.prototype.setHeight = function(h) {
        this._height = h;
        return this;
    };

    GasBox.prototype.setWidth = function(w) {
        this._width = w;
        return this;
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

    GasBox.prototype.getMolecules = function() {
        return this._molecules.getMolecules();
    };

    GasBox.prototype._initialise = function(numMolecules, moleculeRadius) {

        var heightRange = this.height() - 2*moleculeRadius;
        var widthRange  = this.width() - 2*moleculeRadius;
        
        for (var i = 0; i < numMolecules; i++) {

            var pos = randomVector(widthRange, heightRange, moleculeRadius, moleculeRadius);
            var vel = randomVector(-0.7, -0.7, 0, 0);
            var mol = new Molecule(pos.x, pos.y, moleculeRadius, vel.x, vel.y);

            while ( ! this._molecules.addMolecule(mol) ) {
                mol.setCentre(
                    randomVector(widthRange, heightRange, 
                                moleculeRadius, moleculeRadius));
            }
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
            ret[String(idx)] = elem;
        });
        return ret;
    };

    MoleculeCollection.prototype.advance = function(timeDeltaMillis) {
        self = this;
        this._molecules.forEach(function (mol) {
            mol.advance(timeDeltaMillis);
            self._box.bounce(mol);
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

        return this;
    }

    Molecule.prototype.getCentre = function () {
        return this._centre;
    };

    Molecule.prototype.setCentre = function (vec) {
        this._centre = vec;
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
        SimpleGasBox: SimpleGasBox,
        RandomGasBox: RandomGasBox,

        Vector: Vector,

        exposedforTESTINGONLY: {
            Molecule: Molecule,
            MoleculeCollection: MoleculeCollection
        }

    };

})();
