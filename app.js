//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date=require( __dirname + "/date");


const items=["eat","sleep","repeat"];
const workItems=[];

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.set('strictQuery',false);
mongoose.connect("mongodb+srv://admin-anmol:admin123@cluster0.f12uqbt.mongodb.net/todolistDB");

const itemsSchema={
    name:String
};

const Item =mongoose.model('Item',itemsSchema);

const sleep= new Item({
    name:"sleep"
});

const bath = new Item ({

    name:"bath"
});

const college= new Item({
    name:"college"
});

const brush= new Item({
    name:"brush"
});

const defaultItem = [sleep,brush,bath,college];

const listSchema = {
    name:String,
    items: [itemsSchema]
};

const List = mongoose.model("List",listSchema);

// Item.insertMany(defaultItem,function(err){
//     if(err)
//         console.log(err);
//     else
//         console.log("successfully saved our default items in DB.");
// });

// Item.deleteMany({name:'bath'},function(err){
//     if(err)
//         console.log(err);
//     else
//         console.log("successfully deleted our default items in DB.");
// });



app.get("/",function(req,res){

    const day=date.getDay();

    Item.find(function(err,foundItems){
        if(foundItems.length===0){
            Item.insertMany(defaultItem,function(err){
                if(err)
                    console.log(err);
                else
                    console.log("successfully saved our default items in DB.");
            });
            res.redirect("/");
        }
        else{ 
            res.render("lists", {
                listTitle:day,
                newListItems:foundItems
            });
        } 
    })
});

app.post("/", function(req,res){
    const itemName = req.body.newItem;
    const listName = req.body.list;

    const newItem = new Item({
        name:itemName
    });

    if(listName==date.getDay()){
        newItem.save();
        res.redirect("/");
    }else{
        List.findOne({name:listName},function(err,foundList){
            foundList.items.push(newItem);
            foundList.save();
            res.redirect("/" + listName);
        });
    } 
});

app.post("/delete",function(req,res){
    const checkedId = req.body.checkbox;
    Item.findByIdAndRemove(checkedId,function(err){
        if(!err){
            res.redirect("/");
        }
    });
});

app.get("/:customListName",function(req,res){
    const customListName = req.params.customListName;

    List.findOne({name:customListName},function(err,foundList){
        if(!err){
            if(!foundList){
                // list not exists
                const list = new List ({
                    name: customListName,
                    items: defaultItem
                });
                list.save();
                res.redirect("/"+customListName);
            }else{
                //list exists
                res.render("lists",{listTitle:foundList.name, newListItems:foundList.items});
            }
        }
    })
})

app.listen(3000, function(){
    console.log("the server is running on port 3000.");
});