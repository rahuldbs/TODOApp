const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const eventData = require('./models/eventData');
const port = 3000;
const app = express();

mongoose.connect('mongodb://localhost:27017/admin')
  .then(() => {
    console.log('connection successful');
  })
  .catch(() => {
    console.log('connection failed !');
  })
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended":false}));

app.use((req,res,next) => {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers',
    "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, PUT, OPTIONS"
  );
  next();
})

app.post("/api/events",(req,res,next) => {
  const event = new eventData({
    title: req.body.title,
    description: req.body.description,
    day: req.body.day
  })
  event.save()
    .then(createdEvent => {
      res.status(201).json({
        "message": "Event added successfully",
        postId: createdEvent._id
      });
    })
    .catch((err)=>{console.log(err)});

});

app.get("/api/events/:id?",(req,res,next) => {
  let query = {};
  if(req.params.id){
    query._id = req.params.id;
  }
  eventData.find(query)
    .then(documents => {
      res.status(200).json(
        {
          "events": documents
        }
      );
    });

});

app.delete('/api/events/:id',(req,res,next) => {
  console.log(req.params.id);
  eventData.deleteOne({_id:req.params.id})
    .then((createdEvent) =>{
      console.log(createdEvent);
      if(createdEvent.deletedCount > 0)
      {
        res.status(200).json({message: "event deleted!"});
      }
      else{
        res.status(404).json({message: "no event found"});
      }
      
    });

});
app.put('/api/events/:id',(req,res,next) => {
  console.log(req.params.id);
  eventData.updateOne({_id:req.params.id},req.body)
    .then((createdEvent) =>{
      console.log(createdEvent);
      if(createdEvent.nModified > 0)
      {
        res.status(200).json({message: "event updated!"});
      }
      else{
        res.status(404).json({message: "no event found"});
      }
      
    });

});

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
