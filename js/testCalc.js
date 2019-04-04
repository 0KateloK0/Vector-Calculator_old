describe('calc', function() {
	it('Считает обычные числа', function() {
		assert.equal( VC.calc('5+5'), 10 );
		assert.equal( VC.calc('5-5'), 0 );
		assert.equal( VC.calc('5*5'), 25 );
		assert.equal( VC.calc('5/5'), 1 );
	});
	it('Выполняет несколько действий с правильным порядком', function() {
		assert.equal( VC.calc('5+5*5'), 30 );
		assert.equal( VC.calc('5-5/5'), 4 );
		assert.equal( VC.calc('5+5*5/5-5'), 5 );
		assert.equal( VC.calc('5*5-5'), 20 );
	});
	it('Считает со скобками и правильным порядком действий', function() {
		assert.equal( VC.calc('(10+2)*2'), 24 );
		assert.equal( VC.calc('((5-5)+6)*2'), 12 );
		assert.equal( VC.calc('((5-5)+6)*2+1'), 13 );
		assert.equal( VC.calc('((10+2)-3*(5/5))/9-1'), 0 );
	});
	it('Убирает пробелы', function() {
		assert.equal( VC.calc(' 10 + 2 - 5 / 5'), 11 );
	});
	describe('Правильно работает с отрицательными числами', function() {
		it('-5', assert.equal( VC.calc('-5'), -5 ));
		it('--5', assert.equal( VC.calc('-5'), 5 ));
		it('-+5', assert.equal( VC.calc('-5'), -5 ));
		it('2-5', assert.equal( VC.calc('-5'), -3 ));
		it('2*-5', assert.equal( VC.calc('-5'), -10 ));
	});
	describe('Считывает ошибки пользователя', function() {
		it('Выдает NaN если неправильная скобочная последовательность', assert( isNaN( VC.calc('(') ) ) );
		it('Выдает NaN при делении на 0', assert( isNaN( VC.calc('2/0') ) ) );
		describe('Выдает NaN при неправильных типизациях', function() {
			it('При сложении/вычитании', function() {
				assert( isNaN( VC.calc('v1+2') ) );
				assert( isNaN( VC.calc('v1-2') ) );
			} );
			it('При делении', function() {
				assert( isNaN( VC.calc('v1/2') ) );
				assert( isNaN( VC.calc('v1/v2') ) );
				assert( isNaN( VC.calc('2/v2') ) );
			} );
		});
	});
	describe('Считает с векторами', function() {
		it('Выполняет сложение/вычитание векторов', function() {
			assert.equal( VC.calc('v1+v2'), 'vx: 0; vy: -22' );
			assert.equal( VC.calc('v1-v2'), 'vx: -10; vy: 2' );
			assert.equal( VC.calc('v1+v0'), 'vx: -5; vy: -10' );
		});
		it('Считает скалярное произведение векторов', function() {
			assert.equal( VC.calc('(v1, v2)'), '331.84367964460426' );
		});
		it('Выполняет смешанные операции', function() {
			assert.equal( VC.calc('(5-2)*v1 + v2'), 'vx: -10; vy: -42' );
			assert.equal( VC.calc('(v1,v2) * v1'), 'vx: 1659.2183982230213; vy: -3982.1241557352514' );
			assert.equal( VC.calc('(2 * v1 + v2,v2) * v1'), 'vx: -5456.36468295036; vy: -10912.72936590072' );
		});
	});
})