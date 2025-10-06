const Users = require("../model/User");
const userService = require("../service/userService");
const bcrypt = require("bcryptjs");


class UserController {
    list(req, res) {
          return userService.getRecord(req, res);
      };
     
      changePassword = async (req, res) => {

        try {
          const userId = req.user.id;
          const { currentPassword, newPassword } = req.body;
      
      
          const user = await Users.findById(userId);
      
          if (!user) {
            return res.status(404).json({ message: "User not found" });
          }
      
          const isMatch = await bcrypt.compare(currentPassword, user.password);
      
          if (!isMatch) {
            return res.status(400).json({ message: "Current password is incorrect" });
          }
      
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(newPassword, salt);
      
      
          user.password = hashedPassword;
          await user.save();
      
      
          return res.status(200).json({ message: "Password changed successfully" });
        } catch (err) {
          return res.status(500).json({ message: "Server error" });
        }
      };
}

module.exports = new UserController();
