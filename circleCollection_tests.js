var internalFuncs = controller.exposedforTESTINGONLY,
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

