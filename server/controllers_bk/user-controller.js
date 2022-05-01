// import user model
const { User } = require("../models");
const { signToken } = require("../utils/auth");

module.exports = {
  async getSingleUser({ user = null, params }, res) {
    const foundUser = await User.findOne({
      $or: [
        { _id: user ? user._id : params.id },
        { username: params.username },
      ],
    });

    if (!foundUser) {
      return res
        .status(400)
        .json({ message: "Can't find a user with this ID!" });
    }

    res.json(foundUser);
  },
  async createUser({ body }, res) {
    const user = await User.create(body);

    if (!user) {
      return res.status(400).json({ message: "Something went wrong!" });
    }
    const token = signToken(user);
    res.json({ token, user });
  },
  async saveBook({ user, body }, res) {
    console.log(user);
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $addToSet: { savedBooks: body } },
        { new: true, runValidators: true }
      );
      return res.json(updatedUser);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  },
  async deleteBook({ user, params }, res) {
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      { $pull: { savedBooks: { bookId: params.bookId } } },
      { new: true }
    );
    if (!updatedUser) {
      return res
        .status(404)
        .json({ message: "Could not find user with that ID" });
    }
    return res.json(updatedUser);
  },
};
