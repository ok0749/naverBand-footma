const modeSelect = document.querySelector('#mode-select')
const dateSelect = document.querySelector('#date-select')
const ul = document.querySelector('ul')
const body = document.querySelector('body')
const searchContext = document.querySelector('#searchContext')
const searchBtn = document.querySelector('#searchBtn')
const submitForm = document.querySelector('#submitForm')


// search
const handleSearch = (event) => {
    let reg = []
    event.preventDefault();
    let searchData = [];
    if (searchContext.value !== '') {
        axios.get('/total').then((total) => {
            total.data.forEach(element => {
                reg = new RegExp(`${searchContext.value}`, 'g')
                const result = reg.exec(element.content)
                // console.log(element.content.replace(reg, 'LOVE'))
                // const result = element.content.replace(reg, 'LOVE')
                if (result !== null) {
                    searchData.push(result['input'])
                    // searchData.push(result)
                }
            });
            if (searchData.length === 0) {
                alert('검색결과 없음 ')
                // console.log('검색결과 없음')
            } else {
                removeLiElement();
                searchData.forEach(element => {
                    const li = document.createElement('li')
                    li.innerHTML = element.replace(reg, "<span class='highlight'>" + searchContext.value + "</span>")
                    li.className = "content"
                    ul.appendChild(li)
                    // console.log(element)
                });
            }
            // console.log(searchData)
        }).catch((error) => {
            console.log(error)
        })

        // const li = document.querySelectorAll('li')
        // li.forEach(element => {
        //     let reg = new RegExp(`${searchContext.value}`, 'g')
        //     const result = reg.exec(element.innerHTML)
        //     if (result !== null) {
        //         const li = document.createElement('li')
        //         li.innerHTML = result['input']
        //         li.className = "content"
        //         ul.appendChild(li)
        //     }
        // });
    } else {
        alert('검색어를 입력하세요')
    }

}


// 화면에 나와있는 목록 제거
const removeLiElement = () => {
    if (ul.hasChildNodes()) {
        const li = document.querySelectorAll('.content')
        li.forEach(element => {
            element.remove()
        });
    }
}

// 전체글 불러오기
const handleTotal = () => {
    removeLiElement();
    axios.get('/total').then((total) => {
        total.data.forEach(element => {
            const li = document.createElement('li')
            li.innerHTML = element.content
            li.className = "content"
            ul.appendChild(li)
        });





    }).catch((error) => {
        console.log(error)
    })
}

let modeElement = [];

// 모드 선택시 해당 글 불러오기
const handleMode = (mode) => {
    dateSelect.removeAttribute('disabled')
    removeLiElement()
    axios.get('/total').then((total) => {
        total.data.forEach(element => {
            const context = element.content;
            const reg = RegExp(mode, 'g');
            modeElement.push(reg.exec(context));
        });
        modeElement.forEach(element => {
            if (element !== null) {
                const li = document.createElement('li')
                li.innerHTML = element['input']
                li.className = "content"
                ul.appendChild(li)
            }
        });
        dateSelect.addEventListener('change', handleDate)
    }).catch((error) => {
        console.log(error)
    })
}

const handleChange = () => {
    let mode = ''
    modeElement.splice(0, modeElement.length)
    if (modeSelect.value === 'total') {
        dateSelect.disabled = "disabled"
        handleTotal()
    } else if (modeSelect.value === 'player') {
        mode = '용병구함'
        handleMode(mode)
        // dateSelect.addEventListener('change', handleDate)
    } else if (modeSelect.value === 'match') {
        mode = '매치'
        handleMode(mode)
        // dateSelect.addEventListener('change', handleDate)
    }
}


// 날짜 오름차순, 내림차순 정리 
const handleDate = () => {
    const li = document.querySelectorAll('li')
    let date = []
    li.forEach(element => {
        const reg = /\d{1,2}월\d{1,2}일|\d{1,2}월\s\d{1,2}일|\d{1,2}[/]\d{1,2}일|\d{1,2}\s[/]\s\d{1,2}일 /g;
        const result = reg.exec(element.innerHTML)
        if (result !== null) {
            const regex1 = /(\d{1,2})월(\d{1})일/g // 11월1일
            const regex11 = /(\d{1,2})월(\d{2})일/g // 11월01일, 11월11일
            const regex2 = /(\d{1,2})월\s(\d{1})일/g // 11월 1일
            const regex21 = /(\d{1,2})월\s(\d{2})일/g // 11월 01일, 11월 11일
            const regex3 = /(\d{1,2})[/](\d{1})일/g // 11/1
            const regex31 = /(\d{1,2})[/](\d{2})일/g // 11/01, 11/11
            const regex4 = /(\d{1,2})\s[/]\s(\d{1})일/g // 11 / 1,   
            const regex41 = /(\d{1,2})\s[/]\s(\d{2})일/g // 11 / 01, 11 / 11  

            result[0] = result[0].replace(regex1, "$10$2")
            result[0] = result[0].replace(regex11, "$1$2")
            result[0] = result[0].replace(regex2, "$10$2")
            result[0] = result[0].replace(regex21, "$1$2")
            result[0] = result[0].replace(regex3, "$10$2")
            result[0] = result[0].replace(regex31, "$1$2")
            result[0] = result[0].replace(regex4, "$10$2")
            result[0] = result[0].replace(regex41, "$1$2")
            date.push(result)
            // console.log(result)
        }
    });
    date.sort()
    if (dateSelect.value === 'up') {
        removeLiElement();
        date.forEach(element => {
            const li = document.createElement('li')
            li.innerHTML = element['input']
            li.className = "content"
            ul.appendChild(li)
            // console.log(element['input'])
        });
    } else if (dateSelect.value === 'down') {
        removeLiElement();
        date.reverse()
        date.forEach(element => {
            const li = document.createElement('li')
            li.innerHTML = element['input']
            li.className = "content"
            ul.appendChild(li)
            // console.log(element['input'])
        });
    } else if (dateSelect.value === 'default') {
        handleTotal();
    }
}

const init = () => {
    dateSelect.disabled = "disabled"
    handleTotal();
    modeSelect.addEventListener('change', handleChange)
    submitForm.addEventListener('submit', handleSearch)
}

init()
