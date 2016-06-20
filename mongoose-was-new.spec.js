var mongoose = require('mongoose');
var expect = require('chai').expect;
var Schema = mongoose.Schema;
var connection;

require('blanket');
var mongooseWasNew = require('./mongoose-was-new');

mongoose.Promise = global.Promise;

function customerSchema() {
    return new Schema({
        firstName: { type: String },
        lastName: { type: String }
    });
}

describe('Mongoose plugin: mongoose-was-new', function () {
    before(function (done) {
        var mongoURL = process.env.MONGO_URL || 'mongodb://localhost/unit_test';
        connection = mongoose.createConnection(mongoURL);
        connection.once('connected', done);
    });

    after(function (done) {
        connection.db.dropDatabase(function () {
            connection.close(done);
        });
    });

    describe('with documents', function () {
        var Customer;

        before(function () {
            var testSchema = customerSchema();
            testSchema.plugin(mongooseWasNew);
            Customer = connection.model('Customer', testSchema);
        });

        it('should add a wasNew boolean parameter', function () {
            var testDoc = new Customer({
                firstName: 'Test',
                lastName: 'Testing',
            });

            return testDoc.save().then(function (testDoc) {
                expect(testDoc.wasNew).to.equal(true);
            });
        });

    });
});
