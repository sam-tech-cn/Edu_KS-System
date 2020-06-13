db.users.insertMany([
    { 
        "_id" : ObjectId("5df62ab83485e71a55149d8a"), 
        "admin" : true, 
        "name" : "admin", 
        "email" : "admin@admin.com", 
        "password" : "$2b$10$uBE9rU4diJgEJzQsfD9Jt.M/vbzEtVg8cdqusbqsGnUYG.jSujpyK", 
        "note" : "init password admin, admin is true"
    },
    { 
        "_id" : ObjectId("5ee4449cacad8a305a5d9ff8"), 
        "admin" : false, 
        "name" : "developer", 
        "email" : "develper@dev.com", 
        "password" : "$2b$10$hEsWuTVxPV/3BvH/Lb3Fye/LGbk.4OzesMD1xsQOcw1BDhXanwU/2", 
        "note" : "init password developer, admin is false"
    }
    
])