QUnit.test( "kiem thu chuyen dong ", function( assert ) {
    var mangA = [
        [200, 350],
        [80, 300],
        [60, 220],
        [170, 200]
    ];
    var expected = true;
    var result1 =  shapeAnimation($('.test1'), mangA, 1);
    var result2 =  shapeAnimation($('.test2'), mangA, 1);
    assert.ok( expected==result1, "Passed!" );
    assert.ok( expected==result2, "Passed!" );
});