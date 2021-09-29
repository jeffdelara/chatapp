const WebSocket = require('ws');
const gamerNamer = require('gamer-namer');

const wss = new WebSocket.Server({ port: 7777 });
const CLIENTS = [];

function getUserList()
{
    let usernames = [];

    CLIENTS.forEach(client => {
        usernames.push(client.gamerNamer);
    });

    return usernames;
}

wss.on('connection', ws => {
    console.log("New client connected.");

    ws.gamerNamer = gamerNamer.generateName();
    ws.color = `#${Math.floor(Math.random()*16777215).toString(16)}`;
    CLIENTS.push(ws);

    const payload = {
        type: 'joined', 
        userName: ws.gamerNamer,
        userList: getUserList(),
        message: `<i>${ws.gamerNamer} has joined the chat.</i>`
    }

    wss.broadcast(JSON.stringify(payload));

    // on receiving message
    ws.on('message', (data) =>{
        
        const payload = {
            type: 'chat', 
            message: `<b class='name' style='color: ${ws.color}'>${ws.gamerNamer}:</b> ${data.toString()}`
        };

        wss.broadcast(JSON.stringify(payload));
    });


    // Closing
    ws.on('close', () => {
        console.log("Connection closed.");
        
        const payload = {
            type: 'chat', 
            message: `<i>${ws.gamerNamer} has left.</i>`
        }

        wss.broadcast(JSON.stringify(payload));

        // find the name in clients and delete
        CLIENTS.forEach( (user, index) => {
            if(user.gamerNamer === ws.gamerNamer)
            {
                CLIENTS.splice(index, 1);
            }
        });
    })
});

wss.broadcast = function broadcast(message) 
{
    wss.clients.forEach(client => {
        client.send(message);
    })
}