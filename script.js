// SET VARIABLES
const filter = document.getElementById('filter')
const filterInput = document.getElementById('filter-input')
const leftInput = document.getElementById('left-list-input')
const rightInput = document.getElementById('right-list-input')

let editMode = false

const closeIcon = `
<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <path d="M557.2 512l136.4-136.4c12.4-12.4 12.4-32.8 0-45.2-12.4-12.4-32.8-12.4-45.2 0L512 466.8l-136.4-136.4c-12.4-12.4-32.8-12.4-45.2 0-6.2 6.2-9.4 14.4-9.4 22.6 0 8.2 3.2 16.4 9.4 22.6l136.4 136.4-136.4 136.4c-6.2 6.2-9.4 14.4-9.4 22.6 0 8.2 3.2 16.4 9.4 22.6 12.4 12.4 32.8 12.4 45.2 0l136.4-136.4 136.4 136.4c12.4 12.4 32.8 12.4 45.2 0 12.4-12.4 12.4-32.8 0-45.2L557.2 512z"  />
</svg>
`
const editIcon = `
<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="20" height="20">
    <path d="M834.3 705.7c0 82.2-66.8 149-149 149H325.9c-82.2 0-149-66.8-149-149V346.4c0-82.2 66.8-149 149-149h129.8v-42.7H325.9c-105.7 0-191.7 86-191.7 191.7v359.3c0 105.7 86 191.7 191.7 191.7h359.3c105.7 0 191.7-86 191.7-191.7V575.9h-42.7v129.8z"  />
    <path d="M889.7 163.4c-22.9-22.9-53-34.4-83.1-34.4s-60.1 11.5-83.1 34.4L312 574.9c-16.9 16.9-27.9 38.8-31.2 62.5l-19 132.8c-1.6 11.4 7.3 21.3 18.4 21.3 0.9 0 1.8-0.1 2.7-0.2l132.8-19c23.7-3.4 45.6-14.3 62.5-31.2l411.5-411.5c45.9-45.9 45.9-120.3 0-166.2zM362 585.3L710.3 237 816 342.8 467.8 691.1 362 585.3zM409.7 730l-101.1 14.4L323 643.3c1.4-9.5 4.8-18.7 9.9-26.7L436.3 720c-8 5.2-17.1 8.7-26.6 10z m449.8-430.7l-13.3 13.3-105.7-105.8 13.3-13.3c14.1-14.1 32.9-21.9 52.9-21.9s38.8 7.8 52.9 21.9c29.1 29.2 29.1 76.7-0.1 105.8z"  />
</svg>
`
const checkIcon = `
<svg class="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
</svg>
`

// MAIN ACTIONS
function displayItems() {
    const itemsFromStorageLeft = getItemsFromStorage('left')
    const itemsFromStorageRight = getItemsFromStorage('right')
    itemsFromStorageLeft.forEach((item) => addItemToDOM(item, 'left'))
    itemsFromStorageRight.forEach((item) => addItemToDOM(item, 'right'))
}

function addItem(e) {
    e.preventDefault()

    if (!e.target.querySelector('input').value) {
        return
    }

    // if (editMode) {
    //     const itemToEdit = document.querySelector('.item-to-edit')
    //     if (itemToEdit) {
    //         remove(itemToEdit)
    //     }
    // }

    const context = e.target.attributes.id.value  === 'left-form' ? 'left' : 'right';
    const newItemContent = e.target.querySelector('input').value

    if (chekIfItemExists(newItemContent, context)) {
        alert('Item already exists!')
        return
    }

    const newItem = createItem(newItemContent, context)

    e.target.previousElementSibling.appendChild(newItem)

    addItemToStorage(newItemContent, context)

    e.target.querySelector('input').value = ''
}

function updateOrRemove(e) {
    if (editMode) {
        const previousItemToEdit = document.querySelector('.item-to-edit')
        if (previousItemToEdit) {
            previousItemToEdit.classList.remove('item-to-edit')
        }
        if (e.target.localName === 'svg') {
            e.target.parentElement.parentElement.classList.add('item-to-edit')
        } else if (e.target.localName === 'path') {
            e.target.parentElement.parentElement.parentElement.classList.add('item-to-edit')
        }
        // TODO EDIT CONTENT
    } else {
        if (e.target.parentElement.classList.contains('remove') || e.target.parentElement.parentElement.classList.contains('remove')) {
            if (e.target.parentElement.classList.contains('remove')) {
                remove(e.target.parentElement.parentElement)
            } else if (e.target.parentElement.parentElement.classList.contains('remove')) {
                remove(e.target.parentElement.parentElement.parentElement)
            }
        }
    }
}

function remove(item) {
    removeItemFromStorage(getTextContent(item), getContext(item))
    item.remove()
}

function filterItems(e) {
    const items = document.querySelectorAll('.item.ml-4.text-sm')
    const text = e.target.value.toLowerCase()
  
    items.forEach((item) => {
      const itemName = item.firstChild.textContent.toLowerCase()
      if (itemName.indexOf(text) != -1) {
        item.parentElement.parentElement.style.display = 'flex'
      } else {
        item.parentElement.parentElement.style.display = 'none'
      }
    });
}

// ITEM CREATION
function chekIfItemExists(item, context) {
    const itemsFromStorage = getItemsFromStorage(context)
    return itemsFromStorage.includes(item)
}

function addItemToDOM(item, context) {
    const newItem = createItem(item, context)
    document.getElementById(context + '-list').firstElementChild.nextElementSibling.appendChild(newItem)
}

function createItem(text, context) {
    let item_id = randstr('todo_item_');

    const wrapper = document.createElement('div')
    wrapper.className = 'flex items-center'

    const input = document.createElement('input')
    input.setAttribute('id', item_id)
    input.className = 'hidden'
    input.type = 'checkbox'

    wrapper.appendChild(input)

    const label = document.createElement('label')
    label.setAttribute('for', item_id)
    label.className = 'flex flex-grow items-center h-10 px-2 rounded cursor-pointer'
    if (context === 'left') {
      label.classList.add('hover:bg-gray-100')
    } else {
      label.classList.add('hover:bg-gray-900')
    }

    const icon = document.createElement('span')
    icon.className = 'flex items-center justify-center w-5 h-5 text-transparent border-2 border-gray-300 rounded-full'
    icon.innerHTML = checkIcon
    label.appendChild(icon)

    const content = document.createElement('span')
    content.className = 'item ml-4 text-sm'
    content.appendChild(document.createTextNode(text))
    label.appendChild(content)

    wrapper.appendChild(label)

    const close = document.createElement('div')
    close.className = 'action remove w-6 flex items-center justify-center cursor-pointer'
    if (context === 'left') {
        if (editMode) {
            close.classList.add('text-orange-600')
        } else {
            close.classList.add('text-red-700')
        }
    } else {
        close.classList.add('white')
    }
    if (editMode) {
        close.innerHTML = editIcon
    } else {
        close.innerHTML = closeIcon
    }
    wrapper.appendChild(close)

    return wrapper
}

function getTextContent(item) {
    return item.firstElementChild.nextElementSibling.firstElementChild.nextElementSibling.textContent
}

function getContext(item) {
    if (item.parentElement.parentElement.attributes.id.value === 'left-list') {
        return 'left'
    } else {
        return 'right'
    }
}

// WORK WITH LOCAL STORAGE
function getItemsFromStorage(context) {
    let itemsFromStorage
    if (localStorage.getItem('items-' + context) === null) {
        itemsFromStorage = []
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items-' + context))
    }
    return itemsFromStorage
}

function addItemToStorage(item, context) {
    const itemsFromStorage = getItemsFromStorage(context)
    itemsFromStorage.push(item)
    localStorage.setItem('items-' + context, JSON.stringify(itemsFromStorage))
}

function removeItemFromStorage(item, context) {
    let itemsFromStorage = getItemsFromStorage(context)
    itemsFromStorage = itemsFromStorage.filter((storageItem) => storageItem !== item)
    localStorage.setItem('items-' + context, JSON.stringify(itemsFromStorage))
}

// GENERATE A UNIQ STING FOR LIST ITEMS
function randstr(prefix) {
    return Math.random().toString(36).replace('0.', prefix || '');
}

// HANDLE KEYBOARD COMMANDS
function shortcuts(e) {
    // If CTRL + F
    if (e.ctrlKey && e.keyCode == 70) {
        filter.classList.toggle('hidden')
        if (!filter.classList.contains('hidden')) {
            filterInput.focus()
        } else {
            filterInput.value = ''
            document.querySelectorAll('.item.ml-4.text-sm').forEach((item) => {
                item.parentElement.parentElement.style.display = 'flex'
            })
        }
    }
    // If CTRL + E
    if (e.ctrlKey && e.keyCode == 69) {
        editMode = !editMode
        document.querySelector('body').classList.toggle('edit')
        document.getElementById('edit-mode').classList.toggle('hidden')
        document.querySelectorAll('.list-form').forEach(el => el.classList.toggle('hidden'))
        if (editMode) {
            document.querySelectorAll('.action.remove').forEach(el => {
                el.innerHTML = editIcon
                el.classList.replace('text-red-700', 'text-orange-600')
            })
        } else {
            document.querySelectorAll('.action.remove').forEach(el => {
                el.innerHTML = closeIcon
                el.classList.replace('text-orange-600', 'text-red-700')
            })
                
        }
    }
}

// INIT APP
(() => {
    document.addEventListener('keydown', shortcuts)
    document.querySelectorAll('.list-form').forEach(el => el.addEventListener('submit', addItem))
    document.querySelectorAll('.list-items').forEach(el => el.addEventListener('click', updateOrRemove))
    filterInput.addEventListener('input', filterItems)
    document.addEventListener('DOMContentLoaded', displayItems)
})()


