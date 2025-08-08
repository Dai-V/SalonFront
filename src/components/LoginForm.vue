<script setup>
import { ref } from 'vue'
import { onMounted } from 'vue';
const isLoggedIn = ref(false)
var csrftoken


onMounted(() => {
checkIsLoggedIn()
})

function checkIsLoggedIn()
{       
     fetch('http://127.0.0.1:8000/api/is_logged_in', { 
        credentials: 'include'
     }) 
        .then(response => {
           if (response.status === 401 || response.status === 403) {
                isLoggedIn.value = false
            } else if (response.status === 200) {
                csrftoken = response.headers.get("x-csrftoken");
                isLoggedIn.value = true
            }
            
        })
    }

function logoutClick(event){
        fetch('http://127.0.0.1:8000/api/logout', {
            method: 'POST',
            headers: new Headers({
                'X-CSRFTOKEN': csrftoken
            }),
            credentials: 'include',
        }
        ).then(response => {
            if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            alert("Logout Successful")
            checkIsLoggedIn()

        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }



function loginClick(event){
    loginFormContainer.style.display = "block";
}

function closeFormClick(event){
    loginFormContainer.style.display = "none";
}

function loginFormClick(event){
    fetch('http://127.0.0.1:8000/api/login', {
            method: 'POST',
            headers: new Headers({
                        'Accept': 'application/json',
        'Content-Type': 'application/json',
               'X-CSRFTOKEN': csrftoken
            }),
            credentials: 'include',
            
            body: JSON.stringify({ username: event.target.username.value, password:event.target.password.value })
        }
        ).then(response => {
            if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            checkIsLoggedIn()
            closeFormClick()

        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }
       

</script>

<template>


<button v-if="isLoggedIn===true" class="open-button" @click="logoutClick">Logout </button>
<button v-else class="open-button" @click="loginClick"> Login </button>

<div id="loginFormContainer" class="form-popup"  @submit.prevent="loginFormClick">
  <form id="login-form" class="form-container">
    <h1 id="login-form-text">Login</h1>

    <label  for="username"><b>Email</b></label>
    <input type="text" v-model="username" placeholder="Enter Username" name="username" required>

    <label for="password"><b>Password</b></label>
    <input type="password"v-model="password" placeholder="Enter Password" name="password" required>

    <button type="submit" class="btn" >Login</button>
    <button type="button" class="btn cancel"  @click="closeFormClick">Close</button>
  </form>
</div>
</template>



<style scoped>
/* Button used to open the contact form - fixed at the bottom of the page */
.open-button {
  background-color: #555;
  color: white;
  padding: 16px 20px;
  border: none;
  cursor: pointer;
  opacity: 0.8;
  position: fixed;
  bottom: 23px;
  right: 28px;
  width: 280px;
}

/* The popup form - hidden by default */
.form-popup {
  display: none;
  position: fixed;
  bottom: 0;
  right: 15px;
  border: 3px solid #f1f1f1;
  z-index: 9;
}

/* Add styles to the form container */
.form-container {
  max-width: 300px;
  padding: 10px;
  background-color: white;
}

/* Full-width input fields */
.form-container input[type=text], .form-container input[type=password] {
  width: 100%;
  padding: 15px;
  margin: 5px 0 22px 0;
  border: none;
  background: #f1f1f1;
}

/* When the inputs get focus, do something */
.form-container input[type=text]:focus, .form-container input[type=password]:focus {
  background-color: #ddd;
  outline: none;
}

/* Set a style for the submit/login button */
.form-container .btn {
  background-color: #04AA6D;
  color: white;
  padding: 16px 20px;
  border: none;
  cursor: pointer;
  width: 100%;
  margin-bottom:10px;
  opacity: 0.8;
}

/* Add a red background color to the cancel button */
.form-container .cancel {
  background-color: red;
}

/* Add some hover effects to buttons */
.form-container .btn:hover, .open-button:hover {
  opacity: 1;
}

</style>
