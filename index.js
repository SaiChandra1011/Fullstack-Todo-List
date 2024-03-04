
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv";


env.config();

const app = express();
const port = 3000;
//express code to connect to the postgresql server
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "To-do list",
  password: process.env.DATABASE_PASSWORD,
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
let items = [];


app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM items ORDER BY id ASC");
    items = result.rows;
    console.log(result.rows);

    res.render("index.ejs", {
      listTitle: "To-do List",
      listItems: items,
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/add", async (req, res) => {
  //bodyParser newItem for inserting new item
  const item = req.body.newItem;
  try {
    await db.query("INSERT INTO items (title) VALUES ($1)", [item]); //query to insert the new data into 
    //the body parser newItem.
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/edit", async (req, res) => {
  //bodyParser updatedTemTile, updatedItemId to update the id and title in the data base
  const item = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;  
  try {
    await db.query("UPDATE items SET title = ($1) WHERE id = $2", [item, id]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/delete", async (req, res) => {
  //bodyParser deleteItemId for deleting the item 
  const id = req.body.deleteItemId;
  try {
    await db.query("DELETE FROM items WHERE id = $1", [id]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

