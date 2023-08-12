'use strict'
const STORAGE_KEY = 'booksDB'
var gBooks
var gFilterBy = { name: '', rate: 0 }
const PAGE_SIZE = 6
var gPageIdx = 0


function getBooks() {
    var books = gBooks.filter(book => book.name.toLowerCase().includes(gFilterBy.name.toLowerCase()))
    var startIdx = gPageIdx * PAGE_SIZE
    // console.log(startIdx, startIdx + PAGE_SIZE, gBooks.length)
    books = books.slice(startIdx, startIdx + PAGE_SIZE)
    return books
}

function _createBooks() {
    gBooks = loadFromStorage(STORAGE_KEY)

    if (!gBooks || !gBooks.length) {
        gBooks = [
            _createBook('Pooh the bear', 50, 'pooh.png'),
            _createBook('Elemental', 75, 'elemental.png'),
            _createBook('History of Graphic Design', 175, 'graphic.png'),
            _createBook('Tale of 5 Balloons', 45, 'balloons.png')
        ]
        _saveBooksToStorage()
    }
}

function _createBook(name, price, imgUrl) {
    return {
        id: makeId(3),
        name,
        price,
        imgUrl,
        rate: 0
    }
}

function setBookFilter(filterBy = {}) {
    if (filterBy.name !== undefined) gFilterBy.name = filterBy.name
    if (filterBy.rate !== undefined) gFilterBy.rate = filterBy.rate
    console.log(gFilterBy)
    return gFilterBy
}

function setBookSort(sortBy) {
    if (sortBy.name !== undefined) {
        gBooks.sort((book1, book2) => book1.name.localeCompare(book2.name) * sortBy.name)
    } else if (sortBy.price !== undefined) {
        gBooks.sort((book1, book2) => (book1.price - book2.price) * sortBy.price)
    }
}

function raiseRating(bookId) {
    const book = getBookById(bookId)
    if (book.rate >= 10) return
    book.rate++
    _saveBooksToStorage()
}

function lowerRating(bookId) {
    const book = getBookById(bookId)
    if (book.rate <= 0) return
    book.rate--
    _saveBooksToStorage()
}

function nextPage() {
    if (isEndPage()) return
    gPageIdx++
}

function prevPage() {
    if (isStartPage()) return
    gPageIdx--
}

function isStartPage() {
    return (gPageIdx === 0)
}

function isEndPage() {
    return (gPageIdx * PAGE_SIZE + PAGE_SIZE) >= gBooks.length
}

function getBookById(bookId) {
    return gBooks.find(book => book.id === bookId)
}

function updateBook(bookId, newPrice) {
    const book = gBooks.find(book => book.id === bookId)
    book.price = newPrice
    _saveBooksToStorage()
}

function addBook(name, price) {
    const book = _createBook(name, price, `${name}.png`)
    gBooks.push(book)
    _saveBooksToStorage()
}

function removeBook(bookId) {
    var bookIndex = gBooks.findIndex(book => book.id === bookId)
    gBooks.splice(bookIndex, 1)
    _saveBooksToStorage()
}

function _saveBooksToStorage() {
    saveToStorage(STORAGE_KEY, gBooks)
}