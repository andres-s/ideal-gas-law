
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
        this._molecules = []; // NOT sparse array, if we delete molecules
        return this;
    }

    // Returns true if addition was successful, false otherwise
    MoleculeCollection.prototype.addMolecule = function(molecule) {
        if (this._getCollider(molecule) !== null)
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

    MoleculeCollection.prototype.advance0 = function(timeDeltaMillis) {
        var self = this;
        this._molecules.forEach(function (mol, idx) {
            self.advanceMol0(idx, timeDeltaMillis);
        });
    };

    MoleculeCollection.prototype.advanceMol0 = function(molId, timeDeltaMillis) {
        var mol = this._molecules[molId];
        mol.advance(timeDeltaMillis);
        this._box.bounce(mol);
        var collider = this._getCollider(molId);
        if (collider !== null) {
            var backtrackTime = mol._backtrackToContactWith(collider);
            mol.advance(-backtrackTime);
            mol.collideWith(collider);
            timeDeltaMillis -= backtrackTime;
            mol.advance(timeDeltaMillis);
            this._box.bounce(mol);
        }

    };

    MoleculeCollection.prototype.advance1 = function(timeDeltaMillis) {

        var self = this;
        this._molecules.forEach(function (mol) {
            mol.advance(timeDeltaMillis);
            self._box.bounce(mol);
        });

        var postCollisionVels = this._molecules.map(function () {
            return [];
        });

        this._molecules.forEach(function(mol, i, molcoll) {
            molcoll.slice(i + 1).forEach(function(othermol, j) {

                if (mol.collides(othermol) && mol.areMovingCloser(othermol)) {
                    
                    postCollisionVels[i].push(
                        mol.getPostCollisionVel(othermol)
                    );
                    postCollisionVels[j].push(
                        othermol.getPostCollisionVel(mol)
                    );

                }

            });
        });

        var mollarr = this._molecules;
        postCollisionVels.forEach(function(newVels, idx) {
            if (newVels.length === 0) 
                return;

            var avgNewVel = _avgVec(newVels);

            mollarr[idx].setVelocity(avgNewVel);
        });

    };

    MoleculeCollection.prototype.advance = MoleculeCollection.prototype.advance0;

    // Can we do this without molId, ie. compare pointers to Molecule objects?
    MoleculeCollection.prototype._getCollider = function(molOrMolId) {
        var mol, molId;
        if (typeof(molOrMolId) !== 'object') {
            molId = Number(molOrMolId);
            mol = this._molecules[molId];
        } else {
            molId = -1;
            mol = molOrMolId;
        }

        for (var i = 0; i < this._molecules.length; i++)
            if (molId !== i && this._molecules[i].collides(mol))
                return this._molecules[i];
        
        return null;
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

    Molecule.prototype.collideWith = function(mol) {
        var p1 = this.getCentre(),
            p2 = mol.getCentre(),
            v1 = this.getVelocity(),
            v2 = mol.getVelocity();
        var r1 = this.getRadius();
        var m1 = r1*r1; // note that we are assuming density is constant
        var r2 = mol.getRadius();
        var m2 = r2*r2;

        this.setVelocity(_calculatePostCollisionVelocity(v1, v2, p1, p2, m1, m2));
        mol.setVelocity(_calculatePostCollisionVelocity(v2, v1, p2, p1, m2, m1));
    };

    Molecule.prototype.getPostCollisionVel = function(mol) {
        var p1 = this.getCentre(),
            p2 = mol.getCentre(),
            v1 = this.getVelocity(),
            v2 = mol.getVelocity();
        var r1 = this.getRadius();
        var m1 = r1*r1; // note that we are assuming density is constant
        var r2 = mol.getRadius();
        var m2 = r2*r2;

        return _calculatePostCollisionVelocity(v1, v2, p1, p2, m1, m2);
    };

    // see http://en.wikipedia.org/wiki/Elastic_collision#Two-Dimensional_Collision_With_Two_Moving_Objects
    function _calculatePostCollisionVelocity(v1, v2, p1, p2, m1, m2) {
        var coeffNum = 2 * m2 * innerProd(v1.subt(v2), p1.subt(p2));
        var coeffDen = (m1 + m2) * innerProd(p1.subt(p2), p1.subt(p2));
        return v1.subt( p1.subt(p2) .mult( coeffNum/coeffDen ) );
    }

    Molecule.prototype.collides = function(otherMol) {
        var distanceSquared = this._centreDistSqrd(otherMol);
        var sumRadiusSquared = Math.pow((this.getRadius() + otherMol.getRadius()), 2);
        return distanceSquared <= sumRadiusSquared;
    };

    Molecule.prototype._centreDistSqrd = function(otherMol) {
        var thisCentre = this.getCentre(),
            otherCentre = otherMol.getCentre();
        return Math.pow((thisCentre.x - otherCentre.x), 2) + 
               Math.pow((thisCentre.y - otherCentre.y), 2);
    };

    Molecule.prototype._backtrackToContactWith = function(mol) {
        
        var thisCentre = this.getCentre(),
            molCentre = mol.getCentre(),
            thisVel = this.getVelocity();
        var r1 = this.getRadius(),
            r2 = mol.getRadius(),
            x = thisCentre.x,
            y = thisCentre.y,
            a = molCentre.x,
            b = molCentre.y,
            u = thisVel.x,
            v = thisVel.y,
            surd = Math.pow((a-x+b-y), 2) + 
                   (u*u + v*v)*((r1+r2)*(r1+r2) - (a-x)*(a-x) - (b-y)*(b-y)),
            numerator = x-a+y-b + Math.sqrt(surd);
        return numerator / (u*u + v*v);
    };

    Molecule.prototype.areMovingCloser = function(mol) {
        var velDiff = this.getVelocity().subt(mol.getVelocity());
        var posDiff = this.getCentre().subt(mol.getCentre());
        return innerProd(velDiff, posDiff) > 0;
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

    Vector.prototype.mult = function(scalar) {
        return new Vector(scalar * this.x, scalar * this.y);
    };

    Vector.prototype.subt = function(vec) {
        return new Vector(this.x - vec.x, this.y - vec.y);
    };

    Vector.prototype.innerProd = function(otherVec) {
        return innerProd(this, otherVec);
    };

    function innerProd(v1, v2) {
        return v1.x*v2.x + v1.y*v2.y;
    }

    function _avgVec(vectorArr) {
        if (vectorArr.length === 0)
            return;

        var avg = new Vector(0, 0);
        vectorArr.forEach(function(v) {
            avg = avg.add(v);
        });
        avg = avg.mult( 1/vectorArr.length );

        return avg;
    }

    return {

        GasBox: GasBox,
        SimpleGasBox: SimpleGasBox,
        RandomGasBox: RandomGasBox,

        Vector: Vector,

        exposedforTESTINGONLY: {
            Molecule: Molecule,
            MoleculeCollection: MoleculeCollection,
            innerProd: innerProd,
            avgVec: _avgVec,
            "_calculatePostCollisionVelocity": _calculatePostCollisionVelocity
        }

    };

})();
