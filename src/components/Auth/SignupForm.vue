<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();
const passError = ref('')
const usernameError = ref('')

function signupFormClick(event){
    fetch('http://127.0.0.1:8000/api/signup/', {
            method: 'POST',
            headers: new Headers({
                        'Accept': 'application/json',
        'Content-Type': 'application/json',
               'X-CSRFTOKEN': authStore.csrftoken
            }),
            credentials: 'include',
            
            body: JSON.stringify({ username: event.target.username.value, password:event.target.password.value })
        }
        ).then(response => {
            if (!response.ok) {
            }
            else {
            router.push('/login')
            }
            return response.json();
        })
        .then(data => {
            passError.value = data.password
            usernameError.value = data.username
        })
   }



</script>

<template>


<div  class="form-container" @submit.prevent="signupFormClick">
  <form  >
    <h1>Sign Up</h1>
    <div class="success">
    {{  success }}
    </div>
    <label  for="username"><b>Username</b></label>
    <input type="text" v-model="username" placeholder="Enter Username" name="username" required>
     <div class="error">
    {{  usernameError }}
    </div>
    
    <label for="password"><b>Password</b></label>
    <input type="password"v-model="password" placeholder="Enter Password" name="password" required>
     <div class="error">
    {{  passError }}
    </div>
    <button type="submit" class="btn">Sign Up</button>
  </form>
</div>
</template>



<style scoped>



.form-container {
  height: 100vh;
  background-color: #f0f0f0;
    padding: 40px;

    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    width: 300px;
}

/* Full-width input fields */
.form-container input[type=text], .form-container input[type=password] {
  width: 90%;
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

.error {
  color: #db0505;
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
