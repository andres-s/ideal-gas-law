var Vector = gases.Vector;
var internalFuncs = gases.exposedforTESTINGONLY;
var Molecule = internalFuncs.Molecule;
var MoleculeCollection = internalFuncs.MoleculeCollection;



/*************************************
 * Molecule Unit Tests
 *************************************/
QUnit.test('getCentre test', function( assert ) {
    var mol1 = new Molecule(0, 0, 1);
    var mol2 = new Molecule(0, 1, 1);
    var mol3 = new Molecule(3, 3, 2);

    function testCentre(mol, expectedx, expectedy) {
        var molCentre = mol.getCentre();
        assert.ok(molCentre.x === expectedx, 'centre x coord wrong');
        assert.ok(molCentre.y === expectedy, 'centre y coord wrong');
    }

    testCentre(mol1, 0, 0);
    testCentre(mol2, 0, 1);
    testCentre(mol3, 3, 3);
});

QUnit.test('getRadius test', function (assert) {
    var mol1 = new Molecule(0, 0, 1);
    var mol2 = new Molecule(0, 1, 1.5);
    var mol3 = new Molecule(3, 3, 2);

    assert.strictEqual(mol1.getRadius(), 1, 'getRadius bad');
    assert.strictEqual(mol2.getRadius(), 1.5, 'getRadius bad');
    assert.strictEqual(mol3.getRadius(), 2, 'getRadius bad');
});

QUnit.test('Centre distance squared test', function( assert ) {
    var mol1 = new Molecule(0, 0, 1);
    var mol2 = new Molecule(0, 1, 1);
    var mol3 = new Molecule(3, 3, 2);

    assert.strictEqual(mol1._centreDistSqrd(mol2), 1,
              'Square of the distances between circle centres incorrectly calculated');
    assert.strictEqual(mol1._centreDistSqrd(mol3), 18,
              'Square of the distances between circle centres incorrectly calculated');
    assert.strictEqual(mol2._centreDistSqrd(mol3), 13,
              'Square of the distances between circle centres incorrectly calculated');
});


QUnit.test('Collision test', function( assert ) {
    var mol1 = new Molecule(0, 0, 1);
    var mol2 = new Molecule(0, 1, 1);
    var mol3 = new Molecule(3, 3, 2);

    assert.ok(mol1.collides(mol2), 'Collision 1 not detected');
    assert.ok(!mol1.collides(mol3), 'Collision 2 false positive');
});


QUnit.module('Molecule movement tests', {
    setup: function() {
        mol1 = new Molecule(0, 0, 1, 0, 0);
        mol2 = new Molecule(0, 1, 1.5, -2, 1.5);
        mol3 = new Molecule(3, 3, 2, -10, -20);
    }
});

QUnit.test("velocity get/set", function (assert) {
    assert.strictEqual(mol1.getVelocity().x, 0,
                       'Molecule constructor/getVelocity bad');
    assert.strictEqual(mol1.getVelocity().y, 0,
                       'Molecule constructor/getVelocity bad');
    assert.strictEqual(mol2.getVelocity().x, -2,
                       'Molecule constructor/getVelocity bad');
    assert.strictEqual(mol2.getVelocity().y, 1.5,
                       'Molecule constructor/getVelocity bad');
    assert.strictEqual(mol3.getVelocity().x, -10,
                       'Molecule constructor/getVelocity bad');
    assert.strictEqual(mol3.getVelocity().y, -20,
                       'Molecule constructor/getVelocity bad');

    mol1.setVelocity(new Vector(1, 1));
    assert.strictEqual(mol1.getVelocity().x, 1,
                       'Molecule set/getVelocity bad');
    assert.strictEqual(mol1.getVelocity().y, 1,
                       'Molecule set/getVelocity bad');
    mol1.setVelocity(new Vector(2000, -1.77));
    assert.strictEqual(mol1.getVelocity().x, 2000,
                       'Molecule set/getVelocity bad');
    assert.strictEqual(mol1.getVelocity().y, -1.77,
                       'Molecule set/getVelocity bad');
    mol1.setVelocity(new Vector(0, 0));
    assert.strictEqual(mol1.getVelocity().x, 0,
                       'Molecule set/getVelocity bad');
    assert.strictEqual(mol1.getVelocity().y, 0,
                       'Molecule set/getVelocity bad');
});

QUnit.test("advance test", function (assert) {
    var newCentre1 = mol1.advance(1).getCentre();
    assert.strictEqual(newCentre1.x, 0, 'Molecule.advance bad');
    assert.strictEqual(newCentre1.y, 0, 'Molecule.advance bad');

    var newCentre2 = mol2.advance(1).getCentre();
    assert.strictEqual(newCentre2.x, -2, 'Molecule.advance bad');
    assert.strictEqual(newCentre2.y, 2.5, 'Molecule.advance bad');

    var newCentre3 = mol3.advance(0).getCentre();
    assert.strictEqual(newCentre3.x, 3, 'Molecule.advance bad');
    assert.strictEqual(newCentre3.y, 3, 'Molecule.advance bad');
});

/*************************************
 * MoleculeCollection Unit Tests
 *************************************/
QUnit.module('MoleculeCollection tests', {
    setup: function() {
        mol1 = new Molecule(0, 0, 1);
        mol2 = new Molecule(0, 1, 1);
        mol3 = new Molecule(3, 3, 2);
        
        collEmpty = new MoleculeCollection();
        
        collFull = new MoleculeCollection();
        collFull.addMolecule(mol1);
        collFull.addMolecule(mol3);
    }
});

QUnit.test('Add molecule test', function(assert) {
    var firstAdd = collEmpty.addMolecule(mol1);
    assert.strictEqual(firstAdd, true, "addMolecule didn't add");
    var secondAdd = collEmpty.addMolecule(mol2);
    assert.strictEqual(secondAdd, false, 'addMolecule bad');
    var thirdAdd = collEmpty.addMolecule(mol3);
    assert.strictEqual(firstAdd, true, "addMolecule didn't add");
});

QUnit.test("getMolecules test", function (assert) {
    var emptyMolecules = Object.keys(collEmpty.getMolecules());
    assert.strictEqual(emptyMolecules.length, 0, 'should have no molecules');

    function testMoleculeEquality(mol1, mol2) {
        var c1 = mol1.getCentre();
        var r1 = mol1.getRadius();
        var v1 = mol1.getVelocity();
        var c2 = mol2.getCentre();
        var r2 = mol2.getRadius();
        var v2 = mol2.getVelocity();
        assert.strictEqual(c1.x, c2.x, '');
        assert.strictEqual(c1.y, c2.y, '');
        assert.strictEqual(v1.x, v2.x, '');
        assert.strictEqual(v1.y, v2.y, '');
        assert.strictEqual(r1, r2, '');
    }

    var fullMolecules = collFull.getMolecules();
    var expected = {
        '0': mol1,
        '1': mol3
    };
    for (var prop in fullMolecules) {
        if (Object.hasOwnProperty.call(fullMolecules, prop))
            testMoleculeEquality(fullMolecules[prop], expected[prop]);
    }
    
});


/*************************************
 * GasBox Unit Tests
 *************************************/
// QUnit.module("GasBox tests", {
//     setup: function() {
//         box = new GasBox()
//         mol1 = new Molecule(2, 2, 1, -5, 0);
//         mol2 = new Molecule(2, 2, 1, -5, 0);)
//     }
// });