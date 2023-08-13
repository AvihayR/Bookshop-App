'use strict'
const STORAGE_KEY = 'booksDB'
var gBooks
var gFilterBy = { name: '', rate: 0 }
const PAGE_SIZE = 4
var gPageIdx = 0
var gCountBooksShown

_createBooks()

function getBooks() {
    var books = gBooks.filter(book =>
        book.name.toLowerCase().includes(gFilterBy.name.toLowerCase()) &&
        book.rate >= gFilterBy.rate)

    gCountBooksShown = books.length

    var startIdx = gPageIdx * PAGE_SIZE
    books = books.slice(startIdx, startIdx + PAGE_SIZE)
    return books
}

function _createBooks() {
    gBooks = loadFromStorage(STORAGE_KEY)

    if (!gBooks || !gBooks.length) {
        gBooks = [
            _createBook('Pooh the bear', 50, 'pooh.png', 5),
            _createBook('Elemental', 75, 'elemental.png'),
            _createBook('History of Graphic Design', 175, 'graphic.png', 3),
            _createBook('Harry Potter', 200, 'harry_potter.jpeg'),
            _createBook('How To Sketch', 22, 'how_to_sketch.jpg', 1),
            _createBook('Animals 101', 12, '101_animals.jpg')
        ]
        _saveBooksToStorage()
    }
}

function _createBook(name, price, imgUrl, rate = 0) {
    return {
        id: makeId(3),
        name,
        price,
        imgUrl,
        rate,
        desc: makeLorem(5)
    }
}

function setBookFilter(filterBy = {}) {
    if (filterBy.name !== undefined) gFilterBy.name = filterBy.name
    if (filterBy.rate !== undefined) gFilterBy.rate = filterBy.rate
    // console.log(gFilterBy)
    return gFilterBy
}

function setBookSort(sortBy) {
    if (sortBy.name !== undefined) {
        gBooks.sort((book1, book2) => book1.name.localeCompare(book2.name) * sortBy.name)
    } else if (sortBy.price !== undefined) {
        gBooks.sort((book1, book2) => (book1.price - book2.price) * sortBy.price)
    }
}

function changeRate(bookId, diff) {
    const book = getBookById(bookId)
    const lastRate = book.rate
    book.rate += diff
    if (book.rate < 0 || book.rate > 10) book.rate = lastRate
    _saveBooksToStorage()
}

// function nextPage() {
//     if (isEndPage()) return
//     gPageIdx++
// }

// function prevPage() {
//     if (isStartPage()) return
//     gPageIdx--
// }

function changePage(diff) {
    gPageIdx += diff
    if (gPageIdx < 0) gPageIdx = 0
    else if ((gPageIdx * PAGE_SIZE) >= gCountBooksShown) gPageIdx--
}

function isStartPage() {
    return (gPageIdx === 0)
}

function isEndPage() {
    return ((gPageIdx + 1) * PAGE_SIZE) >= gCountBooksShown
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
    gBooks.unshift(book)
    _saveBooksToStorage()
}

function removeBook(bookId) {
    var bookIndex = gBooks.findIndex(book => book.id === bookId)
    gBooks.splice(bookIndex, 1)
    _saveBooksToStorage()
}

function getBooksCountByPriceMap() {
    const BooksCountByRateMap = gBooks.reduce((map, book) => {
        if (book.price < 20) map.cheap++
        else if (book.price < 50) map.normal++
        else map.expensive++
        return map
    }, { cheap: 0, normal: 0, expensive: 0 })
    return BooksCountByRateMap
}

function getPageIdx() {
    return gPageIdx
}

function getFavLayout() {
    return loadFromStorage('favLayout') || 'table'
}

function saveLayoutToStorage() {
    saveToStorage('favLayout', gLayout)
}

function _saveBooksToStorage() {
    saveToStorage(STORAGE_KEY, gBooks)
}