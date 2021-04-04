import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios"
import url from "../plugins/url"
import _ from 'lodash'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        chunk: 7,

        apiKey: '',
        list: [],
        paginationList: [],

        addLoader: false,
        dataLoader: false,
    },
    mutations: {
        LOGOUT(state) {
            state.apiKey = ''
        },
        LOGIN(state, key) {
            state.apiKey = key
        },
        SET_DATA(state, data) {
            state.list = data
            state.paginationList = _.chunk(state.list, state.chunk)
        },
        ADD_DATA(state, data) {
            state.list.unshift(data)
            state.paginationList = _.chunk(state.list, state.chunk)
        },
        SET_ADD_LOADER(state, status) {
            state.addLoader = status
        },
        SET_DATA_LOADER(state, status) {
            state.dataLoader = status
        },
        DELETE_DATA(state, index) {
            state.list = state.list.filter(({id}) => id !== index)
            state.paginationList = _.chunk(state.list, state.chunk)
        }
    },
    actions: {
        login({commit}, key) {
            commit('LOGIN', key)
        },
        getData({commit, state}) {
            commit('SET_DATA_LOADER', true)

            const bodyFormData = new FormData()
            bodyFormData.append('method', 'get')

            axios({
                method: 'POST',
                url: url + '/api/',
                headers: {
                    'Authorization': state.apiKey,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: bodyFormData
            })
                .then(({data}) => commit('SET_DATA', data.data))
                .catch(err => console.log(err))
                .finally(() => commit('SET_DATA_LOADER', false))
        },
        addData({commit, state}, data) {
            commit('SET_ADD_LOADER', true)

            const bodyFormData = new FormData()
            bodyFormData.append('key', data.key)
            bodyFormData.append('password', data.password)
            bodyFormData.append('method', 'put')

            axios({
                method: 'POST',
                url: url + '/api/',
                headers: {
                    'Authorization': state.apiKey,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: bodyFormData
            })
                .then((res) => {
                    const formData = {
                        id: res.data.id[0].id,
                        key: data.key,
                        password: data.password,
                    }

                    commit('ADD_DATA', formData)
                })
                .catch(err => console.log(err))
                .finally(() => commit('SET_ADD_LOADER', false))
        },
        deleteData({commit, state}, index) {
            const bodyFormData = new FormData()
            bodyFormData.append('id', index)
            bodyFormData.append('method', 'del')

            axios({
                method: 'POST',
                url: url + '/api/',
                headers: {
                    'Authorization': state.apiKey,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: bodyFormData
            })
                .then(() => commit('DELETE_DATA', index))
                .catch(err => console.log(err))
        },
    },
    getters: {
        getKey(state) {
            return state.apiKey
        },
        getList(state) {
            return state.list
        },
        getPaginationList(state) {
            return state.paginationList
        },
        getAddLoader(state) {
            return state.addLoader
        },
        getDataLoader(state) {
            return state.dataLoader
        }
    },
    strict: process.env.NODE_ENV !== 'production'
})
