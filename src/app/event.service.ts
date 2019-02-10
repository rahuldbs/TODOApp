import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EventData } from './event-data.model';
import { Subject } from "rxjs";
import {map} from 'rxjs/operators';
import { Constants } from './constants';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private events: EventData[] = [];
  private eventsUpdated = new Subject<EventData[]>();

  constructor(private http: HttpClient){}
  getEvents(){
    this.http.get<{"events":any}>(
      Constants.endPoint
    )
    .pipe(map((eventData) => {
      return eventData.events.map( event => {
        return {
          title: event.title,
          description: event.description,
          day: event.day,
          id: event._id
        };
      });
    }))
    .subscribe((transformedPosts) => {
      this.events = transformedPosts;
      this.eventsUpdated.next([...this.events]);
    })

  }

  getUpdatedEventsListener(){
    return this.eventsUpdated.asObservable();
  }

  getEvent(id: string){
    return {...this.events.find(e => e.id === id)} ;
  }

  addEvent(title: string, description: string, day: string){
    const event: EventData = {id: null, title: title, description: description, day: day};
    this.http.post<{message: string, postId: string}>(Constants.endPoint,event)
      .subscribe((responseData) => {
        console.log(responseData.message);
        const id = responseData.postId;
        event.id = id;
        this.events.push(event);
        this.eventsUpdated.next([...this.events]);
      })
  }

  deleteEvent(eventId: string){
    this.http.delete(Constants.endPoint+'/'+eventId )
      .subscribe(()=>{
        const updatedEvents = this.events.filter(event => event.id !== eventId);
        this.events = updatedEvents;
        this.eventsUpdated.next([...this.events]);
      })
  }

  editEvent(eventId: string, title: string, description: string, day: string) {
    const event: EventData = {id: null, title: title, description: description, day: day};
    this.http.put(Constants.endPoint+'/'+eventId, event)
      .subscribe(() => {
        let updatedEvents = this.events.filter(event => event.id !== eventId);
        event.id = eventId;
        updatedEvents.push(event);
        this.events = updatedEvents;
        console.log
        this.eventsUpdated.next([...this.events]);
      })
  }

}
