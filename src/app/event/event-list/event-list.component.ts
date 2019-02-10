import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { EventData } from 'src/app/event-data.model';
import { Constants } from 'src/app/constants';
import { EventService } from 'src/app/event.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {

  @Output('dayChange') dayChange = new EventEmitter();
  @Output('eventEdit') eventEdit = new EventEmitter();
  @Input('selectedDay') selectedDay: string;

  days = Constants.days;
  
  myEvents = {};
  // selectedDay = "";
  events: EventData[] = [];
  eventSubs: Subscription;

  constructor(public eventService: EventService) {
    
  }

  ngOnInit() {
    this.eventService.getEvents();
    this.eventSubs = this.eventService.getUpdatedEventsListener().subscribe((events: EventData[])=>{
      this.events = events;
      this.myEvents = this.filterData(events);
      console.log("events data: ", this.myEvents);
    })
  }

  filterData(data) {
    let groups = Object.create(null);

    data.forEach(item => {
      if (!groups[item.day]) {
        groups[item.day] = [];
      }

      groups[item.day].push({
        item
      });
    });

    // let result =
    //   Object.entries(groups)
    //     .map(([k, v]) => ({ [k]: v }));
    console.log("events: ", groups);
    return groups;
  }

  onDeleteEvent(eventId: string){
    this.eventService.deleteEvent(eventId);
  }

  onEditEvent(eventData: EventData) {
    this.eventEdit.emit(eventData);
  }

  ngOnDestroy(){
    this.eventSubs.unsubscribe();
  }
  selectADay = function(day){
    this.selectedDay = day;
    this.dayChange.emit(day);
  }
  isSelected = function(day){
    return this.selectedDay === day;

  }

}
