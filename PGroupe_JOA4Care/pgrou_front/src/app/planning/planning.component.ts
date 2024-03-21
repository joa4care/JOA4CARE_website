import { Component, NgModule } from '@angular/core';
import { CalendarEvent, CalendarModule, CalendarView } from 'angular-calendar';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs';
import { isSameDay, isSameMonth } from 'date-fns';
import { ActivitesService } from 'src/app/shared/activites.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrl: './planning.component.css',
})
export class PlanningComponent {
  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Week;
  CalendarView = CalendarView;
  events: CalendarEvent[] = [];
  activeDayIsOpen = false;
  eventsArray: any[] = [];
  activitesArray: any[] = [];

  constructor(
    private activitesService: ActivitesService,
    private router: Router
  ) {
    this.fetchEvents().subscribe(
      (events) => {
        this.events = events;
        console.log(events)
      },
      (error) => {
        console.error('Erro ao buscar os eventos:', error);
      }
    );
  }

  goToEvent(event: any) {
    const type = this.activitesArray[this.events.indexOf(event)].type;
    this.router.navigate([`/activites/${type}`]);
  }

  fetchEvents() {
    return this.activitesService.fetchActivites().pipe(
      map((activites) => {
        let ac_color = '';
        let ac_secondary = '';
        activites.forEach((activite) => {
          this.activitesArray.push(activite);
          let ac_color: string;
          let ac_secondary: string;

          if (activite.NP_max - activite.NP_inscrit == 0) {
            ac_color = 'red';
            ac_secondary = '#F7CAAC';
          } else if (
            activite.NP_max - activite.NP_inscrit <=
            activite.NP_max / 2
          ) {
            ac_color = 'yellow';
            ac_secondary = '#FFF2CC';
          } else {
            ac_color = 'green';
            ac_secondary = '#E2EFDA';
          }
          const event = {
            title:
              activite.titre +
              '<br>' +
              activite.NP_inscrit +
              '/' +
              activite.NP_max +
              ' inscrits',
            start: new Date(activite.horaire_date_debut),
            end: new Date(activite.horaire_date_fin),
            color: { primary: ac_color, secondary: ac_secondary },
          };
          this.eventsArray.push(event);
        });
        return this.eventsArray;
      })
    );
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen == true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }
}
