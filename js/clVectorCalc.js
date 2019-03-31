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

	// calculating Exp without brakets
	this.__calc__ = function(Exp) {
		
	}
}