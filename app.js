const form = document.forms[0]
const button = form.elements.button
const input = form.elements.input

const searchState = document.getElementById('search-state')
const resultContainer = document.getElementById('result-container')

input.focus()

const searchRepositories = async (keyWords) => {
	try {
		const response = await fetch(
			`https://api.github.com/search/repositories?q=${keyWords}&per_page=10`,
			{
				method: 'GET',
				headers: {
					accept: 'application/vnd.github+json',
				},
			}
		)

		return await response.json()
	} catch (e) {
		console.error(e.message)
	}
}

form.addEventListener('submit', async (e) => {
	e.preventDefault()

	const listTitle = document.querySelector('.list-title')

	resultContainer.innerHTML = null
	listTitle.hidden = true

	if (input.value === '') {
		return (searchState.textContent = 'Введите запрос')
	}
	if (input.value.length > 256) {
		return (searchState.textContent =
			'Длина запроса не может превышать 256 символов')
	}

	button.disabled = true

	searchState.textContent = 'Загрузка...'

	const searchResult = await searchRepositories(input.value)

	if (searchResult === undefined || searchResult.total_count === 0) {
		searchState.textContent = 'Ничего не найдено'
		button.disabled = false
		input.value = ''

		return
	}

	searchState.textContent = ''

	listTitle.hidden = false

	const elements = searchResult.items.map((el) => {
		const li = document.createElement('li')
		li.className = 'list__item'

		li.innerHTML = `
            <div class="list__item__img"><img src="${el.owner.avatar_url}" alt="avatar"></div>

            <div class="list__item__content">
                <h3 class="list__item__title"><a href="${el.html_url}" target="_blank">${el.name}</a></h3>

                <b>Создатель:</b> <a href="${el.owner.html_url}" target="_blank">${el.owner.login}</a> <br>
                <b>Язык программирования:</b> ${el.language} <br>
                <b>Описание:</b> ${el.description} <br>
                <b>Просмотры:</b> ${el.watchers}
            </div>
        `

		return li
	})

	resultContainer.append(...elements)

	console.log(searchResult)

	button.disabled = false
	input.value = ''
})

document.addEventListener('keydown', (e) => {
	if (e.key === 'Enter') button.click()
})
