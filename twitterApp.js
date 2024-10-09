const express = require('express');
const path = require('path');
const dbpath = path.join(__dirname,"twitterClone.db");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
let db = undefined;
const app = express();
app.use(express.json());
const {open} = require('sqlite');
const sqlite3 = require('sqlite3');
const { get } = require('express/lib/response');
const req = require('express/lib/request');
// const { get } = require('http');
const initializeDbandServer = async() => {
    try 
    {
        db = await open({
            filename: dbpath,
            driver: sqlite3.Database
        });
        app.listen(3000,()=>{
            console.log("server is running at localhost:3000");
        });
    }
    catch(e)
    {
        console.log(`Db error is ${e.message}`);
        process.exit(1);
    }
}
initializeDbandServer();


//user login verify middleware function
const verifyUser = (request,response,next) => {
    const authHeader = request.headers["authorization"];
    let jwtToken;
    if(authHeader !== undefined)
    {
        jwtToken = authHeader.split(" ")[1];
    }
    if(jwtToken === undefined)
    {
        //user not valid
        response.status(400);
        response.send("Invalid username");
    }
    else 
    {
        jwt.verify(jwtToken,"twitter_key",async(error,payload) => {
            if(error)
            {
                response.status(400);
                response.send("Invalid user");
            }
            else 
            {
                request.username = payload.username;
                next();
            }
        });
    }
}

//check whether tweet posted by user is the user following person
const checkTweet = async (request,response,next) => {
    const username = request.username;
    const {tweetId} = request.params;
    
    const getUserId = `SELECT * FROM user WHERE username='${username}';`;
    const userId = await db.get(getUserId);

    const userFollowingQuery = `SELECT * FROM follower WHERE follower_user_id=${userId.user_id};`;
    const userFollowing = await db.all(userFollowingQuery);
    
    const getTweet = `SELECT * FROM tweet WHERE tweet_id=${tweetId};`;
    const tweetDetails = await db.get(getTweet);
    const id = tweetDetails.user_id; //user id who posted this tweet
    let x = 0;
    for(let ind=0; ind<userFollowing.length; ind++)
    {
        let t1 = userFollowing[ind].following_user_id;
        if(t1 == id)
        {
            x = 1;
            break;
        }
    }
    if(x == 0)
    {
        //the user who posted the tweet is not following by current user
        response.status(401);
        response.send("Invalid request");
    }
    else 
    {
        request.tweetDetails = tweetDetails;
        next();
    }
}

//user register api
app.post('/register/',async(request,response) => {
    const { name,username,password,gender } = request.body;
    const hashedPassword = await bcrypt.hash(password,13);
    const checkUser = `SELECT * FROM user WHERE username='${username}';`;
    const dbUser = await db.get(checkUser);
    if(dbUser == undefined)
    {
        //username not exists
        if(password.length < 6)
        {
            //password length is less than 6
            //it should be atleast 6
            response.status(400);
            response.send("Password is too short");
        }
        else 
        {
            //password length is greater than or equal to 6
            const insertQuery = `INSERT INTO user(name,username,password,gender) VALUES('${name}','${username}','${hashedPassword}','${gender}');`;
            const createUser = await db.run(insertQuery);
            response.send("user created successfully");
        }
    }
    else 
    {
        //username already exits
        response.status(400);
        response.send("username already exists");
    }
});


//user login api
app.post('/login/',async(request,response) => {
    const {username,password} = request.body;
    const getDetails = `SELECT * FROM user WHERE username='${username}';`;
    const dbUser = await db.get(getDetails);
    if(dbUser == undefined)
    {
        //user not found
        response.status(400);
        response.send("Invalid user");
    }
    else 
    {
        //user found
        const isPasswordMatched = await bcrypt.compare(password,dbUser.password);
        if(isPasswordMatched == true)
        {
            //password correct
            //successful login
            const payload = {username: username};
            const jwtToken = jwt.sign(payload,"twitter_key");
            response.status(200);
            response.send({jwtToken: jwtToken});
        }
        else 
        {
            //password incorrect
            response.status(400);
            response.send("Invalid password");
        }
    }
});


//getting user -> following members tweets
app.get('/user/tweets/feed/',verifyUser, async(request,response) => {
    const {limit=4} = request.query;
    const username = request.username;
    const getId = `SELECT * FROM user WHERE username='${username}';`;
    const details = await db.get(getId);
    const userId = details.user_id;
    //get user following people id's
    const getUserFollowing = `SELECT * FROM follower WHERE follower_user_id=${userId};`;
    const getFollowing = await db.all(getUserFollowing);
    //get user following people tweets
    let followingDetails = [];
    let x=0;
    for(let i=0; i<getFollowing.length; i++)
    {
        x++;
        const id1 = getFollowing[i].following_user_id;
        const getTweets = `SELECT * FROM tweet WHERE user_id=${id1};`;
        const getTweetDetails = await db.get(getTweets);
        followingDetails.push(getTweetDetails);
        if(x == limit)
        {
            break;
        }
    }
    response.send(followingDetails);
});

//getting user following members name api
app.get('/user/following/',verifyUser,async (request,response) =>{
    const username = request.username;
    const getUserId = `SELECT * FROM user WHERE username='${username}';`;
    const userDetails = await db.get(getUserId);
    const getFollowing = `SELECT following_user_id FROM follower WHERE follower_user_id=${userDetails.user_id};`;
    const following = await db.all(getFollowing);
    let temp1 = [];
    for(let ind=0; ind<following.length; ind++)
    {
        const getName = `SELECT * FROM user WHERE user_id=${following[ind].following_user_id};`;
        const nameDetails = await db.get(getName);
        temp1.push({name: nameDetails.name});
    }
    response.send(temp1);
});

