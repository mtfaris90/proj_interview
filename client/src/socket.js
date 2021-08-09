import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
  readConversation,
} from "./store/conversations";

const socket = io(window.location.origin);

let user = undefined;
let conversations = [];

socket.on("connect", () => {
  const state = store.getState();
  user = state.user;
  conversations = state.conversations;
});

socket.on("add-online-user", (id) => {
  // ignore event if other user is already online OR there is no convo with other user
  if (
    !conversations.some(
      (convo) => convo.otherUser.id === id && convo.otherUser.online === false
    )
  ) {
    return;
  }
  store.dispatch(addOnlineUser(id));
});

socket.on("remove-offline-user", (id) => {
  // ignore event if other user is already offline OR there is no convo with other user
  if (
    !conversations.some(
      (convo) => convo.otherUser.id === id && convo.otherUser.online === true
    )
  ) {
    return;
  }
  store.dispatch(removeOfflineUser(id));
});

socket.on("message-from-server", (data) => {
  // ignore event if message isn't for this user
  if (user.id !== data.recipientId) {
    return;
  }
  store.dispatch(
    setNewMessage(data.message, data.sender, data.recipientId, data.senderId)
  );
});

socket.on("convo-read-from-server", (data) => {
  // ignore event if if this user doesn't have the conversation
  if (!conversations.some((convo) => convo.id === data.conversationId)) {
    return;
  }
  store.dispatch(
    readConversation(data.conversationId, data.otherUserId, data.convoLength)
  );
});

socket.on("disconnect", () => {
  console.log("disconnected from server");
  user = undefined;
  conversations = [];
});

export default socket;
