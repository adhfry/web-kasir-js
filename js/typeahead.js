(function($) {
    'use strict';

    async function fetchProductNames() {
        // Get all products from IndexedDB
        let products = await getAllProducts();
        return products.map(product => product.name);
    }

    $(document).ready(async function() {
        // Fetch product names from IndexedDB
        let productNames = await fetchProductNames();

        var substringMatcher = function(strs) {
            return function findMatches(q, cb) {
                var matches = [];
                var substrRegex = new RegExp(q, 'i');
                strs.forEach(str => {
                    if (substrRegex.test(str)) {
                        matches.push(str);
                    }
                });
                cb(matches);
            };
        };

        $('#the-basics .typeahead').typeahead({
            hint: true,
            highlight: true,
            minLength: 1
        }, {
            name: 'products',
            source: substringMatcher(productNames)
        });

        var products = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.whitespace,
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: productNames
        });

        $('#bloodhound .typeahead').typeahead({
            hint: true,
            highlight: true,
            minLength: 1
        }, {
            name: 'products',
            source: products
        });
    });
})(jQuery);
