var Crawler = Crawler || {};

Crawler.PathFinder = {};

Crawler.PathFinder.createNode = function(grid, parent, gridX, gridY)
{
	var gridWidth = grid.length;

	return {
		
		parent: parent,
		
		nodeId: gridX + (gridY * gridWidth),
		
		gridX: gridX,
		gridY: gridY,
		
		currentCost: 0,
		estimatedTotalCost: 0
	
	};
};

Crawler.PathFinder.getNeighbours = function(grid, node)
{
	var neighbours = [];
	
	var gridWidth = grid.length;
	var gridHeight = (gridWidth > 0)? grid[0].length: 0;
	
	var northGridY = node.gridY - 1;
	var southGridY = node.gridY + 1;
	var westGridX = node.gridX - 1;
	var eastGridX = node.gridX + 1;
	
	if(northGridY > -1 && grid[node.gridX][northGridY] == 1)
	{
		var northNode = this.createNode(grid, node, node.gridX, northGridY);
		
		neighbours.push(northNode);
	}
	
	if(southGridY < gridHeight && grid[node.gridX][southGridY] == 1)
	{
		var southNode = this.createNode(grid, node, node.gridX, southGridY);
		
		neighbours.push(southNode);
	}
	
	if(westGridX > -1 && grid[westGridX][node.gridY] == 1)
	{
		var westNode = this.createNode(grid, node, westGridX, node.gridY);
		
		neighbours.push(westNode);
	}
	
	if(eastGridX < gridWidth && grid[eastGridX][node.gridY] == 1)
	{
		var eastGridX = this.createNode(grid, node, eastGridX, node.gridY);
		
		neighbours.push(eastGridX);
	}
	
	return neighbours;
};

Crawler.PathFinder.calculatePath = function(grid, startGridX, startGridY, finishGridX, finishGridY)
{
	var path = [];
	
	var gridWidth = grid.length;
	var gridHeight = (gridWidth > 0)? grid[0].length: 0;
	
	var startNode = this.createNode(grid, null, startGridX, startGridY);
	var finishNode = this.createNode(grid, null, finishGridX, finishGridY); 
	
	// Maintain a list of nodes that need to be examined.
	var pendingNodes = [];
	
	// Maintain a list of nodes that have been examined,
	// using single dimension array indexing for quick lookup.
	var visitedNodes = [gridWidth * gridHeight];
	
	// Add the start node to the list of pending nodes.
	pendingNodes.push(startNode);
	
	// Loop through pending node until finishing node is found.
	// More nodes will be added to the pending list within the loop.
	while(pendingNodes.length > 0)
	{
		var currentNode = null;
		var currentNodeIndex = -1;
		
		// Find the node from the list of pending nodes that
		// has the lowest estimated total cost.
		
		var lowestCost = gridWidth * gridHeight;
		
		for(i = 0; i < pendingNodes.length; i++)
		{
			var candidateNode = pendingNodes[i];
			
			if(candidateNode.estimatedTotalCost < lowestCost)
			{
				currentNodeIndex = i;
				lowestCost = candidateNode.estimatedTotalCost;
			}
		}
		
		// Select the lowest cost node and remove it from
		// the list of pending nodes.
		
		if(currentNodeIndex > -1)
		{
			currentNode = pendingNodes.splice(currentNodeIndex, 1)[0];
		}
		
		// Analyse the current node.
		
		if(currentNode != null)
		{
			if(currentNode.nodeId != finishNode.nodeId)
			{
				// Get all traversable neighbouring nodes.
				
				neighbours = this.getNeighbours(grid, currentNode);
				
				// Cycle through unvisited neighbours,
				// calculating the cost of unvisited nodes and adding
				// to the pending nodes list.
				// Visited nodes will be discarded.
				
				for(i = 0; i < neighbours.length; i++)
				{
					var neighbour = neighbours[i];
					
					if(!visitedNodes[neighbour.nodeId])
					{
						// Calculate costs.
					
						neighbour.currentCost = currentNode.currentCost + Math.abs(neighbour.gridX - currentNode.gridX) + Math.abs(neighbour.gridY - currentNode.gridY);
						neighbour.estimatedTotalCost = neighbour.currentCost + Math.abs(neighbour.gridX - finishNode.gridX) + Math.abs(neighbour.gridY - finishNode.gridY);
					
						// Add to pending list.
					
						pendingNodes.push(neighbour);
					
						// Record as visited.
					
						visitedNodes[neighbour.nodeId] = true;
					}
				}
			}
			else
			{
				// We have reached out destination and can calculate the path.
				
				path = [];
				
				do
				{
					path.push(currentNode);
				}
				while(currentNode = currentNode.parent);
				
				path.reverse();
				
				break;
			}
		}
		else
		{
			// We were unable to find a low
			break;
		}
	}

	return path;
};