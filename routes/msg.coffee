mongoose = require( 'mongoose' );
Msg     = mongoose.model( 'Msgs' );

exports.list = ( req, res ) ->
  Msg.find (err, Msgs) ->
        res.render 'index',
          title : 'Msg now!',
          Msgs : Msgs

exports.create = ( msg, next ) ->
  new Msg({
    name              : msg.name,
    content           : msg.content,
    send_time         : msg.send_time,
    created_time      : Date() 
  }).save ( err, todo, count ) ->
        console.log "存好数据咯"
        Msg.find (err, Msgs) ->
            next err, Msgs 