const express = require("express");
const app = express();
const session = require("express-session");
const path = require("path");
const myfun = require("./RoutesFunction/routesFunction");
const fs = require("fs");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./static"));

app.set("view engine" , "ejs");
app.set("views" , __dirname + "/templates");

app.use(session({
    secret: 'portlaport',
    resave: false,
    saveUninitialized: true
}));

const viewsPath = path.join(__dirname, "views");


app.get("/" , function(req , res) {
    if(!req.session.isloggedin)
    {
        res.redirect("/login");
        return;
    }
    // res.sendFile(path.join(viewsPath, "main.html"));
    const name = req.session.username;
    res.render("main", {username : name});


    // const username = req.session.username;
    // fs.readFile(path.join(__dirname, 'views', 'main.html'), 'utf8', (err, data) => {
    //     if (err) {
    //       res.status(500).send('Error reading the file');
    //     } else {
    //         const moddata = data.replace('{{username}}', username);
    //       res.send(moddata);
    //     }
    // });
});

app.post("/todo", function (req, res) {
    if(!req.session.isloggedin)
    {
        res.status(401).send("error");
        return;
    }
    myfun.savetask(req.body, function (err) {
      if (err) {
        res.status(500).send("error");
        return;
      }
      res.status(200).send("success");
    });
});


app.post("/delete-todo" , function(req , res) { 
    const { filePath, property, value } = req.body;
    myfun.deletetask({ filePath, property, value } , function(err) {
        if (err) {
            res.status(500).send("error");
        }
        else
        {
            res.status(200).send("success");
        }
    });
});

app.post("/edit-todo", function (req, res) {
    const { filePath, property, value, itemName } = req.body;
    myfun.edittask({ filePath, property, value, itemName }, function (err) {
      if (err) {
        res.status(500).send("error");
      }
      else
      {
        res.status(200).send("success");
      }
    });
});

app.post("/edit-text-todo", function (req, res) {
    const { filePath, property, value, itemName } = req.body;
    myfun.edittasktext({ filePath, property, value, itemName }, function (err) {
      if (err) {
        res.status(500).send("error");
      }
      else
      {
        res.status(200).send("success");
      }
    });
});

app.post("/login" , function(req , res) {
    const { username, password } = req.body;
    myfun.checkcred({username , password} , function(err , isvalid) {
        if(err) {
            res.status(500).send("error");
            return;
        }
        else
        {
            if(isvalid)
            {
                req.session.isloggedin = true;
                req.session.username = username;
                // res.json({ success: true, message: 'Login successful' });
                res.redirect("/");
            }
            else
            {
                // using when sending status code and a error message on another page
                // return res.status(401).json({ success: false, message: 'Invalid credentials' });

                // using template engine like ejs.
                res.render("login" , {error : "Invalid Username or Password"});

                // using to show username on page without using server side rendering i.e. template engine.
                // res.send('<script>alert("Invalid credentials. Please try again."); window.location="/login";</script>');
            }
        }
    });
});

app.post("/signup" , function(req , res) {
    const { username, password } = req.body;
    myfun.savecred({username , password} , function(err) {
        if(err) {
            res.status(500).json({ success: false, message: err.message });
        }
        else
        {
            res.redirect("/login");
        }
    })
});

app.get("/todo-data", function (req, res) {
    if(!req.session.isloggedin)
    {
        res.status(401).send("error");
        return;
    }
    myfun.readtask(function (err , data) {
      if (err) {
        res.status(500).send("error");
        return;
      }
      res.status(200).json(data);
    });
});

app.get("/about", function (req, res) {
    if(!req.session.isloggedin)
    {
        res.redirect("/login");
        return;
    }
    res.end("about")
});
  
app.get("/contact", function (req, res) {
    if(!req.session.isloggedin)
    {
        res.redirect("/login");
        return;
    }
    res.end("contact")
});

app.get("/login" , function(req , res) {
    // res.sendFile(__dirname + "/login.html");
    res.render("login" , {error : null});
});

app.get("/signup" , function(req , res) {
    res.sendFile(__dirname + "/views/signup.html");
});

app.get("/todo" , function(req , res) {
    if(!req.session.isloggedin)
    {
        res.redirect("/login");
        return;
    }
    // res.sendFile(__dirname + "/views/main.html");
    res.render("main" , {username : req.session.username});
});

app.get("/delete-todo" , function(req , res) {
    if(!req.session.isloggedin)
    {
        res.redirect("/login");
        return;
    }
    res.sendFile(__dirname + "/views/main.html");
});

app.get("/edit-todo" , function(req , res) {
    if(!req.session.isloggedin)
    {
        res.redirect("/login");
        return;
    }
    res.sendFile(__dirname + "/views/main.html");
});

app.get("/edit-text-todo" , function(req , res) {
    if(!req.session.isloggedin)
    {
        res.redirect("/login");
        return;
    }
    res.sendFile(__dirname + "/views/main.html");
});



app.listen(5500 , function () {
    console.log("local host 5500");
});

