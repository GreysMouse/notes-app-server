# notes-app-server

HTTP-server for [notes-app](https://github.com/GreysMouse/notes-app) application

## Setup

```sh
npm install
```

## Launch

```sh
node index.js
```

## Endpoints

### Get notes array

Request:

```sh
GET: /notes?page=1&search=aa&limit=20
```

```sh
page:      number      <optional>      default=""      pagination page number
search:    string      <optional>      default=""      search query
limit:     number      <optional>      default="30"    items per page
```

Response:

```sh
{
  "notes": [],
  "total": 0
}
```

```sh
notes:     array       default=""      notes list per page (if page query is defined, otherwise all notes)
total:     number      default=""      notes total count on all pages
```

total    number     total number of all notes on all pages


### Create note entity

```sh
POST: /notes/
```

```sh
body: multipart/form-data

  title:  string        <required>
  test:   string        <reqiured>
  image:  file | null   <reqiured>

```

### Update note entity

```sh
PATCH: /notes/:id
```

```sh
body: multipart/form-data

  title:  string        <optional>
  test:   string        <optional>
  image:  file | null   <optional>

```

### Delete note entity

```sh
DELETE: /notes/:id
```
