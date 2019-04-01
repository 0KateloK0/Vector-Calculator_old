function VectorCalc(options) {
	this.VM = options.VectorMath;
	try {
		// временый массив векторов, необходим для вычислений. На его основе будет строиться нумерация векторов.
		this.v = [];
		this.v.push(new Vector({})); // zero vector
		for (var i = 1; i < this.VM.vectors.length + 1; i++) 
			this.v.push(this.VM.vectors[i - 1]);
	} catch (err) {
		alert('В аргументах конструктора VectorCalc не хватает объекта типа VectorMath');
	}

	// calculating all Exp
	this.calc = function(Exp) {
		return this.__calc__(Exp);
	}

	var plus = new Action({
		use: function(a, b) {
			if (typeof a == "number" && typeof b == "number")
				return a + b;
			else
				return a.add(b);
		},
		priority: 5
	});

	var minus = new Action({
		use: function(a, b) {
			if (typeof a == "number" && typeof b == "number")
				return a - b;
			else
				return a.sub(b);
		},
		priority: 5
	});

	var dot = new Action({
		use: function(a, b) {
			if (typeof a == "number" && typeof b == "number")
				return a * b;
			else if (typeof a == "number" && typeof b == "Object")
				return a.scMultip(b);
		},
		priority: 6
	});

	var slash = new Action({
		use: function(a, b) {
			if (b == 0)
				return undefined;
			else 
				if (typeof a == "number" && typeof b == "number")
					return a / b;
		},
		priority: 6
	});

	function Action(settings) {
		this.use = settings.use;
		this.priority = settings.priority || 1;
		this.valueOf = function() { return this.use() }
		this.toString = function() {
			var res = this.use();
			if (typeof res == "number")
				return res;
			else {
				return 'v' + settings.v.length // добавить номер веткора
			}
		}
	}

	// calculating Exp without brakets
	this.__calc__ = function(Exp) {
		var nums = [];
		var acts = [];

		nums = Exp.match(/\d+(\.\d+)?|v\d*/g);
		nums = nums.map(function(a) {
			if (a[0] == 'v')
				return this.v[ a.slice(1, a.length) ];
			else
				return Number(a);
		});

		acts = Exp.match(/[\+\-\*\/]|cos|sin|tg/g);
		acts = acts.map(function(a) {
			switch(a) {
				case '+': return plus;
				case '-': return minus;
				case '*': return dot;
				case '/': return slash;
				default:
					break;
			}
		});

		while (acts.length > 0) {
			var max_index = findMaxByPriority(acts);
			nums[max_index] = acts[max_index].use( nums[max_index], nums[ max_index + 1 ] );
			acts.splice(max_index, 1);
			nums.splice(max_index + 1, 1);
		}

		function findMaxByPriority(a) {
			var best_i = 0;
			for (var i = 0; i < a.length; i++)
				if (a[i].priority > a[best_i].priority)
					best_i = i;
			return best_i;
		}

		return nums[0];
	}
}