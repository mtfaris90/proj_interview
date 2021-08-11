import React, { useState } from "react";
import { FormControl, FilledInput } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { postMessage } from "../../store/utils/thunkCreators";

const styles = {
  root: {
    justifySelf: "flex-end",
    marginTop: 15,
  },
  input: {
    height: 70,
    backgroundColor: "#F4F6FA",
    borderRadius: 8,
    marginBottom: 20,
  },
};

const Input = (props) => {
  const [text, setText] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const reqBody = {
      text: text,
      recipientId: props.otherUser.id,
      conversationId: props.conversationId,
      sender: props.conversationId ? null : props.user,
      senderId: props.user.id,
    };
    await props.postMessage(reqBody);
    setText("");
  };

  return (
    <form className={props.classes.root} onSubmit={handleSubmit}>
      <FormControl fullWidth hiddenLabel>
        <FilledInput
          classes={{ root: props.classes.input }}
          disableUnderline
          placeholder="Type something..."
          value={text}
          name="text"
          onChange={(e) => setText(e.target.value)}
        />
      </FormControl>
    </form>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    conversations: state.conversations,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    postMessage: (message) => {
      dispatch(postMessage(message));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Input));
