const Users = require("../model/User");



class userService{

    async getRecord(req, res){
        try{
            const data = await Users.find()
            res.status(200).json({ message: "User Listed Succussfully",data:data });
          }
          catch(err){
            res.status(400).json({ error: err });
          }
    }

}

module.exports = new userService;