const daysInWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const years = [2020, 2021, 2022, 2023, 2024, 2025]
const events = [
    { text: 'text1', date: '2021-03-1', day: 1, month: 2, year: 2021, time: '01:00', details: 'detail 1'},
    { text: 'text2', date: '2021-03-2', day: 2, month: 2, year: 2021, time: '02:00', details: 'detail 2'},
    { text: 'text3', date: '2021-03-3', day: 3, month: 2, year: 2021, time: '03:00', details: 'detail 3'},
    { text: 'text4', date: '2021-03-4', day: 4, month: 2, year: 2021, time: '04:00', details: 'detail 4'},
    { text: 'text5', date: '2021-03-5', day: 5, month: 2, year: 2021, time: '05:00', details: 'detail 5'},
    { text: 'text6', date: '2021-03-6', day: 6, month: 2, year: 2021, time: '06:00', details: 'detail 6'},
    { text: 'text7', date: '2021-03-7', day: 7, month: 2, year: 2021, time: '07:00', details: 'detail 7'},
    { text: 'text8', date: '2021-03-8', day: 8, month: 2, year: 2021, time: '08:00', details: 'detail 8'},
]


Vue.component('day', {
    props: ['day', 'month', 'year'],
    computed: {
        events: function () {
            return this.$root.events.filter(event => {
                return  event.day === this.day && 
                        event.month === this.month && 
                        event.year === this.year
            })
        },
        isToday: function () {
            if( this.day === this.$root.today.day &&
                this.month === this.$root.today.month &&
                this.year === this.$root.today.year) {
                return true
            }
        },
    },
    methods: {
        indexCheck: function(i){
            // console.log(this.indexClicked)
            this.$emit('indexglobal', i)
            
        },
        updateEvent: function (event) {

            console.log('update clicked')
            
            console.log(this.$root.events[this.$root.myEventIndex])
            
            this.$root.events[this.$root.myEventIndex].day  = Number(this.$root.events[this.$root.myEventIndex].date.slice(8))
            this.$root.events[this.$root.myEventIndex].month = Number(this.$root.events[this.$root.myEventIndex].date.slice(5, 7) - 1)
            this.$root.events[this.$root.myEventIndex].year = Number(this.$root.events[this.$root.myEventIndex].date.slice(0, 4))
            
        },
        trash: function () {
            this.$root.events.splice(this.$root.myEventIndex, 1)
            this.$root.myEventIndex = ''
        }
    },
    template: `
    <div class="day" :class="{ 'highlightToday': isToday }">{{ day }}
        <div  @click="indexCheck(event)"  :id="'event' + event.year + event.month + event.day + event.time" v-for='(event,index) in events' :key="index" class="events" v-b-modal="'modify' + event.year + event.month + event.day + event.time">
            {{ event.time.slice(0, 5) }} {{event.text}}
            <b-modal :id="'modify' + event.year + event.month + event.day + event.time" title="See Event" hide-footer centered>
            <b-form >
                <!-- event text area -->
                <b-form-input  type="text" placeholder="Event" v-model="event.text" required></b-form-input>
                <br>
                <!-- event time selector -->
                <b-form-timepicker  class="mb-2" v-model="event.time" required></b-form-timepicker>
                <br>
                <!-- event date selector -->
                <b-form-datepicker  class="mb-2" v-model="event.date" required></b-form-datepicker>
                <br>
                <!-- event details area -->
                <b-form-textarea  placeholder="Details" v-model="event.details" rows="3" max-rows="3" required></b-form-textarea>
                <br>
                <!-- add event button -->
                <b-button @click="updateEvent()">Update Event</b-button>
                <b-button @click="trash()">Delete</b-button> 
            </b-form>
        </b-modal>
        </div>
    </div>
    `
})

const app = new Vue ({
    el: '#app',
    data: {
        daysInWeek: daysInWeek,
        months: months,
        years: years,
        selected: {
            month: new Date().getMonth(),
            year: new Date().getFullYear()
        },
        // binded with add new event
        newEvent:{
            text: '',
            date:'',
            time: '',
            details: '',
        },
        myEventIndex: '',
        // updateEventData:{
        //     text: '',
        //     date:'',
        //     day: '',
        //     month: '',
        //     year: '',
        //     time: '',
        //     details: '',
        // },
        events: events,
        today: {
            day: new Date().getDate(),
            month: new Date().getMonth(),
            year: new Date().getFullYear()
        },
        // sss: today.year.toString() + today.month.toString() + today.day.toString()
    },
    mounted: function () {
        const items = localStorage.getItem('events')
        if (items) {
          this.events = JSON.parse(items)
        }
    },
    methods: {
        indexGlobal: function(i) {
            console.log(' root event index clicked')
            console.log(i)
            console.log(this.events.indexOf(i))
            this.myEventIndex = this.events.indexOf(i)
        },
        addEvent: function (item) {
            // capitalize the first letter input
            var newEvent = {
                text: this.newEvent.text,
                date: this.newEvent.date,
                day: Number(this.newEvent.date.slice(8)),
                month: Number(this.newEvent.date.slice(5, 7) - 1),
                year: Number(this.newEvent.date.slice(0, 4)),
                time: this.newEvent.time,
                details: this.newEvent.details
            }
            this.events.push(newEvent)
            this.newEvent.text = ''
            this.newEvent.date = ''
            this.newEvent.time = ''
            this.newEvent.details =''
        }
    },
    computed: {
        daysInMonth: function () {
            const date = new Date(this.selected.year, this.selected.month + 1, 0).getDate()
            return date
        },
        startDay: function () {
            const date = new Date(this.selected.year, this.selected.month, 1).getDay()
            return date
        }
    },
    watch: {
        // events: function () {
        //     localStorage.setItem('events', JSON.stringify(this.events))
        // }

        events: {
            handler() {
                localStorage.setItem('events', JSON.stringify(this.events))
            },
            deep:true
        }
    }
})
