var Conjecture = Conjecture || {};

Conjecture.Mathemagician = {};

Conjecture.Mathemagician.truncate = function(number)
{
	// Invert (~) number to convert value to 32-bit integer.
	// Invert (~) the result to get it back to the correct value.
	
	return ~~number;
};

Conjecture.Mathemagician.getRandomInt = function(min, max)
{
	var number = (Math.random() * (max - min)) + min;

	return Conjecture.Mathemagician.truncate(number);
};

Conjecture.Mathemagician.radians = function(degrees)
{
	return degrees * Math.PI / 180;
};

Conjecture.Mathemagician.degrees = function(radians)
{
	return radians * 180 / Math.PI;
};

Conjecture.Mathemagician.sin = function(degrees)
{
	return Math.sin(trig.radians(degrees));
};

Conjecture.Mathemagician.cos = function(degrees)
{
	return Math.cos(trig.radians(degrees));	
};

Conjecture.Mathemagician.tan = function(degrees)
{
	return Math.tan(trig.radians(degrees));	
};