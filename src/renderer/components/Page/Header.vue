<template>
    <header class="header">
        <ul class="header__left">
           <li class="header__action-item back" :class="{visible}" @click="backHandler">
               <img class="header__action-icon" :src="back" alt="">
           </li>

           <li class="header__action-item"><button class="header__add" @click="addNewHandler">Добавить новый</button></li>
        </ul>

        <ul class="header__action">
            <li class="header__action-item" @click="updateHandler"><img class="header__action-icon" :src="update" alt=""></li>

            <li class="header__action-item" @click="logoutHandler"><img class="header__action-icon" :src="logout" alt=""></li>
        </ul>
    </header>
</template>

<script>
import logout from '../../assets/logout.svg'
import update from '../../assets/update.svg'
import back from '../../assets/back.svg'

export default {
    name: 'Header',
    props: ['visible'],
    data: () => ({
        logout,
        update,
        back
    }),
    methods: {
        updateHandler() {
            this.$store.dispatch('getData')
        },

        logoutHandler() {
            this.$router.push({name: 'auth'})
            this.$store.commit('LOGOUT')
        },

        backHandler() {
            this.$emit('back')
        },

        addNewHandler() {
            this.$emit('add')
        }
    }
}
</script>