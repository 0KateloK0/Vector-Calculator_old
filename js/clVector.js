function Vector(options) {
	// vector coords
	if (!(typeof options.start === "undefined"))
		this.start = {
			x: options.start.x || 0,
			y: options.start.y || 0,
			z: options.start.z || 0
		}
	else
		this.start = {
			x: 0,
			y: 0,
			z: 0
		}

	// vector projections
	this.vx = options.vx || 0;
	this.vy = options.vy || 0;
	this.vz = options.vz || 0;

	// algebraical functions

	/**
	 * @return {Number} vector's abs
	 */
	Object.defineProperty(this, "abs", {
		get: () => Math.sqrt( this.vx * this.vx + this.vy * this.vy + this.vz * this.vz ),
		set: function (num) {
			var angle = this.angle;
			this.vx = num * Math.cos(angle % Math.PI) * sign(this.vx);
			this.vy = num * Math.sin(angle % Math.PI) * sign(this.vy);
			// добавить vz
		}
	});

	/**
	 * @return {Number} angle with ox in radians
	 */
	Object.defineProperty(this, "angle", {
		get: () => Math.atan2(this.vy, this.vx),
		set: function (num) {
			var abs = this.abs;
			this.vx = abs * Math.cos(num % Math.PI) * sign(this.vx);
			this.vy = abs * Math.sin(num % Math.PI) * sign(this.vy);
			// добавить vz
		}
	});

	function sign (num) { return num >= 0 ? 1 : -1 }

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
	this.sub = function (vector) {
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

	/**
	 * finds angle in radians between this vector and another (it may be negative)
	 * @param  {Vector} vector
	 */
	this.angleBetween = function (vector) {
		return this.angle - vector.angle;
	}

	/**
	 * finds scalar multiplication of this vector and another vector
	 * @param  {Vector} vector
	 */
	this.scMultip = function (vector) {
		return this.abs * vector.abs * this.angleBetween(vector);
	}

	/**
	 * this fnc finding projection on another vector
	 * @param  {Vector} vector
	 */
	this.projection = function(vector) {
		return this.abs * Math.cos( this.angleBetween(vector) );
	}

	this.valueOf = function() {
		return 'vx: ' + this.vx + '; vy: ' + this.vy;
	}
	this.toString = function () {
		return 'vx: ' + this.vx + '; vy: ' + this.vy;
	}
}