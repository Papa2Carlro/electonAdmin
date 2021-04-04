<template>
    <section class="page">
        <Header :visible="create" @add="openNew" @back="create = false"/>

        <div v-if="create" class="page__content">
            <form @submit.prevent="submitHandler" class="page__form">

                <div class="page__form-group"
                     :class="{invalid: ($v.key.$dirty && !$v.key.required || $v.key.$dirty && !$v.key.maxLength)}">
                    <label for="key" class="page__form-placeholder" :class="{focus: placeholder.key}">Ключ</label>

                    <input
                      id="key"
                      type="text"
                      v-model="key"
                      @blur="blur('key')"
                      @focus="focus('key')"
                      class="page__form-input">

                    <div v-if="$v.key.$dirty && !$v.key.maxLength" class="page__form-error">
                        Максимальное количество символов 255
                    </div>

                    <div v-else-if="$v.key.$dirty && !$v.key.required" class="page__form-error">
                        Обязательное поле
                    </div>
                </div>

                <div class="page__form-group"
                     :class="{invalid: ($v.password.$dirty && !$v.password.required || $v.password.$dirty && !$v.password.maxLength)}">

                    <label for="password" class="page__form-placeholder"
                           :class="{focus: placeholder.password}">Пароль</label>

                    <input
                      id="password"
                      type="text"
                      v-model="password"
                      @blur="blur('password')"
                      @focus="focus('password')"
                      class="page__form-input">

                    <div v-if="$v.password.$dirty && !$v.password.maxLength" class="page__form-error">
                        Максимальное количество символов 255
                    </div>

                    <div v-else-if="$v.password.$dirty && !$v.password.required" class="page__form-error">
                        Обязательное поле
                    </div>
                </div>

                <button type="submit" class="page__form-btn" :class="{loader: addLoader}">
                    <span>Добавить</span><em></em>
                </button>
            </form>
        </div>

        <Table v-else/>
    </section>
</template>

<script>
import Table from "./Page/Table"
import Header from "./Page/Header"
import {required, maxLength} from 'vuelidate/lib/validators'

export default {
    name: 'Page',
    data: () => ({
        key: '',
        password: '',

        create: false,
        placeholder: {key: false, password: false},
    }),
    validations: {
        key: {required, maxLength: maxLength(255)},
        password: {required, maxLength: maxLength(255)},
    },
    computed: {
        apiKey() {
            return this.$store.getters.getKey
        },
        addLoader() {
            return this.$store.getters.getAddLoader
        }
    },
    mounted() {
        this.$store.dispatch('getData')
    },
    methods: {
        submitHandler() {
            if (this.$v.$invalid) {
                this.$v.$touch()
                return
            }

            this.$store.dispatch('addData', {key: this.key, password: this.password})

            this.key = ''
            this.password = ''
            this.placeholder.key = false
            this.placeholder.password = false
        },

        openNew() {
            this.key = ''
            this.password = ''

            this.create = true
        },

        focus(field) {
            this.placeholder[field] = true
        },
        blur(field) {
            this.placeholder[field] = !!this[field]
        }
    },
    components: {Header, Table}
}
</script>