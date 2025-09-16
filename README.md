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

```sh
GET: /notes/
```
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
