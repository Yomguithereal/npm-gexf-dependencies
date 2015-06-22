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

  var edgesIndex = {};

  // Reading the dependencies
  function recur(parentNode, deps, level) {

    (0, _lodash2['default'])(deps).forIn(function (data, name) {
      var node = undefined;

      // Adding the node if it does not exist yet
      if (!graph.nodes[name]) {
        node = {
          id: graph.nodes.length,
          label: name,
          attributes: {
            level: level
          }
        };
        graph.nodes.push(node);
      } else {
        node = graph.nodes[name];
      }

      // Adding edge
      if (!edgesIndex[parentNode.name + name] && !edgesIndex[name + parentNode.name]) {

        var edge = {
          id: graph.edges.length,
          source: parentNode.id,
          target: node.id,
          weight: 1
        };

        edgesIndex[parentNode.name + name] = edge;
        edgesIndex[name + parentNode.name] = edge;

        graph.edges.push(edge);
      } else {
        edgesIndex[parentNode.name + name].weight++;
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

