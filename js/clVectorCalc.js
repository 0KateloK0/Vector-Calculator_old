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
	this.calc = function(Exp, rad) {
		Exp = Exp.split(' ').join('');
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
			else if (typeof a == "number" && b instanceof Vector || 
					a instanceof Vector && typeof b == "number")
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
			else if (typeof a == "number" && b instanceof Vector || 
					a instanceof Vector && typeof b == "number")
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
			else if (a instanceof Vector && typeof b == "number")
				return a.numMultip(b);
			else if (typeof a == "number" && b instanceof Vector)
				return b.numMultip(a);
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

	var pow = new Action({
		use: function(a, b) {
			if (a == 0 && b == 0)
				return NaN;
			else
				return Math.pow(a, b);
		},
		priority: 8
	})

	var unarMinus = new Action({
		use: function(a) {
			if (a == unarPlus) return unarMinus;
			else if (a == unarMinus) return unarPlus;
			else if (a instanceof Vector)
				return a.numMultip(-1);
			else
				return -a;
		},
		unar: true,
		priority: 10
	});

	var unarPlus = new Action({
		use: function(a) {
			if (a == unarPlus) return unarPlus;
			else if (a == unarMinus) return unarMinus;
			else return a;
		},
		unar: true,
		priority: 10
	})

	var sin = new TrigonomAction(a => Math.sin(a % (Math.PI * 2)));
	var asin = new TrigonomAction(a => Math.asin(a % (Math.PI * 2)));
	var cos = new TrigonomAction(a => Math.cos(a % (Math.PI * 2)));
	var acos = new TrigonomAction(a => Math.acos(a % (Math.PI * 2)));
	var tan = new TrigonomAction(a => {
		if (a % Math.PI == Math.PI / 2)
			return NaN;
		return Math.tan(a % (Math.PI * 2));
	});
	var atan = new TrigonomAction(a => Math.atan(a % (Math.PI * 2)));
	var ctg = new TrigonomAction(a => {
		if (a % Math.PI == 0)
			return NaN;
		return 1 / Math.tan(a % (Math.PI * 2));
	});
	var sec = new TrigonomAction(a => {
		if (a % Math.PI == 0)
			return NaN;
		return 1 / Math.cos(a % (Math.PI * 2));
	});
	var cosec = new TrigonomAction(a => {
		if (a % Math.PI == Math.PI / 2)
			return NaN;
		return 1 / Math.sin(a % (Math.PI * 2));
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

	function TrigonomAction(use) {
		Action.call(this, {
			use: function(a) {
				if (a instanceof Vector)
					return NaN;
				return use(a);
			},
			priority: 7,
			unar: true
		});
	}

	// calculating Exp without brakets
	this.__calc__ = function(Exp) {
		if (Exp == '') return 0;
		var all_symb = Exp.match(/\d+(\.\d*)?|v\d*|pi|[\+\-\*\/\,\^]|sin|cos|tg|tan|arcsin|arcos|arctan|sec|cosec|ctg/gi);
		if (all_symb !== null) {
			var v = this.v;
			if (all_symb.join('') != Exp) return NaN;
			all_symb = all_symb.map(function(a, i, arr) {
				switch(a.toLowerCase()) {
					case '+':
						if (i == 0 || arr[i - 1] == '-'|| arr[i - 1] == '+' || arr[i - 1] == '*' || arr[i - 1] == '/'
							|| arr[i - 1] == '^')
							return unarPlus;
						else
							return plus;
					case '-': 
						if (i == 0 || arr[i - 1] == '-'|| arr[i - 1] == '+' || arr[i - 1] == '*' || arr[i - 1] == '/'
							|| arr[i - 1] == '^')
							return unarMinus;
						else return minus;
					case '*': return dot;
					case '/': return slash;
					case ',': return scMultip;
					case '^': return pow;
					case 'sin': return sin;
					case 'cos': return cos;
					case 'tg':
					case 'tan': return tan;
					case 'arctan': return atan;
					case 'arcsin': return asin;
					case 'arcos': return acos;
					case 'sec': return sec;
					case 'cosec': return cosec;
					case 'ctg': return ctg;
					case 'pi': return Math.PI;
					default: 
						if (a[0] == 'v') return v[ Number( a.slice(1, a.length) ) ]
						else if (Number(a) == a) return Number(a);
						else return NaN;
				}
			}).filter(a => a !== undefined);

			var nums_count = 0, acts_count = 0;
			for (var i = 0; i < all_symb.length; i++) 
				if ((all_symb[i] instanceof Vector) || (typeof all_symb[i] == 'number'))
					nums_count++;
				else if ((all_symb[i] instanceof Action) && !all_symb[i].unar)
					acts_count++;
			if (acts_count + 1 != nums_count) return NaN;

			while (all_symb.length > 1) {
				var max_index = findMaxByPriority(all_symb);
				var unar = all_symb[max_index].unar;
				if (unar) var res = all_symb[max_index].use( all_symb[max_index + 1] );
				else var res = all_symb[max_index].use( all_symb[max_index - 1], all_symb[ max_index + 1 ] );
				if ( !((res instanceof Vector) || (res instanceof Action)) && isNaN(res) )
					return NaN;
				all_symb[max_index] = res;
				all_symb.splice(max_index + 1, 1);
				if (!unar) all_symb.splice(max_index - 1, 1);
			}

			function findMaxByPriority(a) {
				var best_i = 0;
				for (var i = 0; i < a.length; i++)
					if (a[i].priority !== undefined)
						if (a[best_i].priority === undefined || a[i].priority > a[best_i].priority)
							best_i = i
				return best_i;
			}
		}
		return all_symb[0];
	}
}