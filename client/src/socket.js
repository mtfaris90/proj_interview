import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
  readConversation,
} from "./store/conversations";

const socket = io(window.location.origin);

socket.on("connect", () => {
  console.log("connected to server w/ id ", socket.id);
});

socket.on("add-online-user", (id) => {
  store.dispatch(addOnlineUser(id));
});

socket.on("remove-offline-user", (id) => {
  store.dispatch(removeOfflineUser(id));
});

socket.on("message-from-server", (data) => {
  store.dispatch(
    setNewMessage(data.message, data.sender, data.recipientId, data.senderId)
  );
});

socket.on("convo-read-from-server", (data) => {
  store.dispatch(
    readConversation(data.conversationId, data.otherUserId, data.convoLength)
  );
});

socket.on("disconnect", () => {
  console.log("disconnected from server");
});

export default socket;
