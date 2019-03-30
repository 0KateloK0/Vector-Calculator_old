function VectorCalc(options) {
	this.VM = options.VM;
	try {
		this.v = this.VM.vectors;
	} catch (err) {
		alert('В аргументах конструктора VectorMath не хватает объекта типа VectorMath');
	}

	this.__v = [];

	// calculating all Exp
	this.calc = function(Exp) {
		return this.__calc__(Exp);
	}

	// calculating Exp without brakets
	Object.defineProperty(this, '__calc__', {
		value: function (Exp) {

		}
	})
}