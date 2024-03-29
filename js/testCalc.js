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
	it('Считает с тригонометрическими функциями', function() {
		assert.equal( VC.calc('sin(2*pi)'), 0);
		assert.equal( VC.calc('cos(2*pi)'), 1);
		assert.equal( VC.calc('sin(2*pi)*sin(2*pi)+cos(2*pi)*cos(2*pi)'), 1);
		assert.equal( VC.calc('arcos(1)'), 0);
		assert.isBelow( Math.abs( VC.calc('sec(pi/3)') - 2), Number.EPSILON * 16);
		assert.isBelow( Math.abs( VC.calc('tg(pi/3)*tg(pi/3)+1') - 4), Number.EPSILON * 16);
	});
	it('Считает с логарифмическими функциями', function() {
		assert.isBelow( Math.abs( VC.calc('ln(1000) / ln(10)') - 3) / 2, Number.EPSILON * 16)
	})
	it('Работает с отрицательными числами', function() {
		assert.equal( VC.calc('-1'), -1 );
		assert.equal( VC.calc('-+1'), -1 );
		assert.equal( VC.calc('-+-1'), 1 );
		assert.equal( VC.calc('-+-v1'), 'vx: -5; vy: -10' );
		assert.equal( VC.calc('-+-1*-1'), -1 );
		assert.equal( VC.calc('-+-1*(-1)'), -1 );
		assert.equal( VC.calc('-+-1*+(-1)'), -1 );
		assert.equal( VC.calc('-+-1*+(-1)---2'), -3 );
	});
	it('Возводит в степень', function() {
		assert.equal( VC.calc('2^3'), 8 );
		assert.equal( VC.calc('2^0'), 1 );
		assert.equal( VC.calc('4^0.5'), 2 );
		assert.equal( VC.calc('4^-2'), 1 / 16 );
	});
	describe('Считает с векторами', function() {
		it('Выполняет сложение/вычитание векторов', function() {
			assert.equal( VC.calc('v1+v2'), 'vx: 0; vy: -22' );
			assert.equal( VC.calc('v1-v2'), 'vx: -10; vy: 2' );
			assert.equal( VC.calc('v1+v0'), 'vx: -5; vy: -10' );
		});
		it('Считает скалярное произведение векторов', () => assert.equal( VC.calc('(v1, v2)'), '331.84367964460426' ));
	});
	describe('Считывает ошибки пользователя', function() {
		it('Выдает NaN если неправильная скобочная последовательность', () => assert( isNaN( VC.calc('(') ) ) );
		it('Выдает NaN при неправильном кол-ве команд', () => assert( isNaN( VC.calc('2+') ) ))
		it('Выдает NaN при неправильных командах', () => assert( isNaN( VC.calc('co(pi)') ) ));
		it('Выдает NaN при математических ошибках', () => {
			assert( isNaN( VC.calc('tg(pi/2)') ) );
			assert( isNaN( VC.calc('ctg(0)') ) );
			assert( isNaN( VC.calc('2/0') ) );
			assert( isNaN( VC.calc('0^0') ) );
			assert( isNaN( VC.calc('ln(-1)') ) );
		})
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
			it('При скалярном произведении', () => assert( isNaN( VC.calc('v1,2') ) ) );
		});
	})
})