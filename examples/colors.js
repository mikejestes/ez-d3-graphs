
(function() {

    var colors = [],
        scale = d3.scale.category20(),
        parent = document.getElementById('colors'),
        el;

    colors.push('#fff');
    colors.push('#000');
    colors.push('#ccc');

    for (var i = 0; i < 20; i++) {
        colors.push(scale(i));
    }

    scale = d3.scale.category20b();
    for (var i = 0; i < 20; i++) {
        colors.push(scale(i));
    }

    scale = d3.scale.category20c()
    for (var i = 0; i < 20; i++) {
        colors.push(scale(i));
    }

    for (var i = 0; i < colors.length; i++) {
        el = document.createElement('div');
        el.setAttribute('style', 'background-color: ' + colors[i] + '; color: ' + ezD3Graphs.oppositeColor(colors[i]));
        el.innerHTML = 'Text';

        parent.appendChild(el);
    }


})();
