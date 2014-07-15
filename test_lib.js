var tlib = (function () {

    return {

        testVectorEquality: function (assert, v1, v2, msg) {
            msg = msg || '';
            assert.strictEqual(v1.x, v2.x, msg + ' x bad');
            assert.strictEqual(v1.y, v2.y, msg + ' y bad');
        }

    };

})();