/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
// Example POST method implementation:

const users = ['asalek'];
const name = "test"

const type = "PROTECTED"

 


// async function createRoom()
// {
//     const response = await fetch('http://127.0.0.1:3000/rooms/', 
//         { 
//             method:'POST', 
//             headers: { 'Content-Type': 'application/json' },  
//             body: JSON.stringify({
//                 roomName : "samara", 
//                 users,
//                 type, 
//                 password: "1234",
//                 auth: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuaWNrbmFtZSI6ImFkYWlmaSIsInN1YiI6ImY2MWM2NmYzLWUyZDItNGY1MS05ODRmLWQ3YWQxN2RlMmM3YSIsImlhdCI6MTY5MDYyNjU3NX0.o9Nib6wgforBqK2osEkON6ht0bYZ4RhRqwogCFaefCI"})}).then((response) => response.json())
            
//         console.log(response)

// }

// createRoom()



// async function setOtherAasAdministrators()
// {
//     const response = await fetch('http://127.0.0.1:3000/rooms/setOtherAasAdministrators', 
//         { 
//             method:'POST', 
//             headers: { 'Content-Type': 'application/json' },  
//             body: JSON.stringify({
//                 roomName,  // test user try change
//                 users,
//                 auth: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuaWNrbmFtZSI6Im1lc3NhbGloIiwic3ViIjoiY2ViOTVmYjYtZDlhZC00NThlLTgzNTctMTQyOTM1YTgwZGZlIiwiaWF0IjoxNjkwNTc3NTEyfQ.S9UxCON3cuVQ_5edBYIF6DTJMmmHZEZG1ElvipJqtf0"})}).then((response) => response.json())
            
//         console.log(response)

// }

// setOtherAasAdministrators()

// async function changeTypeToUsers()
// {
//     const response = await fetch('http://127.0.0.1:3000/rooms/changeTypeToUsers', 
//         { 
//             method:'POST', 
//             headers: { 'Content-Type': 'application/json' },  
//             body: JSON.stringify({
//                 roomName, 
//                 users,
//                 auth: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuaWNrbmFtZSI6Im1lc3NhbGloIiwic3ViIjoiY2ViOTVmYjYtZDlhZC00NThlLTgzNTctMTQyOTM1YTgwZGZlIiwiaWF0IjoxNjkwNTY2OTY5fQ.43PAXcc3VnIZwdVhioHTPxo4vfl7VSBix0U9J9fhL-I"})}).then((response) => response.json())
            
//         console.log(response)

// }

// changeTypeToUsers()


// make user change the type of the room

// async function changeRoomType()
// {
//     const response = await fetch('http://127.0.0.1:3000/rooms/change-room-Type', 
//         { 
//             method:'POST', 
//             headers: { 'Content-Type': 'application/json' },  
//             body: JSON.stringify({
//                 roomName : , 
//                 type,
//                 password: "test", 
//                 auth: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuaWNrbmFtZSI6Im1lc3NhbGloIiwic3ViIjoiNTlmYjA0YWItYTY2ZS00NzE3LTk0N2QtMzhiMGYwNGU2YWIzIiwiaWF0IjoxNjkwNjI2OTcxfQ.9nIjaYjmsB09pZ3c0ELsP-PYgYOVQKKQJfGUpYx_Zqo"})}).then((response) => response.json())
            
//         console.log(response)

// }

// changeRoomType()

async function joinRoom()
{
    const response = await fetch('http://127.0.0.1:3000/rooms/join-room', 
        { 
            method:'POST', 
            headers: { 'Content-Type': 'application/json' },  
            body: JSON.stringify({
                name : 'samara', 
                pass: "1234", 
                auth: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuaWNrbmFtZSI6InRuYW1pciIsInN1YiI6IjQ5YzY2YWJiLTNmNGEtNDM3MC04NjBiLWQxMTM5YjFhM2U0NCIsImlhdCI6MTY5MDYyNjUzOX0.MvhDA7DA6j3qWbhtJm-3GOjuuVtsYYc5lKrUG6IKnXk"})}).then((response) => response.json())
            
        console.log(response)

}

joinRoom()



 