/*
 * ez-d3-graphs
 * https://github.com/mikejestes/ez-d3-graphs
 *
 * Copyright (c) 2012-2013 Mike Estes <mikejestes@gmail.com>
 * @license Licensed under the MIT license.
 *
 *
 */
(function (d3, window) {
    var expose = {},
        rad2deg = 180 / Math.PI,
        globalTickRatio = 25,
        defaultBottomGutterAxis = 20,
        BaseGraph = function () {};

