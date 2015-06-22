#!/usr/bin/env node
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _stdin = require('stdin');

var _stdin2 = _interopRequireDefault(_stdin);

var _gexf = require('gexf');

var _gexf2 = _interopRequireDefault(_gexf);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

// Main
function main(str) {
  var json = undefined;

  // Parsing JSON
  try {
    json = JSON.parse(str);
  } catch (e) {
    throw Error('Invalid JSON provided!');
  }

  // Initializing the graph
  var graph = {
    nodes: [{ id: 0, label: json.name }],
    edges: []
  };

  var nodesIndex = {},
      edgesIndex = {};

  // Reading the dependencies
  function recur(parentNode, deps, level) {

    (0, _lodash2['default'])(deps).forIn(function (data, name) {
      var node = nodesIndex[name];

      // Adding the node if it does not exist yet
      if (!node) {
        node = {
          id: graph.nodes.length,
          label: name,
          attributes: {
            level: level
          }
        };
        graph.nodes.push(node);
        nodesIndex[name] = node;
      }

      // Adding edge
      var key1 = parentNode.name + '||' + name,
          key2 = name + '||' + parentNode.name;

      if (!edgesIndex[key1] && !edgesIndex[key2]) {

        var edge = {
          id: graph.edges.length,
          source: parentNode.id,
          target: node.id,
          weight: 1
        };

        edgesIndex[key1] = edge;
        edgesIndex[key2] = edge;

        graph.edges.push(edge);
      } else {
        edgesIndex[key1].weight++;
      }

      // Need to recur?
      if (data.dependencies) recur(node, data.dependencies, level + 1);
    }).value();
  }

  recur(graph.nodes[0], json.dependencies, 0);

  // Building the gexf file
  var doc = _gexf2['default'].create({
    model: {
      node: [{
        id: 'level',
        title: 'Level',
        type: 'integer'
      }]
    },
    nodes: graph.nodes,
    edges: graph.edges
  });

  console.log(doc.serialize());
}

// Reading from stdin
(0, _stdin2['default'])(main);

