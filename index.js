const express = require("express");
const app = express();
const PORT = 8080;
const path = require("path");
const { v4: uuidv4 } = require('uuid');         // uuidv4()
const methodOverride = require('method-override');

function generateInstagramUsername() {
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    const length = Math.floor(Math.random() * 6) + 5; // Random length between 5 and 10
    let username = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        username += characters[randomIndex];
    }

    return username;
}

function generateRandomLikesCount() {
    return Math.floor(Math.random() * 10001); // Random number between 0 and 10000 (inclusive)
}

function generateRandomCaption() {
    const words = [
        "the", "quick", "brown", "fox", "jumps", "over", "lazy", "dog", "and", "runs",
        "away", "to", "catch", "its", "prey", "under", "bright", "moon", "in", "night",
        "sky", "with", "stars", "shining", "brightly", "through", "clouds"
    ];

    const sentenceLength = Math.floor(Math.random() * 8) + 3; // Random length between 3 and 10
    let sentence = '';

    for (let i = 0; i < sentenceLength; i++) {
        const randomIndex = Math.floor(Math.random() * words.length);
        sentence += words[randomIndex] + ' ';
    }

    // Capitalize the first letter and add a period at the end
    sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1).trim() + '.';

    return sentence;
}

function generateRandomCommentsCount() {
    return Math.floor(Math.random() * 501); // Random number between 0 and 500 (inclusive)
}



let posts = [
    {
        id: uuidv4(),
        profilePicSrc: "https://i.pinimg.com/736x/25/ee/bc/25eebc3c032854b54341e17fc319a319.jpg",
        username: generateInstagramUsername(),
        postSrc: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtn9KL9-ZNIn0Nd3wdIcEDZhA_1pTppMQyCw&s",
        likesCount: generateRandomLikesCount(),
        caption: generateRandomCaption(),
        commentsCount: generateRandomCommentsCount(),
    },
    {
        id: uuidv4(),
        profilePicSrc: "https://i.pinimg.com/originals/d0/4b/1f/d04b1f2ed3ca8ad4a302fbe9f4f5a875.jpg",
        username: generateInstagramUsername(),
        postSrc: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Beautiful_landscape.JPG/1200px-Beautiful_landscape.JPG?20130221170937",
        likesCount: generateRandomLikesCount(),
        caption: generateRandomCaption(),
        commentsCount: generateRandomCommentsCount(),
    },
    {
        id: uuidv4(),
        profilePicSrc: "https://marketplace.canva.com/EAFSTby_Nnc/1/0/1600w/canva-black-and-blue-modern-instagram-profile-picture-gkkLzYu1aGg.jpg",
        username: generateInstagramUsername(),
        postSrc: "https://i0.wp.com/post.medicalnewstoday.com/wp-content/uploads/sites/3/2022/01/inappropriate_laughter_GettyImages1134729066_Header-1-1024x575.jpg?w=1155&h=1528",
        likesCount: generateRandomLikesCount(),
        caption: generateRandomCaption(),
        commentsCount: generateRandomCommentsCount(),
    },
    {
        id: uuidv4(),
        profilePicSrc: "data:image/jpeg;base64,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",
        username: generateInstagramUsername(),
        postSrc: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_EIZZ9plD7e0axQmGCYZcztOgBYgJ29ELUg&s",
        likesCount: generateRandomLikesCount(),
        caption: generateRandomCaption(),
        commentsCount: generateRandomCommentsCount(),
    },
    {
        id: uuidv4(),
        profilePicSrc: "https://i.pinimg.com/474x/87/be/16/87be1686157a356132813070bbb1c027.jpg",
        username: generateInstagramUsername(),
        postSrc: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0e9MxeEIuraZjITE3DgdByDH0LzdmsyOABA&s",
        likesCount: generateRandomLikesCount(),
        caption: generateRandomCaption(),
        commentsCount: generateRandomCommentsCount(),
    },
    {
        id: uuidv4(),
        profilePicSrc: "https://png.pngtree.com/thumb_back/fh260/background/20230612/pngtree-man-wearing-glasses-is-wearing-colorful-background-image_2905240.jpg",
        username: generateInstagramUsername(),
        postSrc: "https://www.adorama.com/alc/wp-content/uploads/2018/11/landscape-photography-tips-yosemite-valley-feature.jpg",
        likesCount: generateRandomLikesCount(),
        caption: generateRandomCaption(),
        commentsCount: generateRandomCommentsCount(),
    },
];

// For using method-override
app.use(methodOverride('_method'))

// For getting post request propery
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// For public folder
app.use(express.static(path.join(__dirname, "public")));

// for views folder
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

//  For get request for all posts
app.get("/", (req, res) => {
    res.render("index.ejs", {posts});
});

// For Post request for a new post
app.get("/posts/new", (req, res) => {
    res.render("new.ejs");
})

app.post("/posts/new", (req, res) => {
    let {profilePicSrc, postSrc} = req.body;
    console.log(profilePicSrc);

    let obj = {
        id: uuidv4(),
        profilePicSrc: profilePicSrc,
        username: generateInstagramUsername(),
        postSrc: postSrc,
        likesCount: generateRandomLikesCount(),
        caption: generateRandomCaption(),
        commentsCount: generateRandomCommentsCount(),
    };

    posts.push(obj);
    
    res.redirect('/');
})

// For Updating profilePicSrc               for edit (patch)
app.get("/posts/:id/edit", (req, res) => {
    let { id } = req.params;
    console.log(`Got Get request for patch with post id: ${id}`);


    let index = -1
    for(let i=0; i<posts.length; i++){
        if(posts[i].id == id){
            index = i;
            break;
        }
    }
    if (index == -1) res.send("No post found");
    console.log(`index of the post is ${index}`);


    let postix = posts[index];
    console.log("postix is: ", postix);


    res.render("edit.ejs", { postix });
})

app.patch("/posts/:id/", (req, res) => {
    let {id} = req.params;
    let {postSrc} = req.body; 

    console.log(`we are in patch request area, id of post: ${id} and new link to be added: ${postSrc}`);

    let index = -1;
    for(let i=0; i<posts.length; i++){
        if(posts[i].id == id){
            index = i;
            break;
        }
    }
    if (index == -1) res.send("No post found");

    posts[index].postSrc = postSrc; 
    
    res.redirect('/');
});




// For deleting a post
app.delete("/posts/:id", (req, res) => {
    let { id } = req.params;
    console.log(`Deleting post with id ${id}`);

    let index = -1;

    for (let i = 0; i<posts.length; i++) {
        if ( posts[i].id == id ) {
            index = i;
            break;
        }
    }

    if(index == -1) {res.send("No post found with this id")}

    posts.splice(index, 1);

    res.redirect('/');
});

app.listen(PORT, () => {
    console.log("Server started running...");
});