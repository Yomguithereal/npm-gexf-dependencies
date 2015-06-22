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

  const edgesIndex = {};

  // Reading the dependencies
  function recur(parentNode, deps, level) {

    _(deps)
      .forIn((data, name) => {
        let node;

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
        }
        else {
          node = graph.nodes[name];
        }

        // Adding edge
        if (!edgesIndex[parentNode.name + name] &&
            !edgesIndex[name + parentNode.name]) {

          const edge = {
            id: graph.edges.length,
            source: parentNode.id,
            target: node.id,
            weight: 1
          };

          edgesIndex[parentNode.name + name] = edge;
          edgesIndex[name + parentNode.name] = edge;

          graph.edges.push(edge);
        }
        else {
          edgesIndex[parentNode.name + name].weight++;
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
