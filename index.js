const Joi = require('joi'); // Return a class, build errors for the client
require('dotenv').config() // to access .env file with environment variable
const express = require('express'); //import library


const app = express(); // initiate an app

app.use(express.json());

const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'}
];

app.get('/', (req, res) => { // app.get, app.put. app.post...

    res.send("hello world");   

});

app.get('/api/courses', (req, res) => {

    res.send(courses);

});

// /api/courses/1
app.get('/api/courses/:id', (req, res) => { // :id is a parameter

    const course = courses.find(c => c.id === parseInt(req.params.id));

    if(!course) res.status(404).send("The course with the given ID was not found.");
    res.send(course);

}); 

// query

app.get('/api/posts/:year/:month', (req, res) => {

    res.send(req.query)
});

// POST
app.post('/api/courses', (req, res) => {

    // define a schema
    const { error } = validateCourse(req.body); // result.error
    if (error){
        res.status(400).send(error.details[0].message);
        return;
    }

    // if (!req.body.name || req.body.name.length < 3) {
        // 400 Bad Request
        // res.status(400).send('Name is required and should be minimum 3 characters');
        // return;
    // }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    
    courses.push(course);
    res.send(course);

});

//PUT
app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) res.status(404).send("The course with the given ID was not found.");
    
    const { error } = validateCourse(req.body); // result.error
    if (error){
        res.status(400).send(error.details[0].message);
        return;
    }
    
    course.name = req.body.name;
    res.send(course)
    
    // // Return the updated course
    // res.send(course);

})

app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) {
        return res.status(404).send("The course with the given ID was not found.");
    }

    const index = courses.indexOf(course);
    // courses.splice(index, 1);
    res.send(index)
    // res.send(course);

})


function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });
    
    return schema.validate(course);
} 

// PORT
const port = process.env.PORT || 3000; // assign a PORT to the app
app.listen(port, () => console.log(`Listening on port ${port}...`)); // only a log

// to run the app, you need to go to the terminal and write "node index.js"
// you can install nodemon, with npm -i g nodemon, to sync in real time the changes
