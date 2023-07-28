/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
// Example POST method implementation:

const users = ['asalek',"asalek", "asalek",'tnamir','tnamir'];
const roomName = "aaa"

const roomStatus = "PUBLIC"

async function fetchApi() {
    
    const response = await fetch('http://127.0.0.1:3000/rooms/change-room-Type', {method:'POST', headers: { 'Content-Type': 'application/json' },  body: JSON.stringify({roomName, users,roomStatus, auth: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuaWNrbmFtZSI6Im1lc3NhbGloIiwic3ViIjoiOGFkZjQ4YzgtNjc4My00OGFkLTliODMtZmQ3YzJiYmU4MjEyIiwiaWF0IjoxNjkwNDkwMzc3fQ.CIpv83MBTEEmlqIrFgPba7GquF5lcKyeVa8evq3LmTk"})}).then((response) => response.json())
}


fetchApi() 