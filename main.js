const apiURL = 'http://127.0.0.1:3000';

const app = Vue.createApp({
  data(){
    return{
      searchText: '',
      listBuffets: [],
      selectedBuffet: null,
      showForm: false,
      selectedEventTypeId: null,
      availabilityDate: '',
      guestNumber: '',
      availabilityResponse: null
    }
  },

  watch:{
    searchText: 'fetchBuffets'
  },

  mounted(){
    this.fetchBuffets();
  },

  methods:{
    async fetchBuffets() {
      try {
        const searchQuery = this.searchText ? `?search=${this.searchText}` : '';
        let response = await fetch(`${apiURL}/api/v1/buffets${searchQuery}`);
        let data = await response.json();

        this.listBuffets = data.map(item => ({
          id: item.id,
          brand_name: item.brand_name,
          city: item.city,
          state: item.state
        }));

        if (this.searchText) {
          this.selectedBuffet = null;
        }
      } catch (error) {
        console.error('Erro ao buscar buffets:', error);
      }
    },
    
    async fetchBuffetDetails(buffetId){
      try{
        let response = await fetch(`${apiURL}/api/v1/buffets/${buffetId}`);
        let buffetData = await response.json();
        
        let eventResponse = await fetch(`${apiURL}/api/v1/buffets/${buffetId}/event_types`);
        let eventTypes = await eventResponse.json();

        this.selectedBuffet = {
          ...buffetData,
          event_types: eventTypes
        };
      } catch (error){
        console.error('Erro ao buscar detalhes do buffet:', error);
      }
    },

    clearSelectedBuffet() {
      this.selectedBuffet = null;
      this.showForm = false;
      this.availabilityResponse = null;
    },

    showAvailabilityForm(eventTypeId) {
      this.selectedEventTypeId = eventTypeId;
      this.showForm = true;
      this.availabilityResponse = null;
      const availabilityModal = new bootstrap.Modal(document.getElementById('availabilityModal'));
      availabilityModal.show();
    },

    async checkAvailability() {
      try {
        let response = await fetch(`${apiURL}/api/v1/event_types/${this.selectedEventTypeId}?event_date=${this.availabilityDate}&guest_number=${this.guestNumber}`);
        let data = await response.json();

        this.availabilityResponse = data;
      } catch (error) {
        console.error('Erro ao consultar disponibilidade:', error);
      }
    }
  }
})

app.mount('#app');