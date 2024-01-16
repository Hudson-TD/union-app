const chatForm = document.getElementById("chat-form");
const chatMessages = document.getElementById("chatMessages");

const socket = io();

// Output to DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">Tyler <span>1:00PM</span></p>
        <p class="text">${message}</p>`;
  document.getElementById("chatMessages").appendChild(div);
}

socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  // Scroll to current message
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submita
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Grab message from HTML input
  const msg = e.target.elements.msg.value;

  // Emit user message to server
  socket.emit("chatMessage", msg);

  // Clear input & refocus
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});
