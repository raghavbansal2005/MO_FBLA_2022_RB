const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');


const Attraction = require("./models/attraction");

const dbUrl = process.env.DB_URL
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => { 
  console.log('Connected to the DB Successfuly!');
}).catch(err => {
  console.log('ERROR: ', err.message);
});


const app = express();
const path  = require("path");
const attraction = require("./models/attraction");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, 'views'));


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
	console.log("redirect");
	res.redirect('/home');
})

app.get("/attraction", async(req, res) => {
	const attraction =  new Attraction({name: "capital", price : 0, description: "Our Cities Goverment Building With Tours Available", distance: 5, busy: "Moderate", rateAvg: 4.7, phone: "+1 (888) 523-2345"})
	await attraction.save();
	res.send(attraction);
})

app.get("/home", (req, res) => {
	res.render("home");
})

app.get("/attractions/:minprice/:maxprice/:minrate/:maxrate/:parking/:mindistance/:maxdistance/:busyone/:busytwo/:busythree", (req, res) => {
	Attraction.find((err, docs) => {
        if (!err) {
            let send_data_price_and_rating_anddistance = []
            const minP = parseInt(req.params["minprice"]);
            const maxP = parseInt(req.params["maxprice"]);
            const minR = parseFloat(req.params["minrate"]);
            const maxR = parseFloat(req.params["maxrate"]);
            const park = req.params["parking"];
            const minD = parseInt(req.params["mindistance"]);
            const maxD = parseInt(req.params["maxdistance"]);
            const b1 = req.params["busyone"]
            const b2 = req.params["busytwo"]
            const b3 = req.params["busythree"]
            docs.forEach(element => {
              if(element["price"] <= maxP && element["price"] >= minP){
                if(element["rateAvg"] <= maxR && element["rateAvg"] >= minR){
                  if(element["distance"] <= maxD && element["distance"] >= minD){
                    send_data_price_and_rating_anddistance.push(element);
                  }
                }
              }
            });
            let send_data_parking = []
            send_data_price_and_rating_anddistance.forEach(element => {
              if(park == "true"){
                if(element["parking"] = true){
                  send_data_parking.push(element);
                }
              } else {
                send_data_parking.push(element);
              }
            });
            let final_send_data = []
            if(b1 == "true"){
              send_data_parking.forEach(element => {
                if(element["busy"] == "Light"){
                  final_send_data.push(element);
                }
              });
            }
            if(b2 == "true"){
              send_data_parking.forEach(element => {
                if(element["busy"] == "Moderate"){
                  final_send_data.push(element);
                }
              });
            }
            if(b3 == "true"){
              send_data_parking.forEach(element => {
                if(element["busy"] == "Busy"){
                  final_send_data.push(element);
                }
              });
            }
            res.render("attractions", {
                data: final_send_data, att: [minP,maxP,minR,maxR,park,minD,maxD,b1,b2,b3]
            });
        } else {
          res.render("/")
            console.log('Failed to retrieve the Course List: ' + err);
        }
    });
})

app.post("/reload", (req,res) => {
  console.log("IN HERE");
  console.log(`/attractions/${req.body.minPrice}/${req.body.maxPrice}/${req.body.minRate}/${req.body.maxRate}/${req.body.park}/${req.body.minDistance}/${req.body.maxDistance}/${req.body.b11}/${req.body.b22}/${req.body.b33}`);
  //res.redirect(`/attractions/${req.body.minPrice}/${req.body.maxPrice}/${req.body.minRate}/${req.body.maxRate}/${req.body.park}/${req.body.minDistance}/${req.body.maxDistance}/${req.body.b11}/${req.body.b22}/${req.body.b33}`);
})

app.get("/about", (req, res) => {
	res.render("about");
})


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})