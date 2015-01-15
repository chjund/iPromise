describe('iPromise', function(){
	var expect
	before('initialize chai', function(){
		expect = chai.expect
	})

	describe('#<instance>.resolve', function() {
		var promise
		beforeEach(function(){
			promise = iPromise()
		})
		describe('argument pattern test', function() {
			var arg, expval

			it('expect resolve(1) to be 1', function(done){
				arg = expval = 1

				promise.then(function(val){
					expect(val).to.be.equal(1)
				}).then(done, done)
				promise.resolve(1)
			})
			it('expect resolve([1,2]) to be [1,2]', function(done){
				arg = expval = [1, 2]

				promise.then(function(val){
					expect(val).to.be.eql(expval)
				}).then(done, done)
				promise.resolve(arg)
			})
			it('expect resolve({a:1,b:2}) to be {a:1,b:2}', function(done){
				arg = expval = {a:1,b:2}

				promise.then(function(val){
					expect(val).to.be.eql(expval)
				}).then(done, done)
				promise.resolve(arg)
			})
			it('expect resolve(1,2,3) to be [1,2,3]', function(done){
				arg = expval = [1,2,3]

				promise.then(function(val){
					expect(val).to.be.eql(expval)
				}).then(done, done)
				promise.resolve.apply(null, arg)
			})
			it('expect resolve({ipromise} promise) to be instanceof ipromise', function(done){
				arg = ipromise(), expval = ipromise

				promise.then(function(val){
					expect(val).to.be.an.instanceof(expval)
				}).then(done, done)
				promise.resolve(arg)
			})
			it('expect resolve({then: function(){}}) is thenable object', function(done){
				arg = {then: function(){}}

				promise.then(function(val){
					expect(val).to.have.property('then')
						.that.is.an.instanceof(Function)
				}).then(done, done)
				promise.resolve(arg)
			})
		})
		describe('chain of then()', function() {
			var arg, expval

			it('expect resolve(1) to be 3', function(done){
				arg = 1, expval = 3

				promise.then(function(val){
					return val + 1	
				}).then(function(val){
					return val + 1
				}).then(function(val){
					expect(val).to.be.equal(expval)
				}).then(done, done)
				promise.resolve(arg)
			})
			it('expect resolve(1) to be 2 with invoking then()', function(done){
				arg = 1, expval = 2

				promise.then().then(function(val){
					return val + 1
				}).then(function(val){
					expect(val).to.be.equal(expval)
				}).then(done, done)
				promise.resolve(arg)
			})
			it('expect resolve(1) to be 2 with invoking then(null)', function(done){
				arg = 1, expval = 2

				promise.then(null).then(function(val){
					return val + 1
				}).then(function(val){
					expect(val).to.be.equal(expval)
				}).then(done, done)
				promise.resolve(arg)
			})
			it('expect resolve(1) to be 2 with invoking then(1)', function(done){
				arg = 1, expval = 2

				promise.then(1).then(function(val){
					return val + 1
				}).then(function(val){
					expect(val).to.be.equal(expval)
				}).then(done, done)
				promise.resolve(arg)
			})
			it('expect resolve(1) to be 2 with invoking then({a:1})', function(done){
				arg = 1, expval = 2

				promise.then({a:1}).then(function(val){
					return val + 1
				}).then(function(val){
					expect(val).to.be.equal(expval)
				}).then(done, done)
				promise.resolve(arg)
			})
			it('expect resolve(1) to be 3 by return ipromise instance', function(done){
				arg = 1, expval = 3

				promise
					.then(function(val){
						var p = ipromise(function(r){
							r(val + 1)
						})
						return p
					})
					.then(function(val){
						return val + 1
					})
					.then(function(val){
						expect(val).to.be.equal(expval)
					}).then(done, done)
				promise.resolve(arg)
			})
			it('expect resolve(1) to be 3 by return thenable instance', function(done){
				arg = 1, expval = 3

				promise
					.then(function(val){
						return {then: function(r){r(val + 1)}}
					})
					.then(function(val){
						return val + 1
					})
					.then(function(val){
						expect(val).to.be.equal(expval)
					}).then(done, done)
				promise.resolve(arg)
			})
		})
		describe('then() throws error', function(){
			var arg, expval

			it('expect resolve(1) to be 3', function(done){
				arg = 1, expval = 3

				promise
					.then(function(val){
						throw {msg:'test', val: val + 1}
					})
					.then(function(val){
						return val + 10 
					})
					.catch(function(e){
						expect(e).to.have.property('msg')
							.that.equal('test')
						return e.val
					})
					.then(function(val){
						return val + 1
					}, done)
					.then(function(val){
						try{
							expect(val).to.be.equal(expval)
						}
						catch(e){
							done(e)
						}
						done()
					})
				promise.resolve(arg)
			})
		})
	})
	describe('#<instance>.reject', function() {
		var promise
		beforeEach(function(){
			promise = iPromise()
		})
		describe('argument pattern test', function() {
			var arg, expval

			it('expect (1) to be 1 sub by catch', function(done){
				arg = expval = 1

				promise.catch(function(val){
					expect(val).to.be.equal(1)
				}).then(done, done)
				promise.reject(1)
			})
			it('expect (1) to be 1 sub by then', function(done){
				arg = expval = 1

				promise.then(0, function(val){
					expect(val).to.be.equal(1)
				}).then(done, done)
				promise.reject(1)
			})
			it('expect ([1,2]) to be [1,2] sub by catch', function(done){
				arg = expval = [1, 2]

				promise.catch(function(val){
					expect(val).to.be.eql(expval)
				}).then(done, done)
				promise.reject(arg)
			})
			it('expect ([1,2]) to be [1,2] sub by then', function(done){
				arg = expval = [1, 2]

				promise.then(1, function(val){
					expect(val).to.be.eql(expval)
				}).then(done, done)
				promise.reject(arg)
			})
			it('expect ({a:1,b:2}) to be {a:1,b:2} sub by catch', function(done){
				arg = expval = {a:1,b:2}

				promise.catch(function(val){
					expect(val).to.be.eql(expval)
				}).then(done, done)
				promise.reject(arg)
			})
			it('expect ({a:1,b:2}) to be {a:1,b:2} sub by then', function(done){
				arg = expval = {a:1,b:2}

				promise.then(1, function(val){
					expect(val).to.be.eql(expval)
				}).then(done, done)
				promise.reject(arg)
			})
			it('expect (1,2,3) to be [1,2,3] sub by catch', function(done){
				arg = expval = [1,2,3]

				promise.catch(function(val){
					expect(val).to.be.eql(expval)
				}).then(done, done)
				promise.reject.apply(null, arg)
			})
			it('expect (1,2,3) to be [1,2,3] sub by then', function(done){
				arg = expval = [1,2,3]

				promise.then(1, function(val){
					expect(val).to.be.eql(expval)
				}).then(done, done)
				promise.reject.apply(null, arg)
			})
			it('expect ({ipromise} promise) to be instanceof ipromise sub by catch', function(done){
				arg = ipromise(), expval = ipromise

				promise.catch(function(val){
					expect(val).to.be.an.instanceof(expval)
				}).then(done, done)
				promise.reject(arg)
			})
			it('expect ({ipromise} promise) to be instanceof ipromise sub by then', function(done){
				arg = ipromise(), expval = ipromise

				promise.then({}, function(val){
					expect(val).to.be.an.instanceof(expval)
				}).then(done, done)
				promise.reject(arg)
			})
			it('expect ({then: function(){}}) is thenable object sub by catch', function(done){
				arg = {then: function(){}}

				promise.catch(function(val){
					expect(val).to.have.property('then')
						.that.is.an.instanceof(Function)
				}).then(done, done)
				promise.reject(arg)
			})
			it('expect ({then: function(){}}) is thenable object sub by then', function(done){
				arg = {then: function(){}}

				promise.then({a:1}, function(val){
					expect(val).to.have.property('then')
						.that.is.an.instanceof(Function)
				}).then(done, done)
				promise.reject(arg)
			})
		})
		describe('chain of catch()', function() {
			var arg, expval

			it('expect (1) to be 3', function(done){
				arg = 1, expval = 3

				promise.catch(function(val){
					throw {val: val + 1}
				}).catch(function(val){
					throw {val: val.val + 1}
				}).catch(function(val){
					expect(val).to.have.property('val', expval)
				}).then(done, done)
				promise.reject(arg)
			})
			it('expect (1) to be 2 with invoking catch()', function(done){
				arg = 1, expval = 2

				promise.catch().then(1, function(val){
					throw {val: val + 1}
				}).then(1, function(val){
					expect(val).to.have.property('val', expval)
				}).then(done, done)
				promise.reject(arg)
			})
			it('expect (1) to be 2 with invoking then()', function(done){
				arg = 1, expval = 2

				promise.then().then(1, function(val){
					throw {val: val + 1}
				}).then(1, function(val){
					expect(val).to.have.property('val', expval)
				}).then(done, done)
				promise.reject(arg)
			})
			it('expect (1) to be 2 with invoking catch(null)', function(done){
				arg = 1, expval = 2

				promise.catch(null).then(1, function(val){
					throw {val: val + 1}
				}).then(1, function(val){
					expect(val).to.have.property('val', expval)
				}).then(done, done)
				promise.reject(arg)
			})
			it('expect (1) to be 2 with invoking then(null,null)', function(done){
				arg = 1, expval = 2

				promise.then(null,null).then(1, function(val){
					throw {val: val + 1}
				}).then(1, function(val){
					expect(val).to.have.property('val', expval)
				}).then(done, done)
				promise.reject(arg)
			})
			it('expect (1) to be 2 with invoking catch(1)', function(done){
				arg = 1, expval = 2

				promise.catch(1).then(1, function(val){
					throw {val: val + 1}
				}).then(1, function(val){
					expect(val).to.have.property('val', expval)
				}).then(done, done)
				promise.reject(arg)
			})
			it('expect (1) to be 2 with invoking then(null, 1)', function(done){
				arg = 1, expval = 2

				promise.then(null, 1).then(1, function(val){
					throw {val: val + 1}
				}).then(1, function(val){
					expect(val).to.have.property('val', expval)
				}).then(done, done)
				promise.reject(arg)
			})
			it('expect (1) to be 2 with invoking catch({a:1})', function(done){
				arg = 1, expval = 2

				promise.catch({a:1}).then(1, function(val){
					throw {val: val + 1}
				}).then(1, function(val){
					expect(val).to.have.property('val', expval)
				}).then(done, done)
				promise.reject(arg)
			})
			it('expect (1) to be 2 with invoking then(null, {a:1})', function(done){
				arg = 1, expval = 2

				promise.then(null, {a:1}).then(1, function(val){
					throw {val: val + 1}
				}).then(1, function(val){
					expect(val).to.have.property('val', expval)
				}).then(done, done)
				promise.reject(arg)
			})
			it('expect (1) to be 3 by return ipromise instance sub by catch', function(done){
				arg = 1, expval = 3

				promise
					.catch(function(val){
						var p = iPromise(function(r){
							r(val + 1)
						})
						return p
					})
					.then(function(val){
						return val + 1
					})
					.then(function(val){
						expect(val).to.be.equal(expval)
					}).then(done, done)
				promise.reject(arg)
			})
			it('expect (1) to be 3 by return ipromise instance sub by then', function(done){
				arg = 1, expval = 3

				promise
					.then(1, function(val){
						var p = iPromise(function(r){
							r(val + 1)
						})
						return p
					})
					.then(function(val){
						return val + 1
					})
					.then(function(val){
						expect(val).to.be.equal(expval)
					}).then(done, done)
				promise.reject(arg)
			})
			it('expect (1) to be 3 by return thenable instance sub by catch', function(done){
				arg = 1, expval = 3

				promise
					.catch(function(val){
						return {then: function(r){r(val + 1)}}
					})
					.then(function(val){
						return val + 1
					})
					.then(function(val){
						expect(val).to.be.equal(expval)
					}).then(done, done)
				promise.reject(arg)
			})
			it('expect (1) to be 3 by return thenable instance sub by then', function(done){
				arg = 1, expval = 3

				promise
					.then(1, function(val){
						return {then: function(r){r(val + 1)}}
					})
					.then(function(val){
						return val + 1
					})
					.then(function(val){
						expect(val).to.be.equal(expval)
					}).then(done, done)
				promise.reject(arg)
			})
		})
	})
	describe('#finally function as argument', function() {
		var promise
		beforeEach(function(){
			promise = iPromise()
		})
		describe('finally function as argument with then', function(){
			var arg, expVal
			it('would be called when invokes resolve() with fulfilled function', function(done){
				var isCalled = false
				promise.then(function(){
					expect(1).to.be.ok()
				}, null, function(){
					isCalled = true
				}).then(function(){
					expect(isCalled).to.be.true()
				},done).then(done, done)
				promise.resolve()
			})
			it('would be called when invokes resolve() without fulfilled function', function(done){
				var isCalled = false 
				promise.then(null, null, function(){
					isCalled = true
				}).then(function(){
					expect(isCalled).to.be.true()
				}).then(done, done)
				promise.resolve()
			})
			it('would be called when invokes reject() with rejected function', function(done){
				var isCalled = false
				promise.then(null, function(){
					expect(1).to.be.ok()
				}, function(){
					isCalled = true
				}).then(function(){
					expect(isCalled).to.be.true()
				},done).then(done, done)
				promise.reject()
			})
			it('would be called when invokes reject() without rejected function', function(done){
				var isCalled = false 
				promise.then(null, null, function(){
					isCalled = true
				}).then(function(){
					expect(isCalled).to.be.true()
				}).then(done, done)
				promise.resolve()
			})
		})	
		describe('finally function as argument with catch', function(){
			var isCalled
			beforeEach(function(){
				isCalled = false
			})
			it('would be called when invokes catch() with rejected function', function(done){
				promise.catch(function(){},function(){
					isCalled = true
				}).then(function(){
					expect(isCalled).to.be.true()
				}).then(done, done)
				promise.reject()
			})
			it('would be called when invokes catch() without rejected function', function(done){
				promise.catch(null,function(){
					isCalled = true
				}).then(function(){
					expect(isCalled).to.be.true()
				}).then(done, done)
				promise.reject()
			})
		})	
	})
	describe('#<instance>.wait', function() {
		var promise	
		beforeEach(function(){
			promise = iPromise()
		})
		it('wait for 1sec, and expect(1) to be 2', function(done) {
			var curr, o = +new Date()
			promise.wait(1000).then(function(val){
				curr = +new Date()
				expect(curr - o).to.be.least(1000)
				return val + 1
			}).then(function(val){
				expect(val).to.be.equal(2)
			}).then(done, done)
			promise.resolve(1)
		})
	})
	describe('#iPromise.all', function() {
		var a, b, c
		beforeEach(function(){
			a = 1
			b = iPromise(function(r){
				setTimeout(function(){r(2)}, 1000)
			})
			c = {
				then: function(r){
					setTimeout(function(){r(3)}, 1500)
				}
			}
		})
		it('(a,b,c)', function(done){
			var curr, o = +new Date()	
			iPromise.all(a,b,c).then(function(val){
				curr = +new Date()
				expect(curr - o).to.be.least(1500)
				expect(val).to.be.an.instanceOf(Array)
				expect(val).to.have.property('length', 3)
				expect(val[0]).to.be.equal(1)
				expect(val[1]).to.be.equal(2)
				expect(val[2]).to.be.equal(3)
			}).then(done, done)
		})
		it('(a,b,c) and transfers to the 2nd fulfilled callback function', function(done){
			var curr, o = +new Date()	
			iPromise.all(a,b,c).then(function(val){
				return val
			}).then(function(val){
				curr = +new Date()
				expect(curr - o).to.be.least(1500)
				expect(val).to.be.an.instanceOf(Array)
				expect(val).to.have.property('length', 3)
				expect(val[0]).to.be.equal(1)
				expect(val[1]).to.be.equal(2)
				expect(val[2]).to.be.equal(3)
			}).then(done, done)
		})
		it('([a,b,c])', function(done){
			var curr, o = +new Date()	
			iPromise.all([a,b,c]).then(function(val){
				curr = +new Date()
				expect(curr - o).to.be.least(1500)
				expect(val).to.be.an.instanceOf(Array)
				expect(val).to.have.property('length', 3)
				expect(val[0]).to.be.equal(1)
				expect(val[1]).to.be.equal(2)
				expect(val[2]).to.be.equal(3)
			}).then(done, done)
		})
		it('([a,b,c]) and transfers to the 2nd fulfilled callback function', function(done){
			var curr, o = +new Date()	
			iPromise.all([a,b,c]).then(function(val){
				return val
			}).then(function(val){
				curr = +new Date()
				expect(curr - o).to.be.least(1500)
				expect(val).to.be.an.instanceOf(Array)
				expect(val).to.have.property('length', 3)
				expect(val[0]).to.be.equal(1)
				expect(val[1]).to.be.equal(2)
				expect(val[2]).to.be.equal(3)
			}).then(done, done)
		})
		it('({a:a,b:b,c:c})', function(done){
			var curr, o = +new Date()	
			iPromise.all({a:a,b:b,c:c}).then(function(val){
				curr = +new Date()
				expect(curr - o).to.be.least(1500)
				expect(val).to.be.not.an.instanceOf(Array)
				expect(val).to.have.property('a')
					.that.equals(1)
				expect(val).to.have.property('b')
					.that.equals(2)
				expect(val).to.have.property('c')
					.that.equals(3)
			}).then(done, done)
		})
		it('({a:a,b:b,c:c}) and transfers to the 2nd fulfilled callback function', function(done){
			var curr, o = +new Date()	
			iPromise.all({a:a,b:b,c:c}).then(function(val){
				return val
			}).then(function(val){
				curr = +new Date()
				expect(curr - o).to.be.least(1500)
				expect(val).to.be.not.an.instanceOf(Array)
				expect(val).to.have.property('a')
					.that.equals(1)
				expect(val).to.have.property('b')
					.that.equals(2)
				expect(val).to.have.property('c')
					.that.equals(3)
			}).then(done, done)
		})
	})
	describe('#iPromise.any', function() {
		var a, b, expDelay = 700
		beforeEach(function(){
			a = iPromise(function(r){
				setTimeout(function(){r(1)}, 1500)
			})
			b = {
				then: function(r){
					setTimeout(function(){r(2)}, 500)
				}
			}
		})
		it('(a,b)', function(done){
			var curr, o = +new Date()	
			iPromise.any(a, b).then(function(val){
				curr = +new Date()
				expect(curr - o).to.be.most(expDelay)
				expect(val).to.be.equal(2)	
			}).then(done, done)
		})
		it('(a,b) and transfers to the 2nd fulfilled callback function', function(done){
			var curr, o = +new Date()	
			iPromise.any(a, b).then(function(val){
				return val
			}).then(function(val){
				curr = +new Date()
				expect(curr - o).to.be.most(expDelay)
				expect(val).to.be.equal(2)	
			}).then(done, done)
		})
		it('[a,b]', function(done){
			var curr, o = +new Date()	
			iPromise.any([a, b]).then(function(val){
				curr = +new Date()
				expect(curr - o).to.be.most(expDelay)
				expect(val).to.be.equal(2)	
			}).then(done, done)
		})
		it('[a,b] and transfers to the 2nd fulfilled callback function', function(done){
			var curr, o = +new Date()	
			iPromise.any([a, b]).then(function(val){
				return val
			}).then(function(val){
				curr = +new Date()
				expect(curr - o).to.be.most(expDelay)
				expect(val).to.be.equal(2)	
			}).then(done, done)
		})
		it('{a:a,b:b}', function(done){
			var curr, o = +new Date()	
			iPromise.any({a:a, b:b}).then(function(val){
				curr = +new Date()
				expect(curr - o).to.be.most(expDelay)
				expect(val).to.be.equal(2)	
			}).then(done, done)
		})
		it('{a:a,b:b} and transfers to the 2nd fulfilled callback function', function(done){
			var curr, o = +new Date()	
			iPromise.any({a:a, b:b}).then(function(val){
				return val
			}).then(function(val){
				curr = +new Date()
				expect(curr - o).to.be.most(expDelay)
				expect(val).to.be.equal(2)	
			}).then(done, done)
		})
	})
	describe('#iPromise.wait', function() {
		it('wait for 1sec, and expect(1) to be 2', function(done) {
			var curr, o = +new Date()
			iPromise.wait(1000, 1).then(function(val){
				curr = +new Date()
				expect(curr - o).to.be.least(1000)
				return val + 1
			}).then(function(val){
				expect(val).to.be.equal(2)
			}).then(done, done)
		})
	})
	describe('#Generator Function', function() {
		it('without error', function(done){
			var getdata1 = function(val){
				return iPromise(function(r,reject){
					setTimeout(function(){
						r(1)
					}, 100)	
				})
			}
			var getdata = function(val){
				return {
					then:function(r,reject){
						setTimeout(function(){
							r(val + 1)
						}, 500)	
					}
				}
			}
			iPromise(function*(a,b,c){
				var err
				try{
					var s = yield getdata1()
					var val = yield getdata(s)
				}
				catch(e){
					err = e
				}
				try{
					expect(val).to.be.equal(2)
					expect(err).to.be.undefined()
					done()
				}
				catch(e){
					done(e)
				}
			},1,2,3)
		})
		it('with error', function(done){
			var getdata1 = function(val){
				return iPromise(function(r,reject){
					setTimeout(function(){
						r(1)
					}, 500)	
				})
			}
			var getdata = function(val){
				return iPromise(function(r,reject){
					setTimeout(function(){
						reject(Error('test'))
					}, 500)	
				})
			}
			iPromise(function*(a,b,c){
				var err
				try{
					var s = yield getdata1()
					var val = yield getdata(s)
				}
				catch(e){
					err = e
				}

				try{
					expect(err).to.be.an.instanceof(Error)
					done()
				}
				catch(e){
					done(e)
				}
			},1,2,3)
		})
	})
})

