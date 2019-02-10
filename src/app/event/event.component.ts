import { Component, OnInit } from '@angular/core';
import { Constants } from '../constants';
import { EventService } from '../event.service';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  selectedDay = "";
  selectedEvent = "";
  eventId = ""

  constructor(public eventService: EventService) { 
    let curr = new Date();
    const i = curr.getDay();
    this.selectedDay = Constants.days[i];
  }

  ngOnInit() {
  }

  onSelectedDay(day) {
    console.log("day changed: ", day);
    this.selectedDay = day;
  }

  onAddEvent(form: NgForm) {
    if(form.invalid){
      console.log(form);
      return;
    }
    const desc = form.value.title + "desc";
    console.log("selected event: ", this.selectedEvent)
    console.log('new value: ', form.value.title);
    if (!this.selectedEvent) { // incase of new event
      this.eventService.addEvent(form.value.title, desc, this.selectedDay);
    } else { // incase of edit event
      this.eventService.editEvent(this.eventId, form.value.title, desc, this.selectedDay);
      this.selectedEvent = "";
      this.eventId = "";
    }
    
    form.resetForm();
  }

  onEditEvent(eventData) {
    this.selectedEvent = eventData.title;
    this.eventId = eventData.id;
  }

}
