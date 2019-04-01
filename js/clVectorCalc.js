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
		Exp.split(' ').join('');
		// проверка скобочной посл на правильность
		var br_amount = 0;
		for (var i = 0; i < Exp.length; i++) {
			if (Exp[i] == '(')
				br_amount++;
			else if (Exp[i] == ')' && br_amount > 0)
				br_amount--;
			else if (Exp[i] == ')' && br_amount <= 0)
				return NaN;
		}
		if (br_amount != 0)
			return NaN;

		var index = Exp.indexOf(')');
		while (index >= 0) {
			for (var i = index; i >= 0; i--)
				if (Exp[i] == '(') {
					var s = this.__calc__( Exp.slice(i + 1, index) );
					Exp = Exp.slice(0, i) + s + Exp.slice(index + 1, Exp.length);
					var index = Exp.indexOf(')');
					break;
				}
			var index = Exp.indexOf(')');
		}

		return this.__calc__(Exp);
	}

	var plus = new Action({
		use: function(a, b) {
			if (typeof a == "number" && typeof b == "number")
				return a + b;
			else if (typeof a == "number" && typeof b == "object" || 
					typeof a == "object" && typeof b == "number")
				return NaN;
			else
				return a.add(b);
		},
		priority: 5
	});

	var minus = new Action({
		use: function(a, b) {
			if (typeof a == "number" && typeof b == "number")
				return a - b;
			else if (typeof a == "number" && typeof b == "object" || 
					typeof a == "object" && typeof b == "number")
				return NaN;
			else
				return a.sub(b);
		},
		priority: 5
	});

	var dot = new Action({
		use: function(a, b) {
			if (typeof a == "number" && typeof b == "number")
				return a * b;
			else if (typeof a == "number" && typeof b == "object" ||
					typeof a == "object" && typeof b == "number")
				return a.scMultip(b);
			else
				return a.vectMultip(b);
		},
		priority: 6
	});

	var slash = new Action({
		use: function(a, b) {
			if (b == 0)
				return NaN;
			else 
				if (typeof a == "number" && typeof b == "number")
					return a / b;
				else
					return NaN;
		},
		priority: 6
	});

	var scMultip = new Action({
		use: function(a, b) {
			return a.scMultip(b);
		},
		priority: 4
	})

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

		nums = Exp.match(/\d+(\.\d*)?|v\d*/g);
		// нельзя через map поскольку теряется контекст
		for (var i = 0; i < nums.length; i++)
			if (nums[i][0] == 'v')
				nums[i] = this.v[ Number( nums[i].slice(1, nums[i].length) ) ];
			else
				nums[i] = Number(nums[i]);

		acts = Exp.match(/[\+\-\*\/\,]|cos|sin|tg/g);
		if (acts !== null) {
			acts = acts.map(function(a) {
				switch(a) {
					case '+': return plus;
					case '-': return minus;
					case '*': return dot;
					case '/': return slash;
					case ',': return scMultip;
					default: break;
				}
			});

			while (acts.length > 0) {
				var max_index = findMaxByPriority(acts);
				var res = acts[max_index].use( nums[max_index], nums[ max_index + 1 ] );
				if ( typeof res != "object" && isNaN(res) )
					return NaN;
				nums[max_index] = res;
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
		}
		return nums[0];
	}
}