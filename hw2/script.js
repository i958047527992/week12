
function escape(toOutput) {
  return toOutput.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27')
    .replace(/\//g, '&#x2F')
}

function appendTodoToDOM(container, todo, isPrepend) {
  const html = `<div class="card flex-row justify-content-between align-items-center">
    <div class="card-body d-flex align-items-center ms-2">
      <input class="form-check-input mt-0" type="checkbox">
      <input type="text" class="todo-edit w-75 d-none p-0 ms-2 px-1" placeholder="todo" value="${escape(todo)}">
      <label class="form-check-label ms-2 w-75 text-break">
        ${escape(todo)}
      </label>
    </div>
    <div class="btn-group me-2" role="group" aria-label="Basic example">
      <button type="button" class="d-inline btn btn-outline-primary btn-edit me-1">編輯</button>
      <button type="button" class="d-inline btn btn-outline-danger btn-delete">刪除</button>
    </div>
  </div>`
  if (isPrepend) {
    container.prepend(html)
  } else {
    container.append(html)
  }
}
function getUrlParameter(sParam) {
  const url = new URL(window.location.href)
  const params = url.searchParams
  const id = params.has(sParam) ? params.get(sParam) : false
  return id
}
const apiUrl = 'http://localhost/week12/hw2'
$(document).ready(() => {
  const todosDOM = $('.todos')
  const id = getUrlParameter('id')
  if (id) {
    $.ajax({
      method: 'GET',
      url: `${apiUrl}/api_get_todos.php?id=${id}`
    }).done((data) => {
      if (!data.ok) {
        alert(data.message)
        return
      }
      const todosHtml = JSON.parse(data.todos_content)
      $('.todos').html(todosHtml)
    }).fail((data) => {
      alert('無此 id')
    })
  }

  $('.add-todo-form').submit((e) => {
    e.preventDefault()
    const todoJquery = $('input[name=todo-item]')
    if (!todoJquery.val()) {
      alert('請輸入待辦事項！')
      return
    }
    const newTodoData = todoJquery.val()
    appendTodoToDOM(todosDOM, newTodoData, true)
    todoJquery.val('')
  })
  $('.todos').on('click', (e) => {
    if ($(e.target).hasClass('form-check-input')) {
      $(e.target).attr('checked', 'checked')
      $(e.target).siblings('.form-check-label').toggleClass('text-decoration-line-through')
      $(e.target).parents('.card').toggleClass('bg-success bg-gradient todo-done')
    }
    if ($(e.target).hasClass('btn-delete')) {
      $(e.target).parents('.card').remove()
    }
    if ($(e.target).hasClass('btn-edit')) {
      if ($(e.target).hasClass('editing')) {
        const editTodo = $(e.target).parent().siblings('.card-body').children('.todo-edit').val()
        $(e.target).parent().siblings('.card-body').children('.form-check-label').text(editTodo)
        $(e.target).text('編輯')
      } else {
        $(e.target).text('編輯完成')
      }
      $(e.target).toggleClass('editing')
      $(e.target).parent().siblings('.card-body').children('.todo-edit').toggleClass('d-none')
      $(e.target).parent().siblings('.card-body').children('.form-check-label').toggleClass('d-none')
    }
  })
  $('.bottom-btns').on('click', (e) => {
    if ($(e.target).hasClass('btn-delete-all')) {
      $('.todos').empty()
    }

    $('.todos').children().removeClass('d-none')

    if ($(e.target).hasClass('btn-todo-ing')) {
      $('.todos').children('.todo-done').addClass('d-none')
    }

    if ($(e.target).hasClass('btn-todo-done')) {
      $('.todos').children().addClass('d-none')
      $('.todos').children('.todo-done').removeClass('d-none')
    }

    if ($(e.target).hasClass('btn-store')) {
      if ($('.todos').text().length === 0) {
        alert('沒有任何待辦事項可以儲存！')
      } else {
        const todosHtml = $('.todos').html()
        const todosJson = JSON.stringify(todosHtml)
        const todos = { todos: todosJson }
        $.ajax({
          method: 'POST',
          url: `${apiUrl}/api_add_todos.php`,
          data: todos
        }).done((data) => {
          if (!data.ok) {
            alert(data.message)
            return
          }
          alert(`你儲存的代辦事項清單 id 為 ${data.id}`)
        })
      }
    }
  })
})
