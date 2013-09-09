define(['seshat'],
function(seshat){
    var max = function(x, y) { return x > y ? x : y; };
    
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
    
    var ordered = function(root) {
        if (!root)
            return;
        if (root.left) {
            assert.ok(compareInt(root.left.key, root.key) < 0)
            ordered(root.left);
        }
        if (root.right) {
            assert.ok(compareInt(root.right.key, root.key) > 0)
            ordered(root.right);
        }
    };
    
    var compareInt = function(x, y) { return x - y; };
    
    return {
        'module': "Tree",
        'tests': [
            ["Lookup nonexistant returns null",
            function(){
                var m = seshat.create(compareInt);
                assert.equal(seshat.lookup(m, 0, 0), null);
            }],
            ["Insert single key",
            function(){
                var m = seshat.create(compareInt);
                
                m = seshat.update(m, 1, 0, 0);
                assert.equal(height(m.root), 0);
                assert.equal(seshat.lookup(m, 1, 0), 0);
                
                for (var i = 1; i < 5; ++i)
                    m = seshat.update(m, 1, i, i);
                
                for (var i = 0; i < 5; ++i)
                    assert.equal(seshat.lookup(m, 1, i), i);
            }],
            ["Insert Simple Multiple keys",
            function(){
                var m = seshat.create(compareInt);
                for (var i = 0; i < 3; ++i)
                    for (var g = 0; g < 2; ++g)
                        m = seshat.update(m, i, g, [i, g]);
                
                assert.equal(height(m.root), 1);
                for (var i = 0; i < 3; ++i)
                    for (var g = 0; g < 2; ++g)
                        assert.deepEqual(seshat.lookup(m, i, g), [i, g]);
            }],
            ["Insert Multiple Increasing rebalance",
            function(){
                var m = seshat.create(compareInt);
                for (var i = 0; i < 16; ++i)
                    m = seshat.update(m, i, 0, [i, 0]);
                
                assert.equal(height(m.root), 4);
            }],
            ["Insert Multiple Random rebalance",
            function(){
                var m = seshat.create(compareInt);
                
                var z = [13, 5, 3, 14, 12, 11, 0, 1, 15, 7, 4, 8, 6, 10, 2, 9];
                for (var i = 0; i < z.length; ++i)
                    m = seshat.update(m, z[i], 0, [z[i], 0]);
                
                ordered(m.root);
                assert.equal(height(m.root), 4);
                for (var i = 0; i < 16; ++i)
                    assert.deepEqual(seshat.lookup(m, z[i], 0), [z[i], 0]);
            }],
        ],
    };
});
