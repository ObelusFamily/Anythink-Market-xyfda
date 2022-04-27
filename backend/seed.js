require("dotenv").config();
var mongoose = require("mongoose");
require("./models/User")
require("./models/Item")
require("./models/Comment")
var User = mongoose.model("User");
var Item = mongoose.model("Item");
var Comment = mongoose.model("Comment");

// mongoose.connect('mongodb://127.0.0.1:27017/wilco');
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set("debug", true);

const getUsers = async () => {
    const users = await User.find({});
    const userMap = {}
    users.forEach((user) => {
        userMap[user._id] = user;
      });
    console.log(userMap)
}
const getComments = async () => {
    const comments = await Comment.find({});
    const commentMap = {}
    comments.forEach((comment) => {
        commentMap[comment._id] = comment;
      });
    console.log(commentMap)
}

const getItems = async () => {
    const items = await Item.find({});
    const itemMap = {}
    items.forEach((item) => {
        itemMap[item._id] = item;
      });
    console.log(itemMap);
}
const deleteAllUsers = () => {
    User.deleteMany().then(function(){
        console.log("Users are deleted"); // Success
    }).catch(function(error){
        console.log(error); // Failure
    });
}

const deleteAllComments = () => {
    Comment.deleteMany().then(function(){
        console.log("Comments are deleted"); // Success
    }).catch(function(error){
        console.log(error); // Failure
    });
}
const deleteAllItems = () => {
    Item.deleteMany().then(function(){
        console.log("Items are deleted"); // Success
    }).catch(function(error){
        console.log(error); // Failure
    });
}
const createUser = async (index) => {
    const doc = new User({
        username: `user${index}`,
        email: `user${index}@example.com`,
        salt: `${index}`,
        role: 'user'
    });
    const user = await doc.save();
    console.log(`adding ${user.id}`);

    return user;
}

const createComment = async (index) => {
    const doc = new Comment({
        body: `comment ${index}`
    });
    const comment = await doc.save();
    console.log(`adding ${comment.id}`);

    return comment;
}

const createItem = async (userId, commentId, index) => {
    const doc = new Item({
        slug: `item${index}`,
        title: `item${index}`,
        description: `item #${index}`,
        image: '',
        comments: [commentId],
        tagList: ['Others'],
        seller: userId
      },);
    const item = await doc.save();
    console.log(`adding ${item.id}`);

    return item;
}

const addItems = async () => {
    await deleteAllUsers();
    await deleteAllComments();
    await deleteAllItems();
    await getUsers();
    await getComments();
    await getItems();

    for (let index = 1; index <= 120; index++) {

        let user = await createUser(index);
        let comment = await createComment(index);
        console.log(user.id, comment.id)

        let item = createItem(user.id, comment.id, index);
        console.log(item.id)

    }
    await getUsers();
    await getComments();
    await getItems();
    
}


addItems().then(() => mongoose.connection.close());