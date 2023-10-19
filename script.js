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
            $("#inputTitle").val(),
            $("#inputDescription").val(),
            $("#inputPlace").val(),
            $("#inputDate").val()
        )
    );

    saveTodoList();
}

let deleteTodo = function(index) {
    todoList.splice(index, 1);

    saveTodoList();
}

let updateTodoList = function() {
    let $todoListDiv = $("#todoListView");

    $todoListDiv.children().remove()

    let $table = $("<table>", {"class": "container"});

    let searchText = $("#inputSearch").val().toLowerCase();

    let $startDate = $("#startDate");
    let $endDate = $("#endDate");

    for (let idx in todoList) {
        if (
            (
                (searchText === "")
                || (todoList[idx].title.toLowerCase().includes(searchText))
                || (todoList[idx].description.toLowerCase().includes(searchText))
                || (todoList[idx].place.toLowerCase().includes(searchText))
            ) && (
                $startDate.val() === $startDate.prop("defaultValue")
                || todoList[idx].dueDate.getTime() >= $startDate.prop("valueAsDate").getTime()
            ) && (
                $endDate.val() === $endDate.prop("defaultValue")
                || todoList[idx].dueDate.getTime() <= $endDate.prop("valueAsDate").getTime()
            )
        ) {
            let $titleCell = $("<th>", {"class": "col text-center"});
            $titleCell.text(todoList[idx].title);

            let $descCell = $("<td>", {"class": "col text-center"});
            $descCell.text(todoList[idx].description);

            let $placeCell = $("<td>", {"class": "col text-center"});
            $placeCell.text(todoList[idx].place);

            let $dateCell = $("<td>", {"class": "col text-center"});
            let formattedDate = todoList[idx].dueDate.toLocaleString("pl-PL", {
                day: "numeric",
                month: "numeric",
                year: "numeric",
            });
            $dateCell.text(formattedDate);

            let $closeButtonCell = $("<td>", {"class": "col text-center"});
            let $closeButton = $("<td>", {"type": "button", "class": "btn btn-danger"});
            $closeButton.click("click", () => {
                deleteTodo(idx);
            });
            $closeButton.html('<span class="fa-solid fa-trash"></span>');
            $closeButtonCell.append($closeButton);

            let $row = $("<tr>", {"class": "row my-1"});
            $row.append($titleCell);
            $row.append($descCell);
            $row.append($placeCell);
            $row.append($dateCell);
            $row.append($closeButtonCell);

            $table.append($row);
        }
    }

    $todoListDiv.append($table);
}

restoreTodoList();
updateTodoList();
setInterval(updateTodoList, 1000);
