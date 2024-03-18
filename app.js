const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const morgan = require("morgan");
const { 
  loadContact, 
  findContact, 
  addContact, 
  cekDuplikat,
  deleteContact,
  updateContacts,
      } = require("./utils/contacts");
const { 
  body, 
  validationResult, 
  check, 
      } = require('express-validator');
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const c = require('ansi-colors');
const app = express();
const port = 3000;

// gunakan ejs
app.set("view engine", "ejs");
// ejs selesai

app.use(expressLayouts);

app.use(morgan("dev"));
// built-in middlewere
app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser('secret'))
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: 'secret',
    reseve: true,
    saveUninitialized: true,
  })
)
app.use(flash())

app.use((req, res, next) => {
  console.log("TIme: ", Date.now());
  next();
});

app.get("/", (req, res) => {
  // res.send('Helloo World!')
  // res.sendFile('./index.html',{ root: __dirname})
  const siswa = [
    {
      nama: "firman",
      email: "firmandwi@gmail.com",
    },
    {
      nama: "liana",
      email: "lianasf@gmail.com",
    },
    {
      nama: "rehan",
      email: "rehannndwi@gmail.com",
    },
  ];
  res.render("index", {
    layout: "layouts/main-layout",
    nama: "FIRMAN DWI",
    title: "halaman home",
    siswa,
  });
});

app.get("/about", (req, res) => {
  // res.send('Ini halaman about')
  // res.sendFile('./about.html',{ root: __dirname})
  res.render("about", {
    layout: "layouts/main-layout",
    title: "halaman about",
  });
});

app.get("/contact", (req, res) => {
  // res.send('Ini halaman contact')
  // res.sendFile('./contact.html',{ root: __dirname})
  const contacts = loadContact();

  res.render("contact", {
    layout: "layouts/main-layout",
    title: "halaman content",
    contacts,
    msg: req.flash('msg'),
  });
});

app.get("/contact/add", (req, res) => {
  res.render("add-contact", {
    title: "halaman tamban data contact",
    layout: "layouts/main-layout",
  });
});

app.post('/contact', [
  body('nama').custom((value) => {
    const duplikat = cekDuplikat(value);
    if (duplikat) {
      throw new Error('nama contact sudah digunakan!')
    }
    return true
  }),
  check('email', 'Email tidak valid').isEmail(),
  check('nohp', 'No HP tidak valid').isMobilePhone('id-ID'),
],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      //return res.status(400).json({ errors: errors.array()})
      res.render('add-contact', {
        title: 'Form tambah data contact',
        layout: "layouts/main-layout",
        errors: errors.array(),
      })
    } else {
      addContact(req.body);
      req.flash('msg', 'Data contact berhasil ditambahkan!')
      res.redirect("/contact");
    }
  });

app.get('/contact/delete/:nama', (req, res) => {
  const contact = findContact(req.params.nama)
  if (!contact) {
    res.status(404)
    res.send('<h1>404</h1>')
  } else {
      deleteContact(req.params.nama)
      req.flash('msg', 'Data contact berhasil berhasil dihapus!')
      res.redirect("/contact");
}
})

app.get("/contact/edit/:nama", (req, res) => {
  const contact = findContact(req.params.nama)
  res.render("edit-contact", {
    title: "halaman ubah data contact",
    layout: "layouts/main-layout",
    contact
  });
});

app.post('/contact/update', [
  body('nama').custom((value, { req }) => {
    const duplikat = cekDuplikat(value);
    if (value !== req.body.oldNama && duplikat) {
      throw new Error('Nama contact sudah digunakan!')
    }
    return true 
  }),
  check('email', 'Email tidak valid').isEmail(),
  check('nohp', 'No HP tidak valid').isMobilePhone('id-ID'),
],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      //return res.status(400).json({ errors: errors.array()})
      res.render('edit-contact', {
        title: 'Form ubah data contact',
        layout: "layouts/main-layout",
        errors: errors.array(),
        contact: req.body,
      })
    } else {
      updateContacts(req.body);
      req.flash('msg', 'Data contact berhasil diubah!')
      res.redirect("/contact");
    }
  });

app.get('/contact/:nama', (req, res) => {
  const contact = findContact(req.params.nama);
  res.render("detail", {
    title: "halaman detail content",
    layout: "layouts/main-layout",
    contact,
  });
});

// app.get('/product/:id' (req,res) => {
//  res.send(`Product ID : ${req.params.id} <br> Category : ${req.query.category}`)
// })

app.use("/", (req, res) => {
  res.status(404);
  res.send("<h1>404</h1>");
});

app.listen(port, () => {
  console.log(c.bold.bgGreen(`Example app listening on port ${port}`));
});
