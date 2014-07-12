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


/*************************************
 * MoleculeCollection Unit Tests
 *************************************/
QUnit.module('MoleculeCollection tests', {
    setup: function() {
        mol1 = new Molecule(0, 0, 1);
        mol2 = new Molecule(0, 1, 1);
        mol3 = new Molecule(3, 3, 2);
        coll = new MoleculeCollection();
    }
});

QUnit.test('Add molecule test', function(assert) {
    var firstAdd = coll.addMolecule(mol1);
    assert.strictEqual(firstAdd, true, "addMolecule didn't add");
    var secondAdd = coll.addMolecule(mol2);
    assert.strictEqual(secondAdd, false, 'addMolecule bad');
    var thirdAdd = coll.addMolecule(mol3);
    assert.strictEqual(firstAdd, true, "addMolecule didn't add");
});
