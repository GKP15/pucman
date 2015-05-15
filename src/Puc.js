Pucman.Puc = (function() {
    return {
        add: function(pucman) {
            pucman.puc = this.add.sprite((14 * 16) + 8, (17 * 16) + 8, 'pacman', 0);
        }
    };
})();
