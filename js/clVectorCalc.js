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
	this.calc = function(Exp, deg) {
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

		this.angle_unit_is_rad = rad | true;

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
	});

	var unarMinus = new Action({
		use: function(a) {
			if (a instanceof Vector)
				return a.numMultip(-1);
			else
				return -a;
		},
		priority: 8,
		unar: true
	});

	var sin = new Action({
		use: function(a) {
			return Math.sin(a);
		},
		priority: 7,
		unar: true
	});

	var cos = new Action({
		use: function(a) {
			return Math.cos(a);
		},
		priority: 7,
		unar: true
	});

	function Action(settings) {
		this.use = settings.use;
		this.priority = settings.priority || 1;
		this.unar = settings.unar || false;
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

		nums = Exp.match(/\d+(\.\d*)?|v\d*|pi/g);
		// нельзя через map поскольку теряется контекст
		for (var i = 0; i < nums.length; i++)
			if (nums[i][0] == 'v')
				nums[i] = this.v[ Number( nums[i].slice(1, nums[i].length) ) ];
			else if (nums[i] == 'pi')
				nums[i] = Math.PI;
			else
				nums[i] = Number(nums[i]);

		minuses = Exp.match(/[-+]{2,}/g);
		if (minuses !== null)
			minuses.forEach(function(a) {
				var index = Exp.indexOf(a);
				var res = eval(a + '1');
				Exp = Exp.slice(0, index) + (res == -1 ? '-' : '+') + Exp.slice(index + a.length, Exp.length);
			});

		acts = Exp.match(/[\+\-\*\/\,]|cos|sin|tg/g);
		if (acts !== null) {
			acts = acts.map(function(a) {
				switch(a) {
					case '+': return plus;
					case '-':
						if (Exp[0] == '-')
							return unarMinus;
						return minus;
					case '*': return dot;
					case '/': return slash;
					case ',': return scMultip;
					case 'sin': return sin;
					case 'cos': return cos;
					default: break;
				}
			});

			while (acts.length > 0) {
				var max_index = findMaxByPriority(acts);
				if (acts[max_index].unar) var res = acts[max_index].use( nums[max_index] );
				else var res = acts[max_index].use( nums[max_index], nums[ max_index + 1 ] );
				if ( !(res instanceof Vector) && isNaN(res) )
					return NaN;
				nums[max_index] = res;
				if (!acts[max_index].unar)
					nums.splice(max_index + 1, 1);
				acts.splice(max_index, 1);
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