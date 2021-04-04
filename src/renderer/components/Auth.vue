<template>
    <div class="auth">
        <div class="auth__body">
            <img class="auth__body-logo" src="../assets/logo.png" alt="">

            <form @submit.prevent="submitHandler" class="auth__body-form">

                <div
                  class="auth__body-group"
                  :class="{invalid: ($v.login.$dirty && !$v.login.required || $v.login.$dirty && !$v.login.minLength) || error}">

                    <label
                      class="auth__body-placeholder"
                      :class="{focus: placeholder.login}"
                      for="login">Логин</label>

                    <input
                      id="login"
                      type="text"
                      v-model="login"
                      class="auth__body-input"
                      @blur="blur('login')"
                      @focus="focus('login')"
                      @input="error = false">

                    <div v-if="$v.login.$dirty && !$v.login.minLength" class="auth__body-error">
                        Минимальное количество символов 3
                    </div>

                    <div v-else-if="$v.login.$dirty && !$v.login.required" class="auth__body-error">
                        Обязательное поле
                    </div>

                    <div v-else-if="error" class="auth__body-error">Логин не правильный</div>
                </div>

                <div
                  class="auth__body-group"
                  :class="{invalid: ($v.password.$dirty && !$v.password.required || $v.password.$dirty && !$v.password.minLength) || error}">

                    <label
                      class="auth__body-placeholder"
                      :class="{focus: placeholder.password}"
                      for="password">Пароль</label>

                    <input
                      id="password"
                      type="password"
                      v-model="password"
                      class="auth__body-input"
                      @blur="blur('password')"
                      @focus="focus('password')"
                      @input="error = false">

                    <div v-if="$v.password.$dirty && !$v.password.minLength" class="auth__body-error">
                        Минимальное количество символов 8
                    </div>

                    <div v-else-if="$v.password.$dirty && !$v.password.required" class="auth__body-error">
                        Обязательное поле
                    </div>

                    <div v-else-if="error" class="auth__body-error">Пароль не правильный</div>
                </div>

                <button type="submit" class="auth__body-btn">Отправить</button>
            </form>
        </div>

        <div class="auth__loader" :class="{active: loader}">
            <div class="auth__loader-circle"></div>
        </div>
    </div>
</template>

<script>
import {required, minLength} from 'vuelidate/lib/validators'
import axios from 'axios'
import url from "../plugins/url"
import base64js from 'base64-js'
import bcrypt from 'bcrypt'

export default {
    name: 'Auth',
    data: () => ({
        login: '',
        password: '',

        error: false,
        loader: false,
        placeholder: {login: false, password: false}
    }),
    validations: {
        login: {required, minLength: minLength(3)},
        password: {required, minLength: minLength(8)},
    },
    methods: {
        submitHandler() {
            if (this.$v.$invalid) {
                this.$v.$touch()
                return
            }

            this.loader = true
            this.sendData()
        },

        sendData() {
            const salt = bcrypt.genSaltSync(15)

            const cryptoL = bcrypt.hashSync(this.login, salt)
            const cryptoP = bcrypt.hashSync(this.password, salt)

            const baseSalt = this.Base64Encode(salt)
            const login = this.Base64Encode(cryptoL)
            const password = this.Base64Encode(cryptoP)
            const signature = this.Base64Encode(cryptoL + cryptoP + salt)

            const bodyFormData = new FormData()
            bodyFormData.append('login', login)
            bodyFormData.append('salt', baseSalt)
            bodyFormData.append('password', password)
            bodyFormData.append('signature', signature)

            axios({
                method: 'POST',
                url: url + '/api/',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: bodyFormData
            })
              .then(({data}) => {
                  this.$router.push({name: 'page'})
                  this.$store.commit('LOGIN', data.you_key)
              })
              .catch(() => this.error = true)
              .finally(() => this.loader = false)
        },

        Base64Encode(str, encoding = 'utf-8') {
            const bytes = new (TextEncoder || TextEncoderLite)(encoding).encode(str)
            return base64js.fromByteArray(bytes)
        },

        focus(field) {
            this.placeholder[field] = true
        },
        blur(field) {
            this.placeholder[field] = !!this[field]
        }
    }
}
</script>