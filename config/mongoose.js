const mongoose = require('mongoose');

// let's connect with database 
mongoose.connect("mongodb+srv://UniquePrince:32323212@cluster0.sezsu7p.mongodb.net/?retryWrites=true&w=majority",{useNewUrlParser: true, // Enter Your DB URL
useUnifiedTopology: true,})
.then(() =>{
    console.log('Connected to the database');
}).catch((err) => {
    console.error('Error in connecting to the database ');
})