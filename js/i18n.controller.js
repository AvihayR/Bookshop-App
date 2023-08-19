function doTrans() {
    const elAllTrans = document.querySelectorAll('[data-trans]')

    elAllTrans.forEach(el => {
        if (el.placeholder) el.placeholder = getTrans(el.dataset.trans)
        else el.textContent = getTrans(el.dataset.trans)
    })

}

function onSetLang(lang) {
    if (lang === 'he') document.body.classList.add('rtl')
    else document.body.classList.remove('rtl')
    setLang(lang)
    doTrans()
    setQueryParams()
}