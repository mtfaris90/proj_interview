const router = require("express").Router();
const { User, Conversation, Message } = require("../../db/models");
const { Op } = require("sequelize");
const onlineUsers = require("../../onlineUsers");

// get all conversations for a user, include latest message text for preview, and all messages
// include other user model so we have info on username/profile pic (don't include current user info)
// TODO: for scalability, implement lazy loading
router.get("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: {
          user1Id: userId,
          user2Id: userId,
        },
      },
      attributes: ["id", "createdAt"],
      include: [
        { model: Message },
        {
          model: User,
          as: "user1",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
        {
          model: User,
          as: "user2",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
      ],
      order: [[Message, "createdAt", "ASC"]],
    });

    conversations.sort((a, b) => {
      return b.dataValues.createdAt
        .toJSON()
        .localeCompare(a.dataValues.createdAt.toJSON());
    });

    for (let i = 0; i < conversations.length; i++) {
      const convo = conversations[i];
      const convoJSON = convo.toJSON();

      // set a property "otherUser" so that frontend will have easier access
      if (convoJSON.user1) {
        convoJSON.otherUser = convoJSON.user1;
        delete convoJSON.user1;
      } else if (convoJSON.user2) {
        convoJSON.otherUser = convoJSON.user2;
        delete convoJSON.user2;
      }

      // set property for online status of the other user
      if (onlineUsers.includes(convoJSON.otherUser.id)) {
        convoJSON.otherUser.online = true;
      } else {
        convoJSON.otherUser.online = false;
      }

      // set properties for notification count and latest message preview
      convoJSON.otherUser.notificationCount = convoJSON.messages.reduce(
        (n, message) => {
          return (
            n +
            (message.hasBeenRead === false &&
              message.senderId === convoJSON.otherUser.id)
          );
        },
        0
      );
      convoJSON.latestMessageText =
        convoJSON.messages[convoJSON.messages.length - 1].text;
      conversations[i] = convoJSON;
    }

    res.json(conversations);
  } catch (error) {
    next(error);
  }
});

router.put("/", async (req, res, next) => {
  try {
    if (!req.body.conversationId) {
      res.sendStatus(401);
    }
    const newMsgStatus = { hasBeenRead: true };
    const filter = {
      where: {
        conversationId: req.body.conversationId,
        senderId: req.body.otherUserId,
      },
    };
    await Message.update(newMsgStatus, filter);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
