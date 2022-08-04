const { comprobarJWT } = require('../helpers/jwt');
const { io } = require('../index');

const {usuarioConectado, usuarioDesconectado, grabarMensaje} = require('../controllers/socket');


// Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente conectado');
    //console.log(client.handshake.headers);

    const [valido, uid] = comprobarJWT(client.handshake.headers['x-token']);

    if(!valido){
        usuarioDesconectado(uid);
        return client.disconnect();
    }

    console.log(uid);
    usuarioConectado(uid);
    //Ingresar al usuario a una sala
    client.join(uid);

    //Escuchar evento mensaje-personal
    client.on('mensaje-personal', async(payload)=>{
        //TODO Guardar mensaje
        await grabarMensaje(payload);
        console.log('Mensaje', payload);

        io.to(payload.para).emit('mensaje-personal',payload);
    });

    client.on('disconnect', () => {
        console.log('Cliente desconectado');
        usuarioDesconectado(uid);
    });

     /*client.on('mensaje', ( payload ) => {
         console.log('Mensaje', payload);
         io.emit( 'mensaje', { admin: 'Nuevo mensaje' } );
     });*/


});
