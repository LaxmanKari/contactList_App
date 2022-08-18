const express = require('express'); 
const path = require('path');
const port = 8000; 

const db = require('./config/mongoose');
const Contact = require('./models/contact'); 


const app = express(); 

// for parsing data coming from browser and append
// to oue contactList array 
const bodyParser= require('body-parser');
const exp = require('constants');
app.use(bodyParser.urlencoded({extended: false}));

// For Middlerware practice 
// app.use(express.urlencoded()); 
// //Middleware 1 
// app.use(function(req,res,next){
//   console.log('Middleware 1 is called'); 
//   next();
// }); 

// //Middleware 2 
// app.use(function(req,res,next){
//     console.log('Middleware 2 is called'); 
//     next();
//   }); 

app.set('view engine','ejs'); 
app.set('views',path.join(__dirname,'views'));
app.use(express.static('assests'));
var contactList =[
    {
       name:"Kari" ,
       phone:"1234567809"
    }, 
    { 
       name:"Laxman", 
       phone:"1234561232"
    }, 
    {
       name:"lakki", 
       phone:"98675644"
    }
]

//get routee controller 
// app.get('/', function(req,res){
//      return res.render('home',{title:"My Contact List",contact_list:contactList}); 
// });

//Fetching data from database
app.get('/', function(req,res){

    Contact.find({}, function(err, contacts){
        if(err){
            console.log('error in fetching contacts from db'); 
            return;
        } 
        return res.render('home',{
            title: "Contact List", 
            contact_list: contacts
        });
    })
})

app.get('/practice', function(req,res){
    return res.render('practice',{title:"Play Ground"}); 
});

//post routee controller 
app.post('/create-contact', function(req,res){
     
    // this below two are for just storing in the variable which is in RAM
    // contactList.push(req.body);
    // return res.redirect('/');
    // return res.redirect('back'); returns to the same page


    // When using database to store permenantly 
    Contact.create({
        name: req.body.name, 
        phone: req.body.phone
    }, function(err, newContact){
        if(err){
            console.log('Error in creating a contact!');
            return;
        }

        console.log('*****', newContact); 
        return res.redirect('back');

    });
});

//managing delete 
app.get('/delete-contact/', function(req,res){
    // When we don't have a database 
    //  console.log(req.params); 
    //  let phone = req.params.phone; 

    //  let contactIndex = contactList.findIndex(contact => contact.phone == phone); 

    //  if(contactIndex !=-1){
    //     contactList.splice(contactIndex,1);
    //  }
    // return res.redirect('back');


    // when having a database we simply fetch the data from the database
    // and store it in a variable and run a loop and then pss it onto
    //the template or the view 
   
//   console.log(req.query); 

    let id = req.query.id; 
    console.log('entered in delect rout controller');
    console.log(id);
    // fidn the contact in he database using id and delete
    Contact.findOneAndDelete({_id : id}, function(err,docs){
        if(err){
            console.log('error in deleting an object from database'); 
            return; 
        }  
        else {
            console.log("deleted object:", docs)
        }
        return res.redirect('back'); 

    });
});

app.listen(port,function(err){
    if(err){
        console.log('Error in running the server',err);
    } 
    console.log('Yup! My Express Server is running on port : ',port);
})