module.exports = function mongooseWasNew(schema) {

    schema.pre('save', function wasNewHandler(next) {
        this.wasNew = this.isNew;
        next();
    });

};
