# TODO-APP

A TODO web application written for a class project.

<p align="center">
    <img src="https://github.com/user-attachments/assets/563049a8-b812-4650-b923-bdd399914f69" />
</p>

## Usage

1. Create an account at https://jsonbin.io/
2. Create a bin with e.g. the following content (JSONBin forbids creation of empty bins):
    ```json
    [
      {
        "title": "foo",
        "description": "bar",
        "place": "baz",
        "dueDate": "1970-01-01"
      }
    ]
    ```
3. At the project's top directory, create a `key.js` file with the following content:
    ```js
    const BASE_URL = "https://api.jsonbin.io/v3/b/<bin-id>";
    const SECRET_KEY = "<x-master-key>";
    ```
    where `<bin-id>` is the ID of the bin that was created in step 2, and `<x-master-key>` is an API Key assigned to an account created in step 1.
4. Go to `file://<path-to-index-html>`, where `<path-to-index-html>` is the absolute path to the project's `index.html` file, e.g. `/home/user/dev/todo-app/index.html`. Alternatively, click on this file from within file explorer.

## LICENSE

[MIT](https://github.com/murban11/todo-app/blob/main/LICENSE)
