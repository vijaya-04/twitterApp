-- CREATE TABLE user(user_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,name TEXT,username TEXT,password TEXT,gender TEXT);


-- CREATE TABLE follower(follower_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,follower_user_id INTEGER,following_user_id INTEGER);
-- INSERT INTO follower(follower_user_id,following_user_id) VALUES(5,3);
-- INSERT INTO follower(follower_user_id,following_user_id) VALUES(5,10);
-- INSERT INTO follower(follower_user_id,following_user_id) VALUES(6,10);
-- INSERT INTO follower(follower_user_id,following_user_id) VALUES(8,7);
-- SELECT * FROM follower;



-- CREATE TABLE tweet(tweet_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,tweet TEXT,user_id TEXT,date_time DATETIME);
-- INSERT INTO tweet(tweet,user_id,date_time) VALUES("Kalki super hit",8,"2024-06-28 14:50:21");
-- INSERT INTO tweet(tweet,user_id,date_time) VALUES("Happy birthday dhoni",10,"2024-07-07 00:00:00");
-- INSERT INTO tweet(tweet,user_id,date_time) VALUES("waiting for massive hit NTR movie 'Devara'",6,"2024-06-01 14:40:19");
-- INSERT INTO tweet(tweet,user_id,date_time) VALUES("Linked in is becoming popular everyday",7,"2024-07-01 14:50:19");
-- INSERT INTO tweet(tweet,user_id,date_time) VALUES("today weather is super",9,"2024-07-01 14:50:19");
-- INSERT INTO tweet(tweet,user_id,date_time) VALUES("Indian team win millions of hearts",5,"2024-07-03 14:50:39");
-- SELECT * FROM tweet;



-- CREATE TABLE reply(reply_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,tweet_id INTEGER,reply TEXT,user_id INTEGER);
-- INSERT INTO replyTable(tweet_id,reply,user_id,date_time) VALUES(3,"Jai prabhas",4,"2024-06-01 14:40:19");
-- INSERT INTO replyTable(tweet_id,reply,user_id,date_time) VALUES(3,"Kalki is an fanbase movie",5,"2024-07-01 14:40:19");
-- INSERT INTO replyTable(tweet_id,reply,user_id,date_time) VALUES(5,"Yes",7,"2024-07-02 14:40:19");
-- INSERT INTO replyTable(tweet_id,reply,user_id,date_time) VALUES(5,"Waiting!!!",8,"2024-06-02 14:40:19");
-- INSERT INTO replyTable(tweet_id,reply,user_id,date_time) VALUES(2,"Let's celebrate",4,"2024-06-08 14:50:19");
-- INSERT INTO replyTable(tweet_id,reply,user_id,date_time) VALUES(2,"Congrats Indian team",7,"2024-07-01 15:40:19");
-- INSERT INTO replyTable(tweet_id,reply,user_id,date_time) VALUES(4,"happy birthday thala",5,"2024-06-05 14:40:10");
-- INSERT INTO replyTable(tweet_id,reply,user_id,date_time) VALUES(6,"yah! its true",8,"2024-06-06 14:49:19");
-- INSERT INTO replyTable(tweet_id,reply,user_id,date_time) VALUES(6,"yes! such a great platform",9,"2024-07-01 14:40:19");
-- INSERT INTO replyTable(tweet_id,reply,user_id,date_time) VALUES(7,"yes! it's nature beauty",8,"2024-06-05 14:40:19");
-- INSERT INTO replyTable(tweet_id,reply,user_id,date_time) VALUES(7,"yes! it's true",3,"2024-06-09 14:40:19");
-- INSERT INTO replyTable(tweet_id,reply,user_id,date_time) VALUES(8,"yah! congrats to whoile india team",4,"2024-07-01 18:40:19");
-- INSERT INTO replyTable(tweet_id,reply,user_id,date_time) VALUES(8,"it's true",3,"2024-07-01 14:40:19");

-- SELECT * FROM replyTable;



-- CREATE TABLE like(like_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,tweet_id INTEGER,user_id INTEGER,date_time DATETIME);
-- INSERT INTO like(tweet_id,user_id,date_time) VALUES(8,6,"2024-07-04 14:50:19");
-- INSERT INTO like(tweet_id,user_id,date_time) VALUES(5,4,"2024-06-01 14:50:19");
-- INSERT INTO like(tweet_id,user_id,date_time) VALUES(3,3,"2024-07-04 14:50:19");
-- INSERT INTO like(tweet_id,user_id,date_time) VALUES(6,8,"2024-07-04 14:50:19");
-- SELECT * FROM like;