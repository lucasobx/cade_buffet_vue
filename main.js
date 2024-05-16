const apiURL = 'http://localhost:3000';

const app = Vue.createApp({
  data(){
    return{
      searchText: '',
      listBuffets: []
    }
  },

  watch:{
    searchText: 'fetchBuffets'
  },

  mounted(){
    this.fetchBuffets();
  },

  methods:{
    async fetchBuffets(){
      try{
        const searchQuery = this.searchText ? `?search=${this.searchText}` : '';
        let response = await fetch(`${apiURL}/api/v1/buffets${searchQuery}`);
        let data = await response.json();
    
        this.listBuffets = data.map(item => ({
          id: item.id,
          brand_name: item.brand_name,
          city: item.city,
          state: item.state
        }));
      } catch (error){
        console.error('Erro ao buscar buffets:', error);
      }
    }    
  }
})

app.mount('#app');