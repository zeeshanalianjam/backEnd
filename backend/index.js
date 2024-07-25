import express from 'express'

const app = express()

// app.get('/', (req, res) => {
//     res.send('Hello World!')
// })

app.get('/api/jokes', (req, res) => {
    const jokes = [
        {
            id: 1,
            title: 'A joke',
            content: 'This is a joke'
        }, {
            id: 2,
            title: 'Another joke',
            content: 'This is another joke'
        }, {
            id: 3,
            title: 'Yet another joke',
            content: 'This is yet another joke'
        }, {
            id: 4,
            title: 'The final joke',
            content: 'This is the final joke'
        }, {
            id: 5,
            title: 'Last joke',
            content: 'This is the last joke'
        }

    ]
    res.send(jokes)
})

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})
