'use strict'

var gLayout

function onInit() {
    _createBooks()
    renderFilterByQueryParams()
    renderBooks()
    renderBtnState()
}

function renderBooks() {
    var books = getBooks()
    const elGridCont = document.querySelector('.grid-container')
    const elTBody = document.querySelector('tbody.books')

    if (!books.length) {
        (gLayout === 'grid') ?
            elGridCont.innerHTML = `<span class="books-not-found"> No books found </span> ` :
            elTBody.innerHTML = `<span class="books-not-found"> No books found </span> `
        return
    }

    gLayout = getFavLayout()

    var strHtmls = getBooksHtmls(books)
    if (gLayout === 'grid') elGridCont.innerHTML = strHtmls.join('')
    else elTBody.innerHTML = strHtmls.join('')
    hideLastDisplay()
}


function getBooksHtmls(books) {
    var strHtmls = ''
    if (gLayout === 'grid') {
        strHtmls = books.map(book => `
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
    } else {
        strHtmls = books.map(book => `
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
    }
    return strHtmls
}

function onFilterBooks(ev) {
    ev.preventDefault()
    const elSearchBar = document.querySelector('input.search-bar')

    const filterBy = { name: elSearchBar.value }
    setBookFilter(filterBy)
    renderBooks()

    const queryParams = `?bookName=${filterBy.name}&rate=${filterBy.rate || null}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryParams

    window.history.pushState({ path: newUrl }, '', newUrl)
}

function renderBtnState() {
    const elPrevBtn = document.querySelector('button.prev')
    const elNextBtn = document.querySelector('button.next')

    if (!isStartPage() && !isEndPage()) {
        elPrevBtn.classList.remove('disabled')
        elNextBtn.classList.remove('disabled')
    }

    if (isStartPage()) {
        elPrevBtn.classList.add('disabled')
        elPrevBtn.disabled = true
        elNextBtn.classList.remove('disabled')
        elNextBtn.disabled = false
    } else if (isEndPage()) {
        elNextBtn.classList.add('disabled')
        elNextBtn.disabled = true
        elPrevBtn.classList.remove('disabled')
        elPrevBtn.disabled = false
    }
}

function onRaiseRating(bookId) {
    raiseRating(bookId)
    onRenderPreviewModal(bookId)
}

function onLowerRating(bookId) {
    lowerRating(bookId)
    onRenderPreviewModal(bookId)
}

function onNextPage() {
    nextPage()
    renderBooks()
    renderBtnState()
}

function onPrevPage() {
    prevPage()
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
        // rate: +queryParams.get('rate') || 0
    }

    if (!filterBy.name) return

    document.querySelector('.search-bar').value = filterBy.name
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
    const modal = document.querySelector('.book-preview')
    const book = getBookById(bookId)

    var strHtml = `
        <button onclick="onClosePreviewModal()" class="close">X</button>
        <h3>Book Preview</h3>
        <img src="img/${book.imgUrl}" class="book-img" alt="Photo of ${book.name}" onerror="this.src='img/book.png'">
        <h4 class="book-name">${book.name}</h4>
        <h5 class="book-price">${book.price}₪</h5>
        <h5 class="summary-caption">Summary:</h5>
        <p>${makeLorem(5)}</p>
    `
    modal.innerHTML = strHtml
    renderRating(bookId)
    modal.classList.add('open')

}

function renderRating(bookId) {
    const modal = document.querySelector('.book-preview')
    const book = getBookById(bookId)

    var strHtml = `
    <div class="rating-container">
    <h6>Rating:</h6>
    <button class="rate rate-down" onclick="onLowerRating('${bookId}')"><img src="img/next.png"></button>
    <span class="current-rating">${book.rate}</span>
    <button class="rate rate-up" onclick="onRaiseRating('${bookId}')"><img src="img/prev.png"></button>
    </div>
    `
    modal.innerHTML += strHtml
}

function hideLastDisplay() {
    const elGridCont = document.querySelector('.grid-container')
    const elTBody = document.querySelector('tbody.books')
    const elTable = document.querySelector('table.bookshop')

    if (gLayout === 'grid') {
        elTable.classList.add('hidden')
        elGridCont.classList.remove('hidden')
    } else {
        elTable.classList.remove('hidden')
        elGridCont.classList.add('hidden')
    }
}

function onSetLayout(mode) {
    gLayout = mode
    saveLayoutToStorage()

    renderBooks()
}

function getFavLayout() {
    return loadFromStorage('favLayout') || 'table'
}

function saveLayoutToStorage() {
    saveToStorage('favLayout', gLayout)
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

//<img src="img/${book.imgUrl}.png" onerror="this.src='img/default.png'>