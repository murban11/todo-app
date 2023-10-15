"use strict"

let Todo = function(title, description, place, dueDate) {
    this.title = title;
    this.description = description;
    this.place = place;
    this.dueDate = dueDate;
}

let todoList = [];

let restoreTodoList = function() {
    try {
        $.ajax({
            url: BASE_URL,
            type: 'GET',
            headers: {
                'X-Master-Key': SECRET_KEY
            },
            success: (data) => {
                for (let r of data.record) {
                    todoList.push(new Todo(
                        r.title,
                        r.description,
                        r.place,
                        new Date(r.dueDate)
                    ));
                }
            },
            error: (err) => {
                console.log(err.responseJSON);
            }
        });
    } catch (error) {
        console.error(error);
        console.log(
            "Make sure there is a `key.js` file in the project's root "
            + "directory with the following content:\n"
            + "const BASE_URL = \"<BIN_URL>\";\n"
            + "const SECRET_KEY = \"<SECRET_KEY>\";\n"
        );
    }
}

let saveTodoList = function() {
    $.ajax({
        url: BASE_URL,
        type: 'PUT',
        headers: {
            'X-Master-Key': SECRET_KEY
        },
        contentType: 'application/json',
        data: JSON.stringify(todoList),
        success: (data) => {
            console.log(data);
        },
        error: (err) => {
            console.log(err.responseJSON);
        }
    });
}

let addTodo = function() {
    todoList.push(
        new Todo(
            document.getElementById("inputTitle").value,
            document.getElementById("inputDescription").value,
            document.getElementById("inputPlace").value,
            document.getElementById("inputDate").value
        )
    );

    saveTodoList();
}

let deleteTodo = function(index) {
    todoList.splice(index, 1);

    saveTodoList();
}

let updateTodoList = function() {
    let todoListDiv = document.getElementById("todoListView");

    while (todoListDiv.firstChild) {
        todoListDiv.removeChild(todoListDiv.firstChild);
    }

    let filterInput = document.getElementById("inputSearch");   
    for (let idx in todoList) {
        if (
            (filterInput.value == "")
                || (todoList[idx].title.includes(filterInput.value))
                || (todoList[idx].description.includes(filterInput.value))
        ) {
            let newElement = document.createElement("p");
            let newContent = document.createTextNode(todoList[idx].title
                + " " + todoList[idx].description);
            newElement.appendChild(newContent);
            todoListDiv.appendChild(newElement);

            let newDeleteButton = document.createElement("input");
            newDeleteButton.type = "button";
            newDeleteButton.value = "x";
            newDeleteButton.addEventListener("click", () => {
                deleteTodo(idx)
            });
            newElement.appendChild(newDeleteButton);
        }
    }
}

restoreTodoList();
updateTodoList();
setInterval(updateTodoList, 1000);
