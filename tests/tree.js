var seshat = require('../dist_node/seshet');


var max = function(x, y) { return x > y ? x : y; };

var compareInt = function(x, y) { return x - y; };

var height = function(root) {
    return (!root ? 0 :
        max(
            (root.left ? 1 + height(root.left) : 0),
            (root.right ? 1 + height(root.right) : 0)));
};

var df = function(node) {
    return (!node ? 0 :
        (node.left ? 1 + height(node.left) : 0) - (node.right ? 1 + height(node.right): 0));
};

var checkOrdered = function(test, root) {
    if (!root)
        return;
    if (root.left) {
        test.ok(compareInt(root.left.key, root.key) < 0)
        checkOrdered(test, root.left);
    }
    if (root.right) {
        test.ok(compareInt(root.right.key, root.key) > 0)
        checkOrdered(test, root.right);
    }
};


exports.lookupNonExistant = function(test) {
    var m = seshat.create(compareInt);
    test.equal(seshat.lookup(m, 0, 0), null);
    test.done();
};

exports.insertSingle = function(test) {
    var m = seshat.create(compareInt);
    
    m = seshat.update(m, 1, 0, 0);
    test.equal(height(m.root), 0);
    test.equal(seshat.lookup(m, 1, 0), 0);
    
    for (var i = 1; i < 5; ++i)
        m = seshat.update(m, 1, i, i);
    
    for (var i = 0; i < 5; ++i)
        test.equal(seshat.lookup(m, 1, i), i);
    
    test.done();
};

exports.insertMultiple = function(test) {
    var m = seshat.create(compareInt);
    for (var i = 0; i < 3; ++i)
        for (var g = 0; g < 2; ++g)
            m = seshat.update(m, i, g, [i, g]);
    
    test.equal(height(m.root), 1);
    for (var i = 0; i < 3; ++i)
        for (var g = 0; g < 2; ++g)
            test.deepEqual(seshat.lookup(m, i, g), [i, g]);
    
    test.done();
};

exports.insertIncreasing = function(test) {
    var m = seshat.create(compareInt);
    for (var i = 0; i < 16; ++i)
        m = seshat.update(m, i, 0, [i, 0]);
    
    test.equal(height(m.root), 4);
    test.done();
};

exports.rebalance = function(test) {
    var m = seshat.create(compareInt);
    
    var z = [13, 5, 3, 14, 12, 11, 0, 1, 15, 7, 4, 8, 6, 10, 2, 9];
    for (var i = 0; i < z.length; ++i)
        m = seshat.update(m, z[i], 0, [z[i], 0]);
    
    checkOrdered(test, m.root);
    test.equal(height(m.root), 4);
    for (var i = 0; i < 16; ++i)
        test.deepEqual(seshat.lookup(m, z[i], 0), [z[i], 0]);
    
    test.done();
};

exports.insertSameIdGetsLatest = function(test) {
    var m = seshat.create(compareInt);
    for (var i = 1; i < 5; ++i)
        m = seshat.update(m, 0, 0, i);

    test.equal(seshat.lookup(m, 0, 0), 4);
    test.done();
};
