import React from "react";
import { Box } from "@material-ui/core";
import { BadgeAvatar, ChatContent } from "../Sidebar";
import { withStyles } from "@material-ui/core/styles";
import { setActiveChat } from "../../store/activeConversation";
import { updateConvoToRead } from "../../store/utils/thunkCreators";
import { connect } from "react-redux";

const styles = {
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
};

const Chat = (props) => {

  const handleClick = async (conversation) => {
    if (conversation.id) {
      await props.readConversation(conversation.id, conversation.otherUser.id, props.userId);
    }
    await props.setActiveChat(conversation.otherUser.username);
  }

  return (
      <Box
        onClick={() => handleClick(props.conversation)}
        className={props.classes.root}
      >
        <BadgeAvatar
          photoUrl={props.conversation.otherUser.photoUrl}
          username={props.conversation.otherUser.username}
          online={props.conversation.otherUser.online}
          sidebar={true}
        />
        <ChatContent conversation={props.conversation} />
      </Box>
    );;
}

const mapStateToProps = (state) => {
  return {
    userId: state.user.id
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveChat: (id) => {
      dispatch(setActiveChat(id));
    },
    readConversation: (conversationId, otherUserId, userId) => {
      dispatch(updateConvoToRead(conversationId, otherUserId, userId));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Chat));
