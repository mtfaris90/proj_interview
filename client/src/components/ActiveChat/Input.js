import React, { useState } from "react";
import { FormControl, FilledInput } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { postMessage } from "../../store/utils/thunkCreators";

const useStyles = makeStyles(() => ({
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
}));

const Input = ({ otherUser, conversationId }) => {
  const [text, setText] = useState("");

  const classes = useStyles();

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const reqBody = {
      text: text,
      recipientId: otherUser.id,
      conversationId: conversationId,
      sender: conversationId ? null : user,
      senderId: user.id,
    };
    await dispatch(postMessage(reqBody));
    setText("");
  };

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <FormControl fullWidth hiddenLabel>
        <FilledInput
          classes={{ root: classes.input }}
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

export default Input;