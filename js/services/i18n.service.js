'use strict'

let gCurrLang = 'en'

const gTrans = {
    title: { en: 'The Bookshop📚', he: '📚ספרים – ניהול מלאי' },
    'sort-by': { en: 'Sort by', he: 'מיין לפי' },
    'sort-name': { en: 'Name', he: 'שם' },
    'sort-name-des': { en: 'Name Descending', he: 'שם מהסוף להתחלה' },
    'sort-low-price': { en: 'Lowest Price', he: 'מהזול ליקר' },
    'sort-high-price': { en: 'Highest Price', he: 'מהיקר לזול' },
    'filter-rate': { en: 'Min Rate:', he: 'דירוג מינימלי:' },
    'th-name': { en: 'Name:', he: 'שם' },
    'th-price': { en: 'Price', he: 'מחיר' },
    'th-actions': { en: 'Actions', he: 'פעולות' },
    'new-book': { en: 'Add a new book', he: 'הוסף ספר חדש' },
    'cheap-p': { en: 'Cheap:', he: 'זול:' },
    'average-p': { en: 'Average:', he: 'ממוצע:' },
    'expensive-p': { en: 'Expensive:', he: 'יקר:' },
    read: { en: 'Read', he: 'הצג' },
    delete: { en: 'Delete', he: 'מחק' },
    update: { en: 'Update', he: 'עדכון' },
    'search-book': { en: 'Search a book..', he: 'חפש ספר..' },
    lang: { en: 'Language', he: 'בחר שפה' },
    'trans-en': { en: 'English', he: 'אנגלית' },
    'trans-he': { en: 'Hebrew', he: 'עברית' },
    'book-preview': { en: 'Book Preview', he: 'תצוגת ספר' },
    rating: { en: 'Rating:', he: 'דירוג:' }
}

function getLang() {
    return gCurrLang
}

function setLang(lang) {
    gCurrLang = lang
}

function getTrans(transKey) {
    const transMap = gTrans[transKey]
    if (!transMap) return 'UNKNOWN'

    let transTxt = transMap[gCurrLang]
    if (!transTxt) transTxt = transMap.en

    return transTxt
}