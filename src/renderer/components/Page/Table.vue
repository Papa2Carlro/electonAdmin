<template>
    <section ref="table" class="table">
        <div v-if="loader" class="table__loader"><span></span></div>

        <ul v-else class="table__list">
            <li v-for="list in lists[page - 1]" class="table__list-item">
                <div class="table__list-group">
                    <label for="key" class="table__list-label">Ключ</label>
                    <input type="text" id="key" :value="list.key" readonly class="table__list-body">
                </div>

                <div class="table__list-group">
                    <label for="password" class="table__list-label">Пароль</label>
                    <input type="text" id="password" :value="list.password" readonly class="table__list-body">
                </div>

                <div class="table__list-buttons">
                    <button @click="deleteHandler(list.id)" class="table__list-btn">Удалить</button>
                </div>
            </li>
        </ul>

        <Pagination
          v-model="page"
          :records="lists.length"
          :per-page="1"
          :options="{
              chunk: 5,
              chunksNavigation: 'scroll',
              edgeNavigation: true,
              texts: {
                  first: 'В начало',
                  last: 'В конец'
              }
          }"
          @paginate="paginateHandler"/>

    </section>
</template>

<script>
export default {
    name: 'SideBar',
    data: () => ({
        page: 1
    }),
    computed: {
        lists() {
            return this.$store.getters.getPaginationList
        },
        loader() {
            return this.$store.getters.getDataLoader
        }
    },
    methods: {
        paginateHandler() {
            this.$refs.table.scrollTop = 0
        },

        deleteHandler(index) {
            const isConfirm = confirm('Вы уверены что хотите удалить?')
            if (!isConfirm) return

            this.$store.dispatch('deleteData', index)
            this.page = this.lists[this.page - 1].length === 1 ? this.page - 1 : this.page
        },
    }
}
</script>