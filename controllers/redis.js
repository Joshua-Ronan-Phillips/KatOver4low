var client = require('redis').createClient(process.env.REDIS_URL);

var redisKato = {

    addQuestion: function(question, myEmit) {
        //console.log('NEWSESHCALL', callback);
        client.incr('idCounter', function(err, reply) {
            var thisId = reply;
            // adds question to the scoreboard, with initial score 0
            client.zadd("qScoreboard", 0, thisId);
            // adds question id to question list
            client.lpush(["question", thisId], function(err, reply) {

            });

            question.myId = thisId;
            console.log(question.myId);
            //

            client.hmset(thisId, question, function() {
                redisKato.getLatestQuestions(myEmit);
            });
        });
    },
    getFullQuestion: function(id, callback){
            var multi = client.multi();
            multi.hgetall(id);
            multi.exec(function(err, replies) {
            callback(replies);
            });
        },
    editHash: function() {
        // need to check that current user authored the question/comment

    },

    // myEmit: function(data){
    // var stringData = JSON.stringify(data);
    // app.io.emit('recieve updated questions', stringData);
    // console.log('MYEMIT-dataaaa', data);
    // },

    getLatestQuestions: function(myEmitcallback) {
        // console.log('LOG2222', callback);
        client.lrange("question", 0, 10, function(err, reply){
            var questionsToGetArr = [];
            questionsToGetArr = reply;
            console.log('log Qs2Get', questionsToGetArr);
            if (err) {
                console.log(err);
            }
            else{
            //  console.log('LOG3333', callback);
              redisKato.idsToObjects(questionsToGetArr, myEmitcallback);
            }
      });
    },

    getBestQuestions: function() {

    },

    upVote: function() {

    },

    downVote: function() {

    },

    addComment: function(comment, callback) {
        client.incr('idCounter', function(err, reply) {
            var thisId = reply;
            comment.cId = thisId;

            client.zadd("quesCommentLink", comment.qId, thisId);

            client.lpush(["comment", thisId], function(err, reply) {

            });
            client.hmset(thisId, comment, function() {
                callback();
            });
        });
    },

    getQuestionComments: function(qid, callback) {
        client.zrangebyscore("quesCommentLink", qid, qid, function(err, reply) {

            redisKato.idsToObjects(reply, callback);
        });
    },

    idsToObjects: function(ids, myEmitcallback) {
      var objects = [];
      var multi = client.multi();
        ids.forEach(function(id){
            // console.log('LOG4444', callback);
        multi.hgetall(id);
        });
        multi.exec(function(err, replies) {
        //  console.log('LOG5555', callback);
        //  console.log('multi output =    ', replies);
        myEmitcallback(replies);


        });
    }
};

// var sampleQuestion = {
//     username: 'kat',
//     title: 'First kato',
//     content: 'Loads of kato content. Loads of kato content. Loads of kato content. Loads of kato content. Loads of kato content. Loads of kato content.',
//     date: '2015-10-10'
// };
//
// var sampleComment = {
//     qId: 2,
//     username: 'josh',
//     content: 'Comment for question 3 kato content. Loads of kato content.',
//     date: '2015-10-10'
// };

//
// redisKato.getQuestionComments(2, function(data) {
//     console.log(data);
// });
//
// redisKato.addComment(sampleComment, function() {
//     console.log('added the helloooo');
// });
//
//
// redisKato.addQuestion(sampleQuestion, function() {
//     console.log('1added the helloooo');
// });
//
//
// redisKato.addComment(sampleComment, function() {
//     console.log('added the helloooo');
// });

module.exports = redisKato;
