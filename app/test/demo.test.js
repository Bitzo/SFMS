var fs=require('fs');

require('should');
var name = 'snail';
var Person = function(name) {
    this.name = name;
}

var snail = new Person();

describe("Name Test", function() {
    it("名字应该是snail", function() {
        name.should.eql("snail");
    });

    it("snail应该是Person的实例", function() {
        snail.should.be.an.instanceof(Person);
    });

    it("snail应该有一个name属性", function() {
        snail.should.have.property('name');
    });
});
