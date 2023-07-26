const fs = require("fs");
function readtask (callback) 
{
    fs.readFile("./task.json" , "utf8" , function(err , data) {
        if(err)
        {
            callback(err);
            return;
        }

        if(data.length === 0)
        {
            data = "[]";
        }

        try
        {
            data = JSON.parse(data);
            callback(null , data);
        }
        catch(err)
        {
            callback(err);
        }
    });
}

function savetask(todo , callback)
{
    readtask(function(err ,data) {
        if(err)
        {
            callback(err);
            return;
        }
        data.push(todo);

        fs.writeFile("./task.json" , JSON.stringify(data,null,2) , function (err) {
            if(err)
            {
                callback(err);
                return;
            }
            callback(null);
        });
    });
}

function deletetask({filePath, property, value })
{
    // const {filePath , property , value} = body;
    fs.readFile(filePath , "utf8" , (err , data) => {
        if(err)
        {
            console.error("error while reading");
            return;
        }

        try
        {
            const jsonData = JSON.parse(data);
            const filterdata = jsonData.filter(item => item[property] !== value);
            const updateddata = JSON.stringify(filterdata,null,2);

            fs.writeFile(filePath , updateddata , 'utf8' , (err) => {
                if(err)
                {
                    console.log("error while writing");
                }
                else
                {
                    console.log(`data ${value} removed`);
                }
            });
        } 
        catch(err)
        {
            console.log("error while parsing json");
        }
    });
}

function edittask({ filePath, property, value, itemName })
{
    console.log(filePath, property, value, itemName);
    fs.readFile(filePath , "utf8" , (err , data) => {
        if(err)
        {
            console.error("error while reading");
            return;
        }

        try
        {
            const jsonData = JSON.parse(data);
            const toupdate = jsonData.find((item) => item['tasktext'] === itemName && item[property] !== value);
            console.log(toupdate);
            if(toupdate) 
            {
                if (property === 'tasktext') {
                    toupdate['tasktext'] = value;
                }

                toupdate['completed'] = !toupdate['completed'];
                const updateddata = JSON.stringify(jsonData ,null ,2);

                fs.writeFile(filePath , updateddata , 'utf8' , (err) => {
                    if(err)
                    {
                        console.log("error while writing");
                        return;
                    }
                    console.log("data updated");
                });
            }
            else
            {
                console.error("coudnt find data");
            }   
        } 
        catch(parseErr)
        {
            console.log('error - ' , parseErr);
        }
    });
}


function edittasktext({ filePath, property, value, itemName })
{
    console.log(filePath, property, value, itemName);
    fs.readFile(filePath , "utf8" , (err , data) => {
        if(err)
        {
            console.error("error while reading");
            return;
        }

        try
        {
            const jsonData = JSON.parse(data);
            const toupdate = jsonData.find((item) => item['tasktext'] === itemName);
            console.log(toupdate);
            if(toupdate) 
            {
                if (property === 'tasktext') {
                    toupdate['tasktext'] = value;
                }
                const updateddata = JSON.stringify(jsonData ,null ,2);

                fs.writeFile(filePath , updateddata , 'utf8' , (err) => {
                    if(err)
                    {
                        console.log("error while writing");
                        return;
                    }
                    console.log("data updated");
                });
            }
            else
            {
                console.error("coudnt find data");
            }   
        } 
        catch(parseErr)
        {
            console.log('error - ' , parseErr);
        }
    });
}

const usersFile = './user.json';

function savecred({username , password} , callback)
{
    fs.readFile(usersFile, 'utf8', (err, data) => {
        if (err) {
            callback(err);
            return;
        //   console.log("error error error");
        }
    
        const usersData = JSON.parse(data);
        const userExists = usersData.find(u => u.username === username);
    
        if (userExists) {
            callback(new Error('User already exists'));
            return;
        }

        usersData.push({ username, password });
    
        fs.writeFile(usersFile, JSON.stringify(usersData, null, 2), err => {
          if (err) {
            callback(err);
            return;
          }
    
          callback(null);
        });
    });
}

function checkcred({username , password} , callback)
{
    fs.readFile(usersFile, 'utf8', (err, data) => {
        if (err) {
        //   console.log("error error error");
        callback(err);
        return;
        }
    
        const usersData = JSON.parse(data);
        const user = usersData.find(u => u.username === username && u.password === password);
    
        if (user) {
        //   console.log("login succesfull");
        callback(null, true);
        } else {
        //   console.log("invalid credentials");
        callback(null, false);
        }
    });
}

module.exports.readtask = readtask;
module.exports.edittasktext = edittasktext;
module.exports.savecred = savecred;
module.exports.checkcred = checkcred;
module.exports.edittask = edittask;
module.exports.savetask = savetask;
module.exports.deletetask = deletetask;