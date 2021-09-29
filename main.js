// connect to server on load of this page
const ws = new WebSocket("ws://localhost:7777");

ws.addEventListener('open', () => {
    console.log("We are connected!");
});

ws.addEventListener('message', event => {
    const data = JSON.parse(event.data);
    
    if(data.type === 'joined') 
    {
        const users = document.getElementById("users");
        users.innerHTML = "";
        displayUserList(data);
        displayToChat(data);
    }

    if(data.type === 'chat')
    {
        displayToChat(data);
    }
    
});

const sendBtn = document.getElementById('send');
sendBtn.addEventListener('click', chatHandler);

document.addEventListener('keydown', function(e){
    if(e.key === 'Enter') 
    {
        e.preventDefault();
        chatHandler();
    }
});

function displayUserList(data)
{
    data.userList.forEach(_user => {
        const user = document.createElement('div');
        user.setAttribute('class', 'user');
        user.textContent = _user;    
        users.append(user);    
    });
}

function displayToChat(data)
{
    const div = document.createElement('div');
    div.setAttribute('class', 'chat-item');

    const messageDiv    = document.getElementById('message'); 
    div.innerHTML       = data.message;
    
    messageDiv.append(div);
    messageDiv.scrollTo(0, messageDiv.scrollHeight);
}

function chatHandler() 
{
    const textBox = document.getElementById('textbox');
    const text = textBox.value;
    
    if(text) 
    {
        ws.send(text);
        textBox.value = "";
    }
}