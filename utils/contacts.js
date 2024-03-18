const fs = require('fs');
const { connect } = require('http2');

const dirPath = './data';
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath)
}

const dataPath = './data/contacts.json';
if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, '[]', 'utf-8')
}

// ambil semua data du contact.json
const loadContact = () => {
    const fileBuffer = fs.readFileSync('data/contacts.json', 'utf-8')
    const contacts = JSON.parse(fileBuffer);
    return contacts
}

const findContact = (nama) => {
    const contacts = loadContact();
    const contact = contacts.find((contact) => contact.nama.toLowerCase() === nama.toLowerCase())
    return contact
}

const saveContacts = (contacts) => {
    fs.writeFileSync('data/contacts.json', JSON.stringify(contacts))
}

const addContact = (contact) => {
    const contacts = loadContact()
    contacts.push(contact)
    saveContacts(contacts)
}

const cekDuplikat = (nama) => {
    const contacts = loadContact()
    return contacts.find((contact) => contact.nama === nama)
}

const deleteContact = nama => {
    const contacts = loadContact()
    const filteredContacts = contacts.filter((contact) => contact.nama !== nama)
    // console.log(filteredContacts)
    saveContacts(filteredContacts)
}

const updateContacts = (contactBaru) => {
    const contacts = loadContact()
    const filteredContacts = contacts.filter((contact) => contact.nama !== contactBaru.oldNama)
    delete contactBaru.oldNama;
    filteredContacts.push(contactBaru)
    saveContacts(filteredContacts)
}

module.exports = { 
    loadContact, 
    findContact, 
    addContact,
    cekDuplikat,
    deleteContact,
    updateContacts,
    }