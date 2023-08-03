/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
// Example POST method implementation:




// async function createRoom()
// {
//     const response = await fetch('http://127.0.0.1:3000/rooms/', 
//         { 
//             method:'POST', 
//             headers: { 'Content-Type': 'application/json' },  
//             body: JSON.stringify({
//                 roomName : "sds", 
//                 users : ['asalek'],
//                 type:'PUBLIC', 
//                 password: "1234",
//                 auth: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuaWNrbmFtZSI6ImFkYWlmaSIsInN1YiI6IjdhM2E0ZDQ2LWIzYTQtNGMxMC04OGIwLTQ5N2M0YjQ2NTE5MSIsImlhdCI6MTY5MDkzMTEwMn0.CZUihNyTv_zvzrJdIbBBYFSM-nqFUemcBtiz_jN90HU"})}).then((response) => response.json())
            
//         console.log(response)

// }

// createRoom()


async function onJoinedRoom()
{
    const response = await fetch('http://127.0.0.1:3000/rooms/select-room', 
        { 
            method:'POST', 
            headers: { 'Content-Type': 'application/json' },  
            body: JSON.stringify({
                roomName : "test", 
                auth: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuaWNrbmFtZSI6InRuYW1pciIsInN1YiI6IjczYTJmZTM3LWRjNmUtNGFlMC1iMDRiLWQzZjY5ZTcyYmZmMCIsImlhdCI6MTY5MTAwODI1OH0.Jqb2vlgHHyepRcB-VFsu2eYACopUQu0c3CS5g5P6_m8"})}).then((response) => response.json())
            
        console.log(response)

}

onJoinedRoom()

// createRonJoinedRoomoom()



// async function setOtherAasAdministrators()
// {
//     const response = await fetch('http://127.0.0.1:3000/rooms/setOtherAasAdministrators', 
//         { 
//             method:'POST', 
//             headers: { 'Content-Type': 'application/json' },  
//             body: JSON.stringify({
//                 roomName:'ok',  // test user try change
//                 users :['adaifi'],
//                 auth: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuaWNrbmFtZSI6Im1lc3NhbGloIiwic3ViIjoiODc3NzcxNmMtMzZlMy00ZDEwLWJlMGQtMjNiNmRjMjQ5OWFjIiwiaWF0IjoxNjkwOTE1MDQ4fQ.imS0wn5I6Q6cSXCZoQZ4cBIOG-lV_aRQ5hoFsDLP3fE"})}).then((response) => response.json())
            
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
//                 roomName : 'testo', 
//                 type : 'PROTECTED' ,
//                 password: "test", 
//                 auth: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuaWNrbmFtZSI6Im1lc3NhbGloIiwic3ViIjoiZjU1YWQ0NjAtMzVhZi00MjM3LWJlYmQtOWZlODY5ZDdiMTlmIiwiaWF0IjoxNjkwODkyMTA4fQ.ZgK2S2YTiu0G0pjYuDQEiMvtZ0Ju6z_8kO0UNqj9pqs"})}).then((response) => response.json())
            
//         console.log(response)

// }

// changeRoomType()

// async function joinRoom()
// {
//     const response = await fetch('http://127.0.0.1:3000/rooms/join-room', 
//         { 
//             method:'POST', 
//             headers: { 'Content-Type': 'application/json' },  
//             body: JSON.stringify({
//                 name : 'samara', 
//                 auth: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuaWNrbmFtZSI6ImFkYWlmaSIsInN1YiI6IjNhMzAwMTU1LWI4MmUtNDlkMy1hNDlhLTYzMmI4YWJkNWUyMCIsImlhdCI6MTY5MTAwODI3N30.3hmi8sqqsToHKqfzKhKWEVo20Mq7qU2Ujh-sH6M-ZaE"})}).then((response) => response.json())

//         console.log(response)

// }

// joinRoom()

// const io = require('socket.io-client');

// async function connectToWebSocket()
// {
//     const socket = io('ws://127.0.0.1:3004',{
// 			auth: {
// 				token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuaWNrbmFtZSI6Im1lc3NhbGloIiwic3ViIjoiZjU1YWQ0NjAtMzVhZi00MjM3LWJlYmQtOWZlODY5ZDdiMTlmIiwiaWF0IjoxNjkwODM3MTM0fQ.5ozooN7jcA1EbAQ5Yk6XhoXTlQgDcVnLDcSnFyXy8CM'
// 			},
// 		});
// }


// connectToWebSocket()


// const users = ['asalek' ,'asalek' , 'tnamir'];
// const name = "dfd"

// const type = "PUBLIC"

 



// async function addNewUsersToRoom()
// {

// const response = await fetch('http://127.0.0.1:3000/rooms/addNewUsersToRoom', 
//         { 
//             method:'POST', 
//             headers: { 'Content-Type': 'application/json' },  
//             body: JSON.stringify({
//                 idOfRoom : 'e0d4de66-cd92-4455-b6b6-17fa70615d93', 
//                 users ,
//                 pass: "1234", 
//                 auth: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuaWNrbmFtZSI6InRuYW1pciIsInN1YiI6IjIyN2FmNTNlLTQyNWYtNDQ1Mi05NzQwLTljYjQ4Yzg0MjNkMCIsImlhdCI6MTY5MDg4OTMxMH0.h-dtQzHBaYOV8tPpxr8WEsIoYqK3amI9whx5ntLYpno"})}).then((response) => response.json())
            
//         console.log(response)


// }

// addNewUsersToRoom()




// async function renameRoom()
// {

// const response = await fetch('http://127.0.0.1:3000/rooms/renameRoom', 
//         { 
//             method:'POST', 
//             headers: { 'Content-Type': 'application/json' },  
//             body: JSON.stringify({
//                 idOfRoom : 'e0d4de66-cd92-4455-b6b6-17fa70615d93', 
//                 users ,
//                 pass: "1234", 
//                 newNameOfRoom: 'testo',
//                 auth: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuaWNrbmFtZSI6Im1lc3NhbGloIiwic3ViIjoiZjU1YWQ0NjAtMzVhZi00MjM3LWJlYmQtOWZlODY5ZDdiMTlmIiwiaWF0IjoxNjkwODkyMTA4fQ.ZgK2S2YTiu0G0pjYuDQEiMvtZ0Ju6z_8kO0UNqj9pqs"})}).then((response) => response.json())
            
//         console.log(response)


// }

// renameRoom()

// async function changePasswordOfProtectedRoom()
// {

// const response = await fetch('http://127.0.0.1:3000/rooms/changePasswordOfProtectedRoom', 
//         { 
//             method:'POST', 
//             headers: { 'Content-Type': 'application/json' },  
//             body: JSON.stringify({
//                 idOfRoom : 'e0d4de66-cd92-4455-b6b6-17fa70615d93', 
//                 newPassword: 'new',
//                 auth: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuaWNrbmFtZSI6Im1lc3NhbGloIiwic3ViIjoiZjU1YWQ0NjAtMzVhZi00MjM3LWJlYmQtOWZlODY5ZDdiMTlmIiwiaWF0IjoxNjkwODkyMTA4fQ.ZgK2S2YTiu0G0pjYuDQEiMvtZ0Ju6z_8kO0UNqj9pqs"})}).then((response) => response.json())
            
//         console.log(response)


// }

// changePasswordOfProtectedRoom()



// async function leaveRoom()
// {

// const response = await fetch('http://127.0.0.1:3000/rooms/leaveRoom', 
//         { 
//             method:'POST', 
//             headers: { 'Content-Type': 'application/json' },  
//             body: JSON.stringify({
//                 idOfRoom : '2dc51aed-66a0-48ec-a47b-c4186c8b626d', 
//                 auth: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuaWNrbmFtZSI6InRuYW1pciIsInN1YiI6ImU0YzY2ODViLWUyN2EtNDYyZi1iYTQxLWEwYzk1ZWQxNWUxNSIsImlhdCI6MTY5MDkxMzgxNn0.CIQqhE71OcsMTXGuRQ_iakCLqMrPuJvbbXkAkQrcIA0"})}).then((response) => response.json())
            
//         console.log(response)


// }

// leaveRoom()

// async function kick()
// {

// const response = await fetch('http://127.0.0.1:3000/rooms/kick', 
//         { 
//             method:'POST', 
//             headers: { 'Content-Type': 'application/json' },  
//             body: JSON.stringify({
//                 idOfRoom : '825365bd-16c5-4415-b169-f798b520cdba', 
//                 users: ['adaifi'],
//                 auth: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuaWNrbmFtZSI6Im1lc3NhbGloIiwic3ViIjoiODc3NzcxNmMtMzZlMy00ZDEwLWJlMGQtMjNiNmRjMjQ5OWFjIiwiaWF0IjoxNjkwOTE1MDQ4fQ.imS0wn5I6Q6cSXCZoQZ4cBIOG-lV_aRQ5hoFsDLP3fE"})}).then((response) => response.json())
            
//         console.log(response)


// }

// kick()


// async function banFromRoom()
// {

// const response = await fetch('http://127.0.0.1:3000/rooms/banFromRoom', 
//         { 
//             method:'POST', 
//             headers: { 'Content-Type': 'application/json' },  
//             body: JSON.stringify({
//                 idOfRoom : '88aad697-8f8a-4402-b4f5-4d2358c85589', 
//                 users: ['asalek', 'tnamir', 'adaifi'],
//                 auth: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuaWNrbmFtZSI6Im1lc3NhbGloIiwic3ViIjoiOThlOWE1N2ItYmY2Yy00ODgxLTliODMtNDBkZTNlODc4ZGE1IiwiaWF0IjoxNjkxMDA4MjI5fQ.DQJwEOBE9T0boxorr43y0WIm7-kGynZdYwJG02vrrgM"})}).then((response) => response.json())
            
//         console.log(response)


// }

// banFromRoom()