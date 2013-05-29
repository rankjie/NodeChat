mongoose = require( 'mongoose' );
Schema   = mongoose.Schema;

Msgs = new Schema({
    name                : String,
    content             : String,
    send_time           : Number,
    created_time        : Date
});

mongoose.model( 'Msgs', Msgs );
 
mongoose.connect( 'mongodb://localhost/mymsg' );