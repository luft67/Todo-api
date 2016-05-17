var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
// todos is the model. multiple todos item is a collection
var todos = [];
var todoNextId = 1;

// set up middleware
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Todo API Root');
});

// GET /todos
app.get('/todos', function (req, res) {
  res.json(todos);
});

// GET /todos/:id (:id represents variable that gets passed in)
app.get('/todos/:id', function (req, res) {
  var todoId = parseInt(req.params.id, 10); //  params are a string unless we set to number using parseInt

  var matched = _.findWhere(todos, {id: todoId});
  console.log(matched);

  if(matched){
    res.json(matched);
  } else {
    res.status(404).send();
  }
});

// POST /todos
app.post('/todos', function (req, res) {
  var body = _.pick(req.body, 'description', 'completed');

  if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
    return res.status(400).send();
  }

  // update body.description to be the new trimmed value
  body.description = body.description.trim();

  // add id field
  body.id = todoNextId++;
  // push body into array
  todos.push(body);

  res.json(body);
});

// DELETE /todos/:id
app.delete('/todos/:id', function (req, res){
  var todoId = parseInt(req.params.id, 10);
  var matched = _.findWhere(todos, {id: todoId});

  if(matched) {
    var remains = _.without(todos, matched);
    res.json(remains);
  } else {
    res.status(404).json({"error" : "no todo found with that id"});
  }
});


app.listen(PORT, function () {
  console.log('Express listening on ' + PORT + '...');
});
