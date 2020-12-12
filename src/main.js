import { createApp } from 'vue'
import App from './App.vue'

// Prime Vue
import Sidebar from 'primevue/sidebar';
import Menu from 'primevue/menu';
import Fieldset from 'primevue/fieldset';
import ProgressBar from 'primevue/progressbar';
import ToastService from 'primevue/toastservice';
import AutoComplete from 'primevue/autocomplete';
import Chart from 'primevue/chart';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';     //optional for column grouping

const app = createApp(App)

app.use(ToastService);

app.component('ProgressBar', ProgressBar);
app.component('Sidebar', Sidebar);
app.component('Menu', Menu);
app.component('Fieldset', Fieldset);
app.component('AutoComplete', AutoComplete);
app.component('Chart', Chart);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('ColumnGroup', ColumnGroup);


app.mount('#app')

