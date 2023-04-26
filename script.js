const leftList = document.getElementById('left-list')
const leftListTitle = document.getElementById('left-list-title')
const leftListItems = document.getElementById('left-list-items')
const leftForm = document.getElementById('left-list-form')
const leftInput = document.getElementById('left-list-input')
const leftButton = document.getElementById('left-list-button')
const rightList = document.getElementById('right-list')
const rightListTitle = document.getElementById('right-list-title')
const rightListItems = document.getElementById('right-list-items')
const rightForm = document.getElementById('right-list-form')
const rightInput = document.getElementById('right-list-input')
const rightButton = document.getElementById('right-list-button')

function addItem(e) {
    e.preventDefault()
    const newItem = e.target.querySelector('input').value
    console.log(`Create item with value ${newItem}`)
}

leftForm.addEventListener('submit', addItem)
rightForm.addEventListener('submit', addItem)
