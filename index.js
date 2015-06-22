#!/usr/bin/env node
import stdin from 'stdin';
import gexf from 'gexf';
import _ from 'lodash';

// Main
function main(str) {
  let json;

  // Parsing JSON
  try {
    json = JSON.parse(str);
  }
  catch (e) {
    throw Error('Invalid JSON provided!');
  }

  // Initializing the graph
  const graph = {
    nodes: [{id: 0, label: json.name}],
    edges: []
  };

  const nodesIndex = {},
        edgesIndex = {};

  // Reading the dependencies
  function recur(parentNode, deps, level) {

    _(deps)
      .forIn((data, name) => {
        let node = nodesIndex[name];

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
        const key1 = parentNode.name + '||' + name,
              key2 = name + '||' + parentNode.name;

        if (!edgesIndex[key1] &&
            !edgesIndex[key2]) {

          const edge = {
            id: graph.edges.length,
            source: parentNode.id,
            target: node.id,
            weight: 1
          };

          edgesIndex[key1] = edge;
          edgesIndex[key2] = edge;

          graph.edges.push(edge);
        }
        else {
          edgesIndex[key1].weight++;
        }

        // Need to recur?
        if (data.dependencies)
          recur(node, data.dependencies, level + 1);
      })
      .value();
  }

  recur(graph.nodes[0], json.dependencies, 0);

  // Building the gexf file
  const doc = gexf.create({
    model: {
      node: [
        {
          id: 'level',
          title: 'Level',
          type: 'integer'
        }
      ]
    },
    nodes: graph.nodes,
    edges: graph.edges
  });

  console.log(doc.serialize());
}

// Reading from stdin
stdin(main);
