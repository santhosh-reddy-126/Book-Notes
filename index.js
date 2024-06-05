import express, { raw } from "express";
import bodyParser from "body-parser";
import pg from "pg";
const app= express();
const port=3000;
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "Book_Notes",
    password: "santhosh",
    port: 5432,
});
db.connect();
let book_list=[]
app.get("/",async(req,res)=>{
    const result= await db.query("select * from books JOIN rating on book_id=books.id");
    book_list=[]
    result.rows.forEach((r)=>{
        const newItem = {
            id: r.book_id,
            isbn: r.isbn,
            rating: r.rating,
            notes: r.notes,
            date: r.date_of_read,
            link: `https://covers.openlibrary.org/b/isbn/${r.isbn}-L.jpg`
        }
        console.log(newItem.link);
        book_list.push(newItem);
        app.get("/full"+r.book_id,(req,res)=>{
            res.render("open.ejs",{link: `https://covers.openlibrary.org/b/isbn/${r.isbn}-L.jpg`,date: r.date_of_read,notes: r.notes,rating: r.rating});
        })
    })
    res.render("index.ejs",{books: book_list});
});

app.post("/editNotes", async(req,res)=>{
    const ID = req.body["Id"];
    const newNotes=req.body["new"];
    const result = await db.query(`update rating set notes='${newNotes}' where book_id='${ID}'`);
    console.log(`update rating set notes=${newNotes} where book_id=${ID}`);
    book_list=[]
    const result2= await db.query("select * from books JOIN rating on book_id=books.id");
    console.log("Here: "+ID+" "+newNotes);
    result2.rows.forEach((r)=>{
        const newItem = {
            id: r.book_id,
            isbn: r.isbn,
            rating: r.rating,
            notes: r.notes,
            date: r.date_of_read,
            link: `https://covers.openlibrary.org/b/isbn/${r.isbn}-L.jpg`
        }
        console.log(newItem.link);
        book_list.push(newItem);
        
    })
    res.render("index.ejs",{books: book_list});
})
app.post("/add",(req,res)=>{
    res.render("add.ejs")
});

app.post("/new", async (req,res)=>{
    const d = req.body["date"];
    const r = req.body["rate"];
    const n = req.body["note"];
    const i = req.body["isbn"];
    const result = await db.query(`insert into books(isbn) values('${i}')`);
    const result21 = await db.query(`select id from books where isbn='${i}'`);
    const result3 = await db.query(`insert into rating(rating,notes,date_of_read,book_id) values('${r}','${n}',to_date('${d}','yyyy-mm-dd'),${result21.rows[0].id})`);
    book_list=[]
    const result2= await db.query("select * from books JOIN rating on book_id=books.id");
    result2.rows.forEach((r)=>{
        const newItem = {
            id: r.book_id,
            isbn: r.isbn,
            rating: r.rating,
            notes: r.notes,
            date: r.date_of_read,
            link: `https://covers.openlibrary.org/b/isbn/${r.isbn}-L.jpg`
        }
        console.log(newItem.link);
        book_list.push(newItem);
        
    })
    res.render("index.ejs",{books: book_list});
})
app.post("/title",async(req,res)=>{
    const result= await db.query("select * from books JOIN rating on book_id=books.id order by notes asc");
    book_list=[]
    result.rows.forEach((r)=>{
        const newItem = {
            id: r.book_id,
            isbn: r.isbn,
            rating: r.rating,
            notes: r.notes,
            date: r.date_of_read,
            link: `https://covers.openlibrary.org/b/isbn/${r.isbn}-L.jpg`
        }
        console.log(newItem.link);
        book_list.push(newItem);
        app.get("/full"+r.book_id,(req,res)=>{
            res.render("open.ejs",{link: `https://covers.openlibrary.org/b/isbn/${r.isbn}-L.jpg`,date: r.date_of_read,notes: r.notes,rating: r.rating});
        })
    })
    res.render("index.ejs",{books: book_list});
});

app.post("/date",async(req,res)=>{
    const result= await db.query("select * from books JOIN rating on book_id=books.id order by date_of_read desc");
    book_list=[]
    result.rows.forEach((r)=>{
        const newItem = {
            id: r.book_id,
            isbn: r.isbn,
            rating: r.rating,
            notes: r.notes,
            date: r.date_of_read,
            link: `https://covers.openlibrary.org/b/isbn/${r.isbn}-L.jpg`
        }
        console.log(newItem.link);
        book_list.push(newItem);
        app.get("/full"+r.book_id,(req,res)=>{
            res.render("open.ejs",{link: `https://covers.openlibrary.org/b/isbn/${r.isbn}-L.jpg`,date: r.date_of_read,notes: r.notes,rating: r.rating});
        })
    })
    res.render("index.ejs",{books: book_list});
});
app.post("/rating",async(req,res)=>{
    const result= await db.query("select * from books JOIN rating on book_id=books.id order by rating desc");
    book_list=[]
    result.rows.forEach((r)=>{
        const newItem = {
            id: r.book_id,
            isbn: r.isbn,
            rating: r.rating,
            notes: r.notes,
            date: r.date_of_read,
            link: `https://covers.openlibrary.org/b/isbn/${r.isbn}-L.jpg`
        }
        console.log(newItem.link);
        book_list.push(newItem);
        app.get("/full"+r.book_id,(req,res)=>{
            res.render("open.ejs",{link: `https://covers.openlibrary.org/b/isbn/${r.isbn}-L.jpg`,date: r.date_of_read,notes: r.notes,rating: r.rating});
        })
    })
    res.render("index.ejs",{books: book_list});
});
app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
})