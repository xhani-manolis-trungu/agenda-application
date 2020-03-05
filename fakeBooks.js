const faker = require('faker')

function Books() {
var Books = [];
for (var i = 0; i < 30; i++) {
    Book = {
        title: faker.lorem.words(),
        author: faker.name.findName(),
        isbn: faker.random.number(),
        price: faker.commerce.price()
    }
    Books.push(Book);
}
return Books
}

module.exports = Books;