function addItem(e) {
    e.preventDefault()

    if (!e.target.querySelector('input').value) {
        return
    }

    const context = e.target.attributes.id.value  === 'left-form' ? 'left' : 'right';

    const newItemContent = e.target.querySelector('input').value

    const newItem = createItem(newItemContent, context)

    e.target.previousElementSibling.appendChild(newItem)

    e.target.querySelector('input').value = ''
}

function removeItem(e) {
    if (e.target.parentElement.classList.contains('remove') || e.target.parentElement.parentElement.classList.contains('remove')) {
        if (e.target.parentElement.classList.contains('remove')) {
            e.target.parentElement.parentElement.remove()
        } else if (e.target.parentElement.parentElement.classList.contains('remove')) {
            e.target.parentElement.parentElement.parentElement.remove()
        }
    }
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
    icon.innerHTML = 
    `
    <svg class="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
    </svg>
    `
    label.appendChild(icon)

    const content = document.createElement('span')
    content.className = 'ml-4 text-sm'
    content.appendChild(document.createTextNode(text))
    label.appendChild(content)

    wrapper.appendChild(label)

    const close = document.createElement('div')
    close.className = 'remove w-6 flex items-center cursor-pointer text-red-700'
    close.innerHTML = 
    `
    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
        <path d="M557.2 512l136.4-136.4c12.4-12.4 12.4-32.8 0-45.2-12.4-12.4-32.8-12.4-45.2 0L512 466.8l-136.4-136.4c-12.4-12.4-32.8-12.4-45.2 0-6.2 6.2-9.4 14.4-9.4 22.6 0 8.2 3.2 16.4 9.4 22.6l136.4 136.4-136.4 136.4c-6.2 6.2-9.4 14.4-9.4 22.6 0 8.2 3.2 16.4 9.4 22.6 12.4 12.4 32.8 12.4 45.2 0l136.4-136.4 136.4 136.4c12.4 12.4 32.8 12.4 45.2 0 12.4-12.4 12.4-32.8 0-45.2L557.2 512z"  />
    </svg>
    `
    wrapper.appendChild(close)

    return wrapper
}

function randstr(prefix) {
    return Math.random().toString(36).replace('0.', prefix || '');
}

// EVENT LISTENERS
Array.from(document.getElementsByClassName('list-form')).forEach(element => element.addEventListener('submit', addItem));
Array.from(document.getElementsByClassName('list-items')).forEach(element => element.addEventListener('click', removeItem));
