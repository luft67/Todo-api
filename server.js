var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var PORT = process.env.PORT || 3000;
// todos is the model. multiple todos item is a collection
var todos = [];
var todoNextId = 1;

// set up middleware
app.use(bodyParser.json());

app.get('/', function(req, res){
  res.send('Todo API Root');
});

// GET /todos
app.get('/todos', function(req, res) {
  res.json(todos);
});

// GET /todos/:id (:id represents variable that gets passed in)
app.get('/todos/:id', function(req, res){
  var todoId = parseInt(req.params.id, 10); //  params are a string unless we set to number using parseInt
  var matched;

  for(var i=0; i<todos.length; i++) {
    if(todos[i].id === todoId){
      matched = todos[i];
    }
  }

  if(matched){
    res.json(matched);
  } else {
    res.status(404).send();
  }
});

// POST /todos
app.post('/todos', function(req,res){
  var body = req.body;
  // add id field
  body.id = todoNextId++;
  // push body into array
  todos.push(body);

  res.json(body);
});


app.listen(PORT, function() {
  console.log('Express listening on ' + PORT + '...');
});
