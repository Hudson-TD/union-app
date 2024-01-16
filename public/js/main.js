const chatForm = document.getElementById("chat-form");
const chatMessages = document.getElementById("chatMessages");

//DOM Manipulation

// Output to DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username}<span>${message.time}</span></p>
          <p class="text">${message.text}</p>`;
  document.getElementById("chatMessages").appendChild(div);
}

// Render room name
function outputRoomName(room) {
  const roomNameEl = document.getElementById("room-name");
  roomNameEl.innerHTML = `<h5>${room}</h5>`;
}

// Render users list
function outputUserList(users) {
  const userList = document.getElementById("usersList");
  userList.innerHTML = "";
  for (i = 0; i < users.length; i++) {
    const userEntry = document.createElement("li");
    userEntry.textContent = `${users[i].username}`;
    userList.appendChild(userEntry);
  }
}

// Grab username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Join chatroom
socket.emit("joinRoom", { username, room });

// Define chatroom users
socket.on("userList", ({ room, users }) => {
  outputRoomName(room);
  outputUserList(users);
});

socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  // Scroll to current message
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Grab message from HTML input
  const msg = e.target.elements.msg.value;

  // Emit user message to server
  socket.emit("chatMessage", { username: username, text: msg, time: "1:11" });

  // Clear input & refocus
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});
