/* eslint-env jquery */
function escape(toOutput) {
  return toOutput.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27')
    .replace(/\//g, '&#x2F')
}

function appendCommentToDOM(container, { nickname, content }, isPrepend) {
  const html = `
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">${escape(nickname)}</h5>
        <p class="card-text">${escape(content)}</p>
      </div>
    </div>
  `
  isPrepend ? container.prepend(html) : container.append(html)
}
const apiUrl = 'http://localhost/week12/hw1'
$(document).ready(() => {
  let offset = 0
  const commentsDOM = $('.comments')
  const ajaxUrl = `${apiUrl}/api_comments.php?site_key=yiluan&offset=${offset}`
  $.ajax({
    url: ajaxUrl
  }).done((data) => {
    if (!data.ok) {
      alert(data.message)
      return
    }
    const comments = data.discussions
    for (const comment of comments) {
      appendCommentToDOM(commentsDOM, comment, false)
      offset += 1
    }
    if (comments.length < 5) {
      $('.btn-more-section').addClass('d-none')
    }
  })
  $('.add-comment-form').submit((e) => {
    e.preventDefault()
    const nicknameJquery = $('input[name=nickname]')
    const textareaJquery = $('textarea[name=content]')
    const newCommentData = {
      site_key: 'yiluan',
      nickname: nicknameJquery.val(),
      content: textareaJquery.val()
    }
    $.ajax({
      type: 'POST',
      url: `${apiUrl}/api_add_comment.php`,
      data: newCommentData
    }).done((data) => {
      if (!data.ok) {
        alert(data.message)
        return
      }
      nicknameJquery.val('')
      textareaJquery.val('')
      appendCommentToDOM(commentsDOM, newCommentData, true)
      offset += 1
    })
  })
  $('.btn-more').click((e) => {
    const moreAjaxUrl = `${apiUrl}/api_comments.php?site_key=yiluan&offset=${offset}`
    $.ajax({
      url: moreAjaxUrl
    }).done((data) => {
      if (!data.ok) {
        alert(data.message)
        return
      }

      const comments = data.discussions
      for (const comment of comments) {
        appendCommentToDOM(commentsDOM, comment, false)
        offset += 1
      }
      if (comments.length < 5) {
        $('.btn-more-section').addClass('d-none')
      }
    })
  })
})