//getting the details of members who follows the user
app.get('/user/followers/',verifyUser,async (request,response) => {
    const username = request.username;
    const getUserId = `SELECT * FROM user WHERE username='${username}';`;
    const getId = await db.get(getUserId);
    const userFollowers = `SELECT * FROM follower WHERE following_user_id = ${getId.user_id};`;
    const userFollowersId = await db.all(userFollowers);
    let ind = 0;
    let temp2 = [];
    for(ind=0; ind<userFollowersId.length; ind++)
    {
        const getFollowerNames = `SELECT * FROM user WHERE user_id = ${userFollowersId[ind].follower_user_id};`;
        const getName = await db.get(getFollowerNames);
        temp2.push({follower_name: getName.name});
    }
    response.send(temp2);
});

//getting tweet based on tweet id - api
app.get('/tweets/:tweetId/',verifyUser,checkTweet,async (request,response) => {
    const {tweetId} = request.params;
    const tweetDetails = request.tweetDetails;
    const likesCountQuery = `SELECT * FROM like WHERE tweet_id=${tweetId};`;
    const likesCount = await db.all(likesCountQuery);
    const repliesCountQuery = `SELECT * FROM replyTable WHERE tweet_id=${tweetId};`;
    const repliesCount = await db.all(repliesCountQuery);
    const ans = {
        "tweet" : tweetDetails.tweet,
        "likes" : likesCount.length,
        "replies" : repliesCount.length,
        "dateTime" : tweetDetails.date_time
    };
    response.send(ans);
});

//getting the names of persons who liked the tweet - api
app.get('/tweets/:tweetId/likes/',verifyUser,checkTweet,async (request,response) => {
    const {tweetId} = request.params;
    const likesQuery = `SELECT * FROM like WHERE tweet_id=${tweetId};`;
    const likesDetails = await db.all(likesQuery);
    let ind=0;
    let t2 = [];
    for(ind=0; ind<likesDetails.length; ind++)
    {
        const likesGivenByUserQuery = `SELECT * FROM user WHERE user_id=${likesDetails[ind].user_id};`;
        const userDetails = await db.get(likesGivenByUserQuery);
        t2.push(userDetails.name);
    }
    response.send({likes : t2});
});

//getting the details who gives replies to the tweet - api
app.get('/tweets/:tweetId/replies/',verifyUser,checkTweet,async(request,response) => {
    const {tweetId} = request.params;
    const repliesQuery = `SELECT * FROM replyTable WHERE tweet_id=${tweetId};`;
    const replies = await db.all(repliesQuery);
    let ind=0;
    let ans = [];
    for(ind=0; ind<replies.length; ind++)
    {
        const userDetailsQuery = `SELECT * FROM user WHERE user_id=${replies[ind].user_id};`;
        const userDetails = await db.get(userDetailsQuery);
        ans.push({name: userDetails.name, replies: replies[ind].reply});
    }
    response.send(ans);
});

//get the tweets of the user - api
app.get('/user/tweets/',verifyUser,async(request,response) => {
    const username = request.username;
    const userDetailsQuery = `SELECT * FROM user WHERE username='${username}';`;
    const userDetails = await db.get(userDetailsQuery);

    const tweetsDetailsQuery = `SELECT * FROM tweet WHERE user_id=${userDetails.user_id};`;
    const tweetsDetails = await db.all(tweetsDetailsQuery);

    let ind = 0;
    let ans = [];
    for(ind=0; ind<tweetsDetails.length; ind++)
    {
        const likesCountQuery = `SELECT * FROM like WHERE tweet_id=${tweetsDetails[ind].tweet_id};`;
        const likesCount = await db.all(likesCountQuery);

        const repliesCountQuery = `SELECT * FROM replyTable WHERE tweet_id=${tweetsDetails[ind].tweet_id};`;
        const repliesCount = await db.all(repliesCountQuery);

        ans.push({
            tweet : tweetsDetails[ind].tweet,
            likes : likesCount.length,
            replies : repliesCount.length,
            dateTime : tweetsDetails[ind].date_time
        });
    }
    response.send(ans);
}); 

//create a tweet - api
app.post('/user/tweets/',verifyUser,async(request,response) => {
    const username = request.username;
    const {tweet} = request.body;
    const userDetailsQuery = `SELECT * FROM user WHERE username='${username}';`;
    const userDetails = await db.get(userDetailsQuery)
    const date = new Date();
    const insertTweetQuery = `INSERT INTO tweet(tweet,user_id,date_time) VALUES('${tweet}',${userDetails.user_id},'${date}');`;
    await db.run(insertTweetQuery);
    response.send("Created a tweet");
})

//delete a tweet - api
app.delete('/tweets/:tweetId/',verifyUser,async(request,response) => {
    const username = request.username;
    const {tweetId} = request.params;
    const userDetailsQuery = `SELECT * FROM user WHERE username='${username}';`;
    const userDetails = await db.get(userDetailsQuery);

    const tweetDetails = `SELECT * FROM tweet WHERE tweet_id=${tweetId};`;
    const tweet = await db.get(tweetDetails);

    if(userDetails.user_id != tweet.user_id)
    {
        response.status(401);
        response.send("Invalid request");
    }
    else 
    {
        const deleteQuery = `DELETE FROM tweet WHERE tweet_id=${tweetId};`;
        await db.run(deleteQuery);
        response.send("Deleted");
    }
});



