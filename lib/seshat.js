/*
 * THIS FILE IS AUTO GENERATED from 'lib/seshat.kep'
 * DO NOT EDIT
*/
;
define([], function() {
    var max = function(x, y) {
        return ((x > y) ? x : y);
    }
    ;
    var height = function(root) {
        return (! root ? 0 : max((root.left ? (1 + height(root.left)) : 0), (root.right ? (1 + height(root.right)) : 0)));
    }
    ;
    var Window = function(lower, upper) {
        (this.lower = lower);
        (this.upper = upper);
    }
    ;
    var Cell = function(id, val, delegate) {
        (this.id = id);
        (this.val = val);
        (this.delegate = delegate);
    }
    ;
    (Cell.prototype.toString = function() {
        return ((((this.id + ":") + this.val) + ", ") + this.delegate);
    }
    );
    (Cell.lookup = function(base, id) {
        for(var cell = base;
         cell;(cell = cell.delegate))if ((cell.id === id))return cell.val;
        
        
        return null;
    }
    );
    var Node = function(key, cell, l, r, height) {
        (this.key = key);
        (this.cell = cell);
        (this.left = l);
        (this.right = r);
        (this.height = height);
    }
    ;
    (Node.prototype.compare = function(pos) {
        return this.key.compare(pos);
    }
    );
    (Node.setChildren = function(node, l, r) {
        return new Node(node.key, node.cell, l, r, (1 + max(height(l), height(r))));
    }
    );
    (Node.setLeft = function(node, l) {
        return Node.setChildren(node, l, node.right);
    }
    );
    (Node.setRight = function(node, r) {
        return Node.setChildren(node, node.left, r);
    }
    );
    (Node.lookup = function(root, compare, key, id) {
        for(var node = root;
         node;){
            var diff = compare(key, node.key);
            if ((diff === 0))return Cell.lookup(node.cell, id);
            
            (node = ((diff < 0) ? node.left : node.right));
        }
        
        return null;
    }
    );
    (Node.put = function(node, id, val) {
        return new Node(node.key, new Cell(id, val, node.cell), node.left, node.right, node.height);
    }
    );
    var rr = function(node) {
        return (! node ? node : Node.setLeft(node.right, Node.setRight(node, node.right.left)));
    }
    ;
    var ll = function(node) {
        return (! node ? node : Node.setRight(node.left, Node.setLeft(node, node.left.right)));
    }
    ;
    var lr = function(node) {
        return ll(Node.setLeft(node, rr(node.left)));
    }
    ;
    var rl = function(node) {
        return rr(Node.setRight(node, ll(node.right)));
    }
    ;
    var df = function(node) {
        return (! node ? 0 : ((node.left ? (1 + height(node.left)) : 0) - (node.right ? (1 + height(node.right)) : 0)));
    }
    ;
    (Node.update = function(root, compare, pos, id, val) {
        if (! root)return new Node(pos, new Cell(id, val, null), null, null, 0);
        
        var diff = compare(pos, root.key);
        if ((diff === 0))return Node.put(root, id, val);
        
        var node = ((diff < 0) ? Node.setLeft(root, Node.update(root.left, compare, pos, id, val)) : Node.setRight(root, Node.update(root.right, compare, pos, id, val)));
        var d = df(node);
        if ((d > 1))return ((df(node.left) <= - 1) ? lr(node) : ll(node));
        else if ((d < - 1))return ((df(node.right) >= 1) ? rl(node) : rr(node));
        else return node;
        
        
    }
    );
    (Node.rebalance = function(root) {
        var d = df(root);
        if (((d > 1) || (d < - 1))){
            var l = Node.rebalance(root.left);
            var r = Node.rebalance(root.right);
            var node = Node.setChildren(root, l, r);
            var d0 = df(root);
            if ((d0 > 1))return ((df(node.left) <= - 1) ? lr(node) : ll(node));
            else if ((d0 < - 1))return ((df(node.right) >= 1) ? rl(node) : rr(node));
            
            
        }
        
        return root;
    }
    );
    (Node.prune = function(root, compare, lower, upper) {
        if (! root)return root;
        
        if ((lower !== undefined)){
            var dl = compare(root.key, lower);
            if ((dl < 0))return Node.prune(root.right, compare, lower, upper);
            else if ((dl === 0))return Node.setChildren(root, null, Node.prune(root.right, compare, undefined, upper));
            
            
        }
        
        if (((upper !== undefined) && (compare(root.key, upper) >= 0)))return Node.prune(root.left, compare, lower, upper);
        
        return Node.setChildren(root, Node.prune(root.left, compare, lower, upper), Node.prune(root.right, compare, lower, upper));
    }
    );
    var Memoer = function(compare, root) {
        (this.compare = compare);
        (this.root = root);
    }
    ;
    (Memoer.setRoot = function(m, root) {
        return new Memoer(m.compare, root);
    }
    );
    var create = function(compare) {
        return new Memoer(compare, null, []);
    }
    ;
    var lookup = function(m, key, id) {
        return Node.lookup(m.root, m.compare, key, id);
    }
    ;
    var update = function(m, pos, id, val) {
        return Memoer.setRoot(m, Node.update(m.root, m.compare, pos, id, val));
    }
    ;
    var prune = function(m, lower, upper) {
        return Memoer.setRoot(m, Node.rebalance(Node.prune(m.root, m.compare, lower, upper)));
    }
    ;
    return ({
        "create": create,
        "lookup": lookup,
        "update": update,
        "prune": prune
    });
}
);
