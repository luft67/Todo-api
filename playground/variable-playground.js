// var person = {
//   name: "david",
//   age: 48
// };
//
// function updatePerson(obj) {
//   // obj = {
//   //   name: "david",
//   //   age: 46
//   // }
//   obj.age = 46;
// }
//
// updatePerson(person);
// console.log(person);

// array
var grades = [15, 37];

function addGrades(grades) {
  // update
  grades.push(34);
  //grades[3] = 46;
  //grades = [12, 33, 99];
  debugger; // call node debug filename.js to debug a file.  Type "cont" to continue moving through the file. Type 'repl' to be able to modify code... example print out the grades array by typing 'grades'.  you can modify things... grades.push(2).  Hit ctrl + c to get out of edit mode, and type 'cont' to continue moving through file.  when done, type kill and to get all the way out, type quit.
}

addGrades(grades);
console.log(grades);

// basically with objects and arrays, you can pass them into a function, modify them and return them while not affecting the value of the original array (one of the reasons we have 'return').
