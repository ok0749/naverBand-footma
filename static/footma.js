const select = document.querySelector('select')
const ul = document.querySelector('ul')
const body = document.querySelector('body')


const removeLiElement = () => {
    if (ul.hasChildNodes()) {
        const li = document.querySelectorAll('.content')
        li.forEach(element => {
            element.remove()
        });
    }
}

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

const handleMode = (mode) => {
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

    }).catch((error) => {
        console.log(error)
    })
}




const handleChange = () => {
    let mode = ''
    modeElement.splice(0, modeElement.length)
    if (select.value === 'total') {
        handleTotal()
    } else if (select.value === 'player') {
        mode = '용병구함'
        handleMode(mode)
    } else if (select.value === 'match') {
        mode = '매치'
        handleMode(mode)
    }
}

const init = () => {
    handleTotal();
    select.addEventListener('change', handleChange)
}

init()
