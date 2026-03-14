var Crawler = Crawler || {};

Crawler.MapEngine = {};

Crawler.MapEngine.createBlankMap = function(gridWidth, gridHeight)
{
	var map = {
	
		grid: [],
		gridWidth: gridWidth,
		gridHeight: gridHeight,
		
		rooms: []
	
	};
	
	for (var x = 0; x < gridWidth; x++)
	{
		map.grid[x] = [];
		
		for (var y = 0; y < gridHeight; y++)
		{
			map.grid[x][y] = 0;
		}
	}
	
	return map;
};

Crawler.MapEngine.addRooms = function(map, minRooms, maxRooms, minRoomWidth, minRoomHeight, maxRoomWidth, maxRoomHeight)
{
	var mathemagician = Conjecture.Mathemagician;

	map.rooms = [];


	// Generate Rooms
	
	var roomCount = mathemagician.getRandomInt(minRooms, maxRooms);
	
	var roomCollisions = 0;
	
	for (var i = 0; i < roomCount; i++)
	{
		var room = {};
		
		// Randomise room properties within specified parameters.
		room.id = i;
		room.x = mathemagician.getRandomInt(1, map.gridWidth - maxRoomWidth - 1);
		room.y = mathemagician.getRandomInt(1, map.gridHeight - maxRoomHeight - 1);
		room.width = mathemagician.getRandomInt(minRoomWidth, maxRoomWidth);
		room.height = mathemagician.getRandomInt(minRoomHeight, maxRoomHeight);
		
		room.connectedRooms = [];
		
		if (!this.checkRoomOverlap(map, room))
		{
			// Room does not collide with any existing room.
			
			// Decrease width and height of room by one cell,
			// to ensure separation of rooms.
			room.width--;
			room.height--;
			
			// Calculate center point. Useful precalc for pathing.
			room.centerX = room.x + (room.width / 2);
			room.centerY = room.y + (room.height / 2);
			
			// Add room to map.
			map.rooms.push(room);
			
			// Reset the collision counter (for next iteration).
			roomCollisions = 0;
		}
		else
		{
			// Discard room if it collides with an existing room.
			
			roomCollisions++
			
			if(roomCollisions > 25)
			{
				// If excessive collisions are detected,
				// the map must be too crowded.
				
				// Reset the collision counter (for next iteration),
				// and decrease the total number of rooms.
				
				roomCollisions = 0;
				roomCount--;
			}
			
			i--;
		}
	}
	
	
	// Add Rooms to Grid
	
	for (i = 0; i < map.rooms.length; i++)
	{
		var room = map.rooms[i];
		
		for (var x = room.x; x < room.x + room.width; x++)
		{
			for (var y = room.y; y < room.y + room.height; y++)
			{
				map.grid[x][y] = 1;
			}
		}
	}
};


Crawler.MapEngine.addPaths = function(map)
{
	var mathemagician = Conjecture.Mathemagician;
	
	for (i = 0; i < map.rooms.length; i++)
	{
		var sourceRoom = map.rooms[i];
		var destinationRoom = this.findClosestRoom(map, sourceRoom, true);
		
		if(destinationRoom != null)
		{
			sourceCoordinates = {
			
				x: mathemagician.getRandomInt(sourceRoom.x, sourceRoom.x + sourceRoom.width),
				y: mathemagician.getRandomInt(sourceRoom.y, sourceRoom.y + sourceRoom.height)
			
			};
			
			destinationCoordinates = {
			
				x: mathemagician.getRandomInt(destinationRoom.x, destinationRoom.x + destinationRoom.width),
				y: mathemagician.getRandomInt(destinationRoom.y, destinationRoom.y + destinationRoom.height)
			
			};

			while ((destinationCoordinates.x != sourceCoordinates.x) || (destinationCoordinates.y != sourceCoordinates.y))
			{
				if (destinationCoordinates.x != sourceCoordinates.x)
				{
					// Travel left/right until x-coords match.
					
					destinationCoordinates.x += (destinationCoordinates.x > sourceCoordinates.x)? -1: 1;
				} 
				else if (destinationCoordinates.y != sourceCoordinates.y) 
				{
					// And then travel up/down until y-coords match.
					 
					destinationCoordinates.y += (destinationCoordinates.y > sourceCoordinates.y)? -1: 1;
				}

				map.grid[destinationCoordinates.x][destinationCoordinates.y] = 1;
			}
			
			sourceRoom.connectedRooms[destinationRoom.id] = true;
		}
	}
};


Crawler.MapEngine.addWalls = function(map)
{
	// Cycle through all cells in the grid.
	
	for (var x = 0; x < map.gridWidth; x++)
	{
		for (var y = 0; y < map.gridHeight; y++)
		{
			if (map.grid[x][y] == 1)
			{
				// If a cell is passable (1),
				// loop through all surrounding cells.
				
				for (var i = x - 1; i <= x + 1; i++)
				{
					for (var j = y - 1; j <= y + 1; j++)
					{
						// If a surrounding cell is blank (0),
						// set the cell to be a wall (2).
						
						var state = map.grid[i][j];
						
						map.grid[i][j] = (state == 0)? 2: state;
					}
				}
			}
		}
	}
};


Crawler.MapEngine.findClosestRoom = function (map, target, ignoreConnected)
{
	var bestCandidate = null;
	var bestDistance = (map.gridWidth > map.gridHeight)? map.gridWidth * 2: map.gridHeight * 2;
	
	// Loop through all rooms, calculating distance between their center point,
	// and the center point of the target room.
	
	// Return the room with a center point closest to the target room's center point.
	
	for (var i = 0; i < map.rooms.length; i++)
	{
		var candidate = map.rooms[i];
		
		if(target.connectedRooms[i] == null)
		{
			target.connectedRooms[i] = false;
		}
		
		var connected = target.connectedRooms[i];
		
		if (candidate != target && (!ignoreConnected || !connected))
		{		
			var horizontalDistance = Math.abs(target.centerX - candidate.centerX) - (target.width / 2) - (candidate.width / 2);
			var verticalDistance = Math.abs(target.centerY - candidate.centerY) - (target.height / 2) - (candidate.height / 2);
			
			// Could be enhanced with trig, but eh, this works for now.
			var smallestDistance = Math.min(horizontalDistance, verticalDistance);
		
			if (smallestDistance < bestDistance)
			{
				bestDistance = smallestDistance;
				bestCandidate = candidate;
			}
		}
	}
	
	return bestCandidate;
};


Crawler.MapEngine.checkRoomOverlap = function (map, target)
{
	var overlapDetected = false;

	for (var i = 0; i < map.rooms.length; i++)
	{
		var candidate = map.rooms[i];
		
		if(candidate != target)
		{
			var horizontalClear = (target.x + target.width < candidate.x) || (target.x > candidate.x + candidate.width);
			var verticalClear = (target.y + target.height < candidate.y) || (target.y > candidate.y + candidate.height);
		
			if (!(horizontalClear || verticalClear))
			{
				overlapDetected = true;
				
				break;
			}
		}
	}

	return overlapDetected;
};