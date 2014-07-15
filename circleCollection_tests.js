var Vector = gases.Vector,
    Molecule = gases.exposedforTESTINGONLY.Molecule,
    internalFuncs = controller.exposedforTESTINGONLY,
    CircleCollection = internalFuncs.CircleCollection,
    SVGCircle = internalFuncs.SVGCircle;

var WRAPPER_DIV_HEIGHT = 1000,
    WRAPPER_DIV_WIDTH = 1000;


function setupFixture() {
    var boxAndWrapper = $( 
        '<div id="wrapper" style="width:' + WRAPPER_DIV_WIDTH + 'px; height:' + WRAPPER_DIV_HEIGHT +'px;">' +
            '<svg id="box" style="height:100%; width:100%;" ' +
                'version="1.1" ' +
                'baseProfile="full" ' +
                'xmlns="http://www.w3.org/2000/svg"></svg>' +
        '</div>' );
    $( '#qunit-fixture' ).append(boxAndWrapper);
}

QUnit.test("test fixture setup", function (assert) {
    setupFixture();
    assert.strictEqual($( '#box' ).length, 1, "haven't picked up the box");
    assert.strictEqual($( '#box' ).height(), WRAPPER_DIV_HEIGHT, "height incorrect");
});


/*************************************
 * SVGCircle Unit Tests
 *************************************/
QUnit.test("SVGCircle tests", function (assert) {
    var testName = "SVGCircle tests",
        c1 = new Vector(10, 10),
        circle = new SVGCircle(c1, 1);

    tlib.testVectorEquality(assert, circle.getCentre(), c1, testName);

    var c2 = new Vector(11, 11);
    circle.setCentre(c2);
    tlib.testVectorEquality(assert, circle.getCentre(), c2, testName);    
});


function testAttributes(assert, htmlElem, attrs, msg) {
    msg = msg || '';
    for (var attr in attrs)
        assert.strictEqual($(htmlElem).attr(attr), attrs[attr],
                           msg + ' attribute ' + attr + ' bad');

}

/*************************************
 * CircleCollection Unit Tests
 *************************************/
 QUnit.test("CircleCollection", function (assert) {
    var testName = 'CircleCollection test';
    setupFixture();
    var box = document.getElementById('box');
    var coll = new CircleCollection(box);

    assert.strictEqual($('circle').length, 0, "circles when there shouldn't be");

    coll.update( {'0': new Molecule(20, 15, 1)} );
    var expected = {
        'cx': '20', 'cy': '15', 'r': '1'
    };
    assert.strictEqual($('circle').length, 1, 'bad num of circles');
    testAttributes(assert, $('circle'), expected, testName);

 });