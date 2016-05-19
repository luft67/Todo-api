var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;
// todos is the model. multiple todos item is a collection
var todos = [];
var todoNextId = 1;

// ========== set up middleware

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Todo API Root');
});

// ========== GET /todos?completed=true&q=house

app.get('/todos', function (req, res) {
  var queryParams = req.query;
  var filteredTodos = todos;

  if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
    filteredTodos = _.where(filteredTodos, {completed: true});  // _.where grabs all items matching the above condition
  } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
    filteredTodos = _.where(filteredTodos, {completed: false});
  }

  // q prop needs to exist and have length > 0
  if(queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
    filteredTodos = _.filter(filteredTodos, function (todo) {
      return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
    });
  }

  res.json(filteredTodos);
});

// ========== GET /todos/:id (:id represents variable that gets passed in)

app.get('/todos/:id', function (req, res) {
  var todoId = parseInt(req.params.id, 10); //  params are a string unless we set to number using parseInt

  var matched = _.findWhere(todos, {id: todoId}); // _.findWhere grabs the first item that matches the id
  console.log(matched);

  if(matched){
    res.json(matched);
  } else {
    res.status(404).send();
  }
});

// ========== POST /todos

app.post('/todos', function (req, res) {
  var body = _.pick(req.body, 'description', 'completed');

  // call create on db.todo
  //  if successful
  // respond to api caller with 200 and todo (toJSON)
  // if fail
  // e res.status(400).json(e)

  db.todo.create(body).then(function(todo){
    res.json(todo.toJSON());
  }, function(e){
    res.status(400).json(e);
  });

  
  // if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
  //   return res.status(400).send();
  // }
  //
  // // update body.description to be the new trimmed value
  // body.description = body.description.trim();
  //
  // // add id field
  // body.id = todoNextId++;
  // // push body into array
  // todos.push(body);
  //
  // res.json(body);
});

// ========== DELETE /todos/:id

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

// ========== PUT /todos/:id

app.put('/todos/:id', function (req, res) {
  var todoId = parseInt(req.params.id, 10);
  var matched = _.findWhere(todos, {id: todoId});
  var body = _.pick(req.body, 'description', 'completed');
  var validAttributes = {};

  if (!matched) {
    return res.status(400).send();  // use return to stop program from running past this point
  }

  if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
    validAttributes.completed = body.completed;
  } else if (body.hasOwnProperty('completed')) {
    return res.status(400).send();
  }

  if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0){
    validAttributes.description = body.description;
  } else if (body.hasOwnProperty('description')) {
    return res.status(400).send();
  }

  //_.extend(destination, sources)
  _.extend(matched, validAttributes);
  res.json(matched);

});

db.sequelize.sync().then(function() {
  app.listen(PORT, function () {
    console.log('Express listening on ' + PORT + '...');
  });
});
