'use strict'

var gLayout

function onInit() {
    renderFilterByQueryParams()
    renderBooks()
    renderBtnState()
}

function renderBooks() {
    var books = getBooks()
    gLayout = getFavLayout()
    gLayout === 'grid' ? renderGrid(books) : renderTable(books)

    document.querySelector('.page-idx').innerText = getPageIdx() + 1
    BooksMapCategory()
}


function renderGrid(books) {
    const elGridCont = document.querySelector('.grid-container')
    const elTable = document.querySelector('table.bookshop')
    if (!books.length) {
        elGridCont.innerHTML = `<span class="books-not-found"> No books found </span> `
    } else {
        var strHtmls = books.map(book => `
        <div class="card">
        <h4>${book.name}</h4>
        <img src="img/${book.imgUrl}" class="book-img" alt="Photo of ${book.name}" onerror="this.src='img/book.png'">
        <h5>${book.price}₪</h2>
        <nav class="button-nav">
        <button onclick="onRenderPreviewModal('${book.id}', event)"><img src="img/eyes.png" alt="Open book details"></button>
        <button onclick="onRemoveBook('${book.id}', event)"><img src="img/trash.png" alt="Remove book"></button>
        <button onclick="onUpdateBook('${book.id}', event)"><img src="img/edit.png" alt="Edit book"></button>
        </nav>
        </div>
        `)

        elGridCont.innerHTML = strHtmls.join('')

    }
    elTable.classList.add('hidden')
    elGridCont.classList.remove('hidden')
}


function renderTable(books) {
    const elTBody = document.querySelector('tbody.books')
    const elGridCont = document.querySelector('.grid-container')
    const elTable = document.querySelector('table.bookshop')
    if (!books.length) {
        elTBody.innerHTML = `<span class="books-not-found"> No books found </span> `
    } else {
        var strHtmls = books.map(book => `
        <tr>
        <td>${book.id}</td>
        <td>${book.name}</td>
        <td>${book.price}</td>

        <td>
        <button onclick="onRenderPreviewModal('${book.id}', event)" class="read">Read</button>
        <button onclick="onRemoveBook('${book.id}', event)" class="delete">Delete</button>
        <button onclick="onUpdateBook('${book.id}', event)" class="update">Update</button>

        </td>
        </tr>
        `)
        elTBody.innerHTML = strHtmls.join('')
    }
    elTable.classList.remove('hidden')
    elGridCont.classList.add('hidden')
}

function BooksMapCategory() {
    const bookPriceCountMap = getBooksCountByPriceMap()
    const elBookMapCount = document.querySelector('.books-map-count')
    var strBookMapCount =
        `<p> Cheap: ${bookPriceCountMap.cheap}</p>
    <p> Normal: ${bookPriceCountMap.normal}</p>
    <p> Expensive: ${bookPriceCountMap.expensive}</p>`
    elBookMapCount.innerHTML = strBookMapCount
}

function onFilterBooks(filterBy) {
    setBookFilter(filterBy)
    renderBooks()
    renderBtnState()
    const queryParams = `?bookName=${filterBy.name || ''}&rate=${filterBy.rate || 0}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryParams

    window.history.pushState({ path: newUrl }, '', newUrl)
}

function renderBtnState() {
    const elPrevBtn = document.querySelector('button.prev')
    const elNextBtn = document.querySelector('button.next')

    elNextBtn.disabled = isEndPage()
    elPrevBtn.disabled = isStartPage()

    if (isStartPage()) elPrevBtn.classList.add('disabled')
    else elPrevBtn.classList.remove('disabled')

    if (isEndPage()) elNextBtn.classList.add('disabled')
    else elNextBtn.classList.remove('disabled')
}

/// DONE: create 1 function
// function onNextPage() {
//     nextPage()
//     renderBooks()
//     renderBtnState()
// }

// function onPrevPage() {
//     prevPage()
//     renderBooks()
//     renderBtnState()
// }

function onChangePage(diff) {
    changePage(diff)
    renderBooks()
    renderBtnState()
}

function onSetSortBy(ev, sortMethod, isDesc = false) {
    ev.stopPropagation()
    const sortBy = {}
    sortBy[sortMethod] = (isDesc) ? -1 : 1
    // console.log(sortBy)
    setBookSort(sortBy)
    onToggleDropDown()
    renderBooks()
}

function renderFilterByQueryParams() {
    const queryParams = new URLSearchParams(window.location.search)
    const filterBy = {
        name: queryParams.get('bookName') || '',
        rate: +queryParams.get('rate') || 0
    }

    if (!filterBy.name && !filterBy.rate) return

    document.querySelector('.search-bar').value = filterBy.name
    document.querySelector('.filter-rate-range').value = filterBy.rate

    setBookFilter(filterBy)
}

function onAddBook() {
    const bookName = prompt('Enter book\'s name: ')
    const bookPrice = prompt('Enter book\'s price: ')
    if (!bookName || !bookPrice) return

    addBook(bookName, bookPrice)
    renderBooks()
}

function onRemoveBook(bookId) {
    removeBook(bookId)
    renderBooks()
    flashMsg(`Book removed successfully (ID:${bookId})`)
}

function onUpdateBook(bookId) {
    const book = getBookById(bookId)
    const newPrice = +prompt('Enter a new price:', book.price)
    if (!newPrice || isNaN(newPrice)) return
    updateBook(bookId, newPrice)
    renderBooks()
    flashMsg(`Book updated successfully (ID:${bookId})`)
}

function onClosePreviewModal() {
    const modal = document.querySelector('.book-preview')
    modal.classList.remove('open')

}

function onRenderPreviewModal(bookId) {
    const elModal = document.querySelector('.book-preview')
    const book = getBookById(bookId)

    var strHtml = `
        <button onclick="onClosePreviewModal()" class="close">X</button>
        <h3>Book Preview</h3>
        <img src="img/${book.imgUrl}" class="book-img" alt="Photo of ${book.name}" onerror="this.src='img/book.png'">
        <h4 class="book-name">${book.name}</h4>
        <h5 class="book-price">${book.price}₪</h5>
        <h5 class="summary-caption">Summary:</h5>
        <p>${book.desc}</p>

        <div class="rating-container">
        <h6>Rating:</h6>
        <button class="rate rate-down" onclick="onChangeRate('${bookId}', -1)"><img src="img/next.png"></button>
        <span class="current-rating">${book.rate}</span>
        <button class="rate rate-up" onclick="onChangeRate('${bookId}', 1)"><img src="img/prev.png"></button>
        </div>
    `
    elModal.innerHTML = strHtml
    elModal.classList.add('open')

}

function onChangeRate(bookId, diff) {
    changeRate(bookId, diff)
    onRenderPreviewModal(bookId)
}

function onSetLayout(mode) {
    gLayout = mode
    saveLayoutToStorage()

    renderBooks()
}

function onToggleDropDown() {
    const elMenu = document.querySelector('.dropdown-menu')
    elMenu.classList.toggle('open')
}

function flashMsg(msg) {
    const elMsg = document.querySelector('.user-msg')
    elMsg.innerText = msg
    elMsg.classList.add('open')
    setTimeout(() => elMsg.classList.remove('open'), 3000)
}

