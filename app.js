var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/blogapp');

var PostSchema = mongoose.Schema({
    title: {type: String, required: true},
    body: {type: String, required: true},
    posted:{type: Date, default: Date.now}
}, {collection: 'post'});

var PostModel = mongoose.model("PostModel", PostSchema);

var app = express();

var port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + '/public'));

app.post("/api/blogpost", createPost);
app.get('/api/blogpost', getAllPosts);
app.get("/api/blogpost/:id", editPost);
app.delete("/api/blogpost/:id", deletePost);
app.put("/api/blogpost/:id", updatePost);

function updatePost(req, res) {
    var postId = req.params.id;
    var post = req.body;
    PostModel.update({_id: postId}, {
       title: post.title,
       body: post.body 
    })
    .then(
        function(status) {
            res.sendStatus(200);
        },
        function(err) {
            res.sendStatus(400);
        }
    )
}

function editPost(req, res) {
    var postId = req.params.id;
    PostModel.findById({_id: postId})
             .then(
                 function(post) {
                    res.json(post);
                 },
                 function(err) {
                    res.sendStatus(400);
                 }
             )
}

function deletePost(req, res) {
    var postId = req.params.id;
    PostModel.remove({_id: postId})
             .then(
                 function() {
                     res.sendStatus(200);
                 },
                 function() {
                     res.sendStatus(400);
                 }
             );
};

function getAllPosts(req, res) {
    PostModel.find()
             .then(
                function(posts){
                    res.json(posts);
                },
                function(err){
                    res.sendStatus(400);
                }
             );
}

function createPost(req, res) {
    var post = req.body;
    console.log(post);
    PostModel.create(post)
             .then(
        function(postObj){
            res.json(200);
        },
        function(error) {
            res.sendStatus(400);
        }
    );
};

app.listen(port, function(){
    console.log('Server connected to localhost:' + port);
});
