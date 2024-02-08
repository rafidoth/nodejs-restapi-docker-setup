const express = require('express')
const app = express();

const sqlite3 = require('sqlite3').verbose();

app.use(express.json())
const db = new sqlite3.Database('./database.db',sqlite3.OPEN_READWRITE,(err)=>{
  if(err)  return console.log(err.message);
  console.log("Connected to the database");
});

db.run(`CREATE TABLE coordinates(
  x INT NOT NULL,
  y INT NOT NULL
);`,(err)=>{
  if(err) console.log(err);
  console.log("database created")
})


db.all(`SELECT * FROM coordinates;`, [], (err, rows)=>{
  if(err){
    return console.log(err);
  }
  rows.forEach(row=>{
    console.log(row);
  })
})


app.put('/p1', (req, res) => {
  console.log("request hit on /p1")
  const {x,y} = req.body;
  let data = null;
  db.all(`SELECT * FROM coordinates
  WHERE x=${x} AND y=${y};`,[],(err,rows)=>{
    if(err) return console.log(err);
    if(rows.length==0){
      db.run(`INSERT INTO coordinates(x,y) VALUES(?,?);`,[x,y],(err)=>{
        if(err) return console.log(err);
        console.log(`(${x},${y})coordinates added to db`);
      })
      res.status(201).send({"added": req.body});
    }else{
      res.status(200).send({"added": req.body});
    }
  })
});


app.get('/p2',(req,res)=>{
  console.log("request hit on /p2")
  let sumOfXs = 0;
  let sumOfYs = 0;
  db.all(`SELECT * FROM coordinates;`,[],(err,rows)=>{
    if(err) return console.log(err.message);
    if(rows.length>0){
      const quantity = rows.length;
      rows.forEach(row=>{
        sumOfXs+= row.x;
        sumOfYs+= row.y;
      })
      res.send({"avg":{"x":Math.floor(sumOfXs/quantity),"y":Math.floor(sumOfYs/quantity)}}).status(200)
    }else{
      res.status(200).send({"avg":{"x":0,"y":0}})
    }
  })
})
  
app.listen(5000, () => {
    console.log('Server running on port 5000');
  });
