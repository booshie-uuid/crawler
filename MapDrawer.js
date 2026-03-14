var Crawler = Crawler || {};

Crawler.MapDrawer = {
	
	canvas: null,
	context: null,
	
	width: 0,
	height: 0,
	
	blankColor: "#070D0D",
	pathColor: "#35530A",
	wallColor: "#58BC08",
	errorColor: "#EF4026",
	
	tilesheet: null,
	tilesheetReady: false,

};

Crawler.MapDrawer.blankCanvas = function()
{
	this.context.fillStyle = this.blankColor;
	this.context.fillRect(0, 0, this.width, this.height);
};

Crawler.MapDrawer.setCanvas = function(canvasId, width, height)
{
	this.canvas = document.getElementById(canvasId);
	this.canvas.width = width;
	this.canvas.height = height;
	
	this.context = this.canvas.getContext('2d');
	
	this.width = width;
	this.height = height;
};

Crawler.MapDrawer.setTilesheet = function(path)
{
	this.tilesheet =  new Image();
	this.tilesheet.src = path;
	this.tilesheet.onload = function()
	{ 
		Crawler.MapDrawer.tilesheetReady = true; 
	};
};

Crawler.MapDrawer.drawSprite = function(tilesheet, tileWidth, tileHeight, tileX, tileY, destinationX, destinationY, centerX, centerY)
{
	var mathemagician = Conjecture.Mathemagician;

	var offsetX = centerX * tileWidth - mathemagician.truncate(this.width / 2);
	var offsetY = centerY * tileHeight - mathemagician.truncate(this.height / 2);

	if(this.context != null)
	{
		var destX = (destinationX * tileWidth) - offsetX;
		var destY = (destinationY * tileHeight) - offsetY;
	
		this.context.drawImage(tilesheet, (tileX * tileWidth), (tileY * tileHeight), tileWidth, tileHeight, destX, destY, tileWidth, tileHeight);
	}
};

Crawler.MapDrawer.drawMap = function(map, centerX, centerY)
{
	var mathemagician = Conjecture.Mathemagician;

	var offsetX = centerX * 32 - mathemagician.truncate(this.width / 2);
	var offsetY = centerY * 32 - mathemagician.truncate(this.height / 2);

	if(this.context != null && this.tilesheetReady)
	{
		for (var y = 0; y < map.gridHeight; y++)
		{
			for (var x = 0; x < map.gridWidth; x++)
			{
				var cell = map.grid[x][y];
				
				switch(cell)
				{
					case 0:
						this.context.fillStyle = this.blankColor;
						break;
						
					case 1:
						this.context.fillStyle = this.pathColor;
						break;
						
					case 2:
						this.context.fillStyle = this.wallColor;
						break;
						
					default:
						this.context.fillStyle = this.errorColor;
				}
							
				var tileSize = 32;
				
				var destX = (x * tileSize) - offsetX;
				var destY = (y * tileSize) - offsetY;
				
				if(destX + tileSize > 0 && destY + tileSize > 0)
				{
					this.context.drawImage(this.tilesheet, (cell * tileSize), 0, tileSize, tileSize, destX, destY, tileSize, tileSize);
				}
				
				//this.context.fillRect(x * horizontalScale, y * verticalScale, horizontalScale, verticalScale);
			}
		}
	}
};