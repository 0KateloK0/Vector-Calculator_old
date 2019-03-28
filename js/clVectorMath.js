function VectorMath(options) {
	this.cvs = options.cvs;
	try {
		this.ctx = options.cvs.getContext('2d');
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
	
	/**
	 * draw all vectors contains in this object and axises
	 */
	this.redraw = function() {
		
	}

	this.drawAixs = function() {

	}

	this.vis = function(vector) {

	}

	/**
	 * private fnc to visualize vector in temporary coordinates
	 * @param  {Vector} vector
	 * @param  {Object} tCoords temporary coordinates: {x: .., y: .., z: ..}
	 */
	function __vis__(vector, tCoords) {

	}
}