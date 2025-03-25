<script setup lang="ts">
import { ref } from 'vue'
import LoginController from '~/features/LoginFeature/presentation/controllers/login_controller'
import LoginParams  from '~/features/LoginFeature/Core/Params/login_params'

const username = ref('')
const password = ref('')

const login = () => {
  LoginController.getInstance().login(new LoginParams(username.value, password.value, ''))
}
</script>

<template>
  <div>
    <form ~submit.prevent="login">
      <div>
        <label for="username">Username</label>
        <input type="text" id="username" v-model="username" />
      </div>
      <div>
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" />
      </div>
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<style scoped></style>
