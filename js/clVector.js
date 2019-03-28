function Vector (options) {

	// vector coords
	if (!(typeof options.start === "undefined")) {
		this.start.x = options.start.x || 0;
		this.start.y = options.start.y || 0;
		this.start.z = options.start.z || 0;
	} else {
		this.start.x = 0;
		this.start.y = 0;
		this.start.z = 0;
	}

	// vector projections
	this.vx = options.x || 0;
	this.vy = options.y || 0;
	this.vz = options.z || 0;


	/**
	 * @return {Number} vector's abs
	 */
	this.abs = function () {
		return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );
	}

	/**
	 * @return {Number} angle with ox in radians
	 */
	this.angle = function () {
		if (this.x == 0)
			return Math.PI / 2;
		return Math.atan(this.y / this.x);
	}

	/**
	 * adding another vector to this
	 * @param {Vector} vector to add
	 */
	this.add = function (vector) {
		return new Vector({
			start: {
				x: this.start.x + this.vx,
				y: this.start.y + this.vy,
				z: this.start.z + this.vz
			},
			vx: this.vx + vector.vx,
			vy: this.vy + vector.vy,
			vz: this.vz + vector.vz
		});
	}

	/**
	 * substracts another vector from this
	 * @param  {Vector} vector
	 */
	this.minus = function (vector) {
		return new Vector({
			start: {
				x: this.start.x + this.vx,
				y: this.start.y + this.vy,
				z: this.start.z + this.vz
			},
			vx: this.vx - vector.vx,
			vy: this.vy - vector.vy,
			vz: this.vz - vector.vz
		});
	}

	/**
	 * multiplate this vector with number
	 * @param  {Number} num
	 */
	this.numMultip = function (num) {
		return new Vector({
			start: {
				x: this.start.x,
				y: this.start.y,
				z: this.start.z
			},
			vx: this.vx * num,
			vy: this.vy * num,
			vz: this.vz * num
		});
	}
}