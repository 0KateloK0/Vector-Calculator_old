function VectorMath(options) {
	this.cvs = options.canvas;
	try {
		this.ctx = options.canvas.getContext('2d');
	} catch (err) {
		alert('В аргументах конструктора VectorMath не хватает объекта типа canvas');
	}

	this.w = this.cvs.width;
	this.h = this.cvs.height;

	this.ox = this.w / 2;
	this.oy = this.h / 2;

	// координаты крайних точек осей. слева по ox min_x, снизу по oy min_y
	// нужно для отрисовки чисел
	this.min_x = -this.w / 2;
	this.min_y = -this.h / 2;

	this.scale_in_pixels0 = 20;
	this.scale_in_coords0 = 1;

	this.scale_in_pixels = this.scale_in_pixels0;
	this.scale_in_coords = this.scale_in_coords0;
	// чтобы из координат получить правильныые приксели надо поделить на масштаб
	this.scale = this.scale_in_coords / this.scale_in_pixels;

	this.vectors = [];

	this.add = function(vector) {
		this.vectors.push(vector);
		this.redraw();
	}
	
	/**
	 * draw all vectors contains in this object and axises
	 */
	this.redraw = function() {
		this.ctx.clearRect(0, 0, this.w, this.h);
		this.drawAxis();
		this.vectors.foreach(this.vis);
	}

	this.drawAixs = function() {

	}

	/**
	 * just visualizing vector
	 * @param  {Vector} vector
	 */
	this.vis = function(vector) {
		__vis__.call(this, vector, {x: vector.start.x, y: vector.start.y});
	}

	/**
	 * private fnc to visualize vector in temporary coordinates
	 * @param  {Vector} vector
	 * @param  {Object} tCoords temporary coordinates: {x: .., y: .., z: ..}
	 */
	function __vis__(vector, tCoords) {
		this.ctx.beginPath();
		// minus after this.oy is because on canvas y coordinates inverted
		this.ctx.moveTo(this.ox + tCoords.x / this.scale, this.oy - tCoords.y / this.scale);
		this.ctx.lineTo(this.ox + (tCoords.x + vector.vx) / this.scale, this.oy - (tCoords.y + vector.vy) / this.scale);

		this.ctx.stroke();

		// drawTriangleWithSide.call(this, tCoords.x + vector.vx, tCoords.y + vector.vy, 10, vector.angle);
	}

	/**
	 * draws trinagle with side by angle (if angle is undefined it'll be stand directly)
	 * @param  {Number} x0    x coordinate of ending peak
	 * @param  {Number} y0    y coordinate of ending peak
	 * @param  {Number} side  side length
	 * @param  {Number in radinas} angle angle of vector
	 */
	function drawTriangleWithSide(x0, y0, side, angle) {
		this.ctx.beginPath();

		this.ctx.moveTo(this.ox + x0 / this.scale, this.oy - y0 / this.scale);

		this.ctx.lineTo(this.ox + x0 / this.scale - side * Math.cos(-Math.PI / 3 - angle),
						this.oy - y0 / this.scale + side * Math.sin(-Math.PI / 3 - angle));

		this.ctx.lineTo(this.ox + x0 / this.scale + side * Math.cos(-Math.PI / 3 + angle),
						this.oy - y0 / this.scale - side * Math.sin(-Math.PI / 3 + angle));

		this.ctx.lineTo(this.ox + x0 / this.scale, this.oy - y0 / this.scale);

		this.ctx.fill();
	}
}