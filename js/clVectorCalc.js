function VectorCalc(options) {
	this.VM = options.VM;
	try {
		this.v = [];
		this.v.push(new Vector()); // zero vector
		for (var i = 1; i < this.VM.vectors.length + 1; i++) 
			this.v.push(this.VM.vector[i - 1]);
	} catch (err) {
		alert('В аргументах конструктора VectorMath не хватает объекта типа VectorMath');
	}

	// временый массив векторов, необходим для вычислений. На его основе будет строиться нумерация векторов.
	this.__v = [];

	this.__v.push(new Vector({})); // нулевой вектор

	// calculating all Exp
	this.calc = function(Exp) {
		return this.__calc__(Exp);
	}

	var plus = new Action({
		use: function(a, b) {
			if (typeof a == "Number" && typeof b == "Number")
				return a + b;
			else
				return a.add(b);
		},
		priority: 6
	});

	var minus = new Action({
		use: function(a, b) {
			if (typeof a == "Number" && typeof b == "Number")
				return a - b;
			else
				return a.sub(b);
		},
		priority: 6
	});

	var dot = new Action({
		use: function(a, b) {
			if (typeof a == "Number" && typeof b == "Number")
				return a * b;
			else if (typeof a == "Number" && typeof b == "Object")
				return a.scMultip(b);
		},
		priority: 5
	});

	var slash = new Action({
		use: function(a, b) {
			if (b == 0)
				return undefined;
			else 
				if (typeof a == "Number" && typeof b == "Number")
					return a / b;
		},
		priority: 5
	});

	// calculating Exp without brakets
	this.__calc__ = function(Exp) {
		var nums = [];
		var acts = [];
	}
}

function Action(settings) {
	this.use = settings.use;
	this.priority = settings.priority || 1;
	this.valueOf = function() { return this.use() }
	this.toString = function() { return this.use() }
}