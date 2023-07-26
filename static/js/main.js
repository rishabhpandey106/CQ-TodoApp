const submitbtn = document.getElementById("addbtn");
const usertext = document.getElementById("inputtask");
const task = document.getElementById("tasklist");

submitbtn.addEventListener("click" , function () {
    const tasktext = usertext.value;

    if(!tasktext)
    {
        alert("Please Enter A Task..");
        return;
    }

    const todo = {
        tasktext,
        completed : false
    };

    fetch("/todo" , {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify(todo)
    }).then(function(response) {
        if(response.status == 200)
        {
            showtasks(todo);
            usertext.value = "";
        }
        else
        {
            alert("error error error");
        }
    })
});

function showtasks(todo)
{
    const tasknode = document.createElement("todoitems");
    tasknode.classList = 'todoitems';

    const tasktextnode = document.createElement("text")
    tasktextnode.classList = 'text';
    tasktextnode.innerText = todo.tasktext;

    const delnode = document.createElement("button");
    delnode.classList = 'deletebtn';
    delnode.innerText = 'DELETE';

    const checknode = document.createElement('input');
    checknode.type = 'checkbox';
    checknode.classList = 'checkbox';
    checknode.checked = false;

    if(todo.completed)
    {
        tasktextnode.style.textDecoration = "line-through";
        tasktextnode.style.color = "grey";
        checknode.checked = true;
    }

    tasknode.appendChild(tasktextnode);
    tasknode.appendChild(checknode);
    tasknode.appendChild(delnode);
    task.appendChild(tasknode);

    const edittext = document.querySelectorAll('.text');
    edittext.forEach(text => {
        text.addEventListener('dblclick' , editthetext);
    });

    const editcheckbox = document.querySelectorAll('.checkbox');
    editcheckbox.forEach(checkbox => {
        checkbox.addEventListener('change' , checkuncheck);
    });

    const delbtn = document.querySelectorAll('.deletebtn');
    delbtn.forEach(deletebtn => {
        deletebtn.addEventListener('click' , removetask);
    })
}


function checkuncheck(event)
{
    const checkbox = event.target;
    const parentDiv = checkbox.closest('.todoitems');
    const todo_itemelem = parentDiv.querySelector('.text');

    if(checkbox.checked)
    {
        todo_itemelem.style.textDecoration = 'line-through';
        todo_itemelem.style.color = 'grey';
        const data = {
            filePath: './task.json',
            property: 'completed',
            value: true,
            itemName :todo_itemelem.innerText
        };

        fetch('/edit-todo' , {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(data)
        }).then(function(response) {
            if(response.status === 200)
            {
                console.log("success");
            }
            else
            {
                alert("error error error");
            }
        });
    }
    else
    {
        todo_itemelem.style.textDecoration = 'none';
        todo_itemelem.style.color = 'grey';

        const data = {
            filePath: './task.json',
            property: 'completed',
            value: false,
            itemName :todo_itemelem.innerText
        };

        fetch('/edit-todo' , {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(data)
        }).then(function(response) {
            if(response.status === 200)
            {
                console.log("success");
            }
            else
            {
                alert("error error error");
            }
        });
    }
}

function removetask(event)
{
    const parentdiv = this.parentNode;
    parentdiv.remove();
    const todo_itemelem = parentdiv.querySelector('.text');
    const todo_item = todo_itemelem.innerText;
    console.log(todo_item);

    fetch('/delete-todo' , {
        method : "POST",
        headers : {
        "Content-Type": "application/json"
        },
        body : JSON.stringify({
            filePath : './task.json',
            property : 'tasktext',
            value : todo_item
        })
    }).then(function(response) {
        if(response.status === 200)
        {
            console.log("success");
        }
        else
        {
            alert("error error error");
        }
    });
}

function editthetext(event) {
    const taskTextElement = event.target;
    const currentTaskText = taskTextElement.innerText;
  
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.classList = 'edit-input';
    inputField.value = currentTaskText;
  
    const parentDiv = taskTextElement.closest('.todoitems');
    parentDiv.replaceChild(inputField, taskTextElement);
  
    inputField.addEventListener('keypress', function (event) {
        let isediting = true;
      if (event.key === 'Enter') {
        const updatedTaskText = inputField.value;
        const data = {
          filePath: './task.json',
          property: 'tasktext',
          value: updatedTaskText,
          itemName: currentTaskText
        };
  
        fetch('/edit-text-todo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        }).then(function (response) {
          if (response.status === 200) {
            return response.json();
          } else {
            alert('Error updating task text');
          }
        }).then(function(updateddata) {
            taskTextElement.innerText = updateddata.tasktext;
            // const checkbox = parentDiv.querySelector('.checkbox');
            // checkbox.checked = updateddata.completed;
            parentDiv.replaceChild(taskTextElement, inputField);
            isediting = false;
        });
      }
    });
  
    inputField.addEventListener('blur', function () {
      const updatedTaskText = inputField.value;
      const data = {
        filePath: './task.json',
        property: 'tasktext',
        value: updatedTaskText,
        itemName: currentTaskText
      };
  
      fetch('/edit-text-todo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }).then(function (response) {
        if (response.status === 200) {
          return response.json();
        } else {
          alert('Error updating task text');
        }
      }).then(function(updateddata) {
        taskTextElement.innerText = updateddata.tasktext;
        // const checkbox = parentDiv.querySelector('.checkbox');
        // checkbox.checked = updateddata.completed

        parentDiv.replaceChild(taskTextElement, inputField);
        isediting = false;
      });
    });
  
    inputField.focus();

    inputField.addEventListener('click', function (event) {
        event.stopPropagation();
        isEditing = true;
    });
    
    document.addEventListener('click', function () {
    if (isEditing) {
        // If the flag is true, disable the input field
        taskTextElement.innerText = updateddata.tasktext;
        parentDiv.replaceChild(taskTextElement, inputField);
        isEditing = false;
    }

    });
}

fetch('/todo-data').then(function(response) {
    if(response.status === 200)
    {
        return response.json();
    }
    else
    {
        alert("error error error");
    }
}).then(function(todos) {
    todos.forEach(function(todo) {
        showtasks(todo);
    })
})