import React from "react";
import { Box } from "@material-ui/core";
import { BadgeAvatar, ChatContent } from "../Sidebar";
import { makeStyles } from "@material-ui/core/styles";
import { setActiveChat } from "../../store/activeConversation";
import { updateConvoToRead } from "../../store/utils/thunkCreators";
import { useSelector, useDispatch } from "react-redux";

const useStyles = makeStyles(() => ({
  root: {
    borderRadius: 8,
    height: 80,
    boxShadow: "0 2px 10px 0 rgba(88,133,196,0.05)",
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    "&:hover": {
      cursor: "grab",
    },
  },
}));

const Chat = ({ conversation }) => {
  const classes = useStyles();

  const userId = useSelector((state) => state.user.id);
  const dispatch = useDispatch();

  const handleClick = async (convo) => {
    if (convo.id) {
      await dispatch(updateConvoToRead(convo.id, convo.otherUser.id, userId));
    }
    await dispatch(setActiveChat(convo.otherUser.username));
  };

  return (
    <Box onClick={() => handleClick(conversation)} className={classes.root}>
      <BadgeAvatar
        photoUrl={conversation.otherUser.photoUrl}
        username={conversation.otherUser.username}
        online={conversation.otherUser.online}
        sidebar={true}
      />
      <ChatContent conversation={conversation} />
    </Box>
  );
};

export default Chat;