const socketIo = require('socket.io');

const socket = function (server) {
    let io = socketIo(server);

    io.on('connection', (socket) => {
        process.logger(socket.client.id);
        socket.emit('clientId', {"clientId": socket.client.id})
        socket.on('disconnect', function (req, res) {
        });
    });

    return io;
}

module.exports = {
    socket
};