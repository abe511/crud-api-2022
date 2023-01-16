const request = require('supertest');

request("http://localhost:8080")
    .get("/api/users")
    .expect(200,
        //  function(err){
        // console.log(res);
    // }
    )
    .end(done);
    // .end(function(err, res) {
    //     if (err) throw err;
    //     console.log(res.body);
    // });