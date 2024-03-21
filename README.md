# PgrouFront

The JOA4CARE website is the work of students from the école centrale nantes in information systems course and aims to produce an interactive website to control activities carried out in hospitals.

The framework chosen was Angular.

The database used is managed by Firebase.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.0.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Deployment

Run `firebase deploy` after `ng build` to deploy the project

# Databse structure

## Authentication

file path of users [./authentification/user.model.ts]

Authentication requires:
email
password
id

## Realtime Database

### activites

 file path [./activites/activite.model.ts]


  type: string;
  date: string;
  titre: string; --> [Title]
  description: string;
  horaire_debut: string; --> [Time]
  horaire_fin: string;   --> [Time]
  horaire_date_debut: string; -->  [Date_+_Time]
  horaire_date_fin: string;   -->  [Date_+_Time]
  id?: string;  -->  [key]
  NP_max: number; --> [maximun_number_of_people]
  NP_inscrit: number; --> [number_of_subscribers]
  prix: number;
  imgURL: string;
  status: string;
  rating: number;

### users

Data is taken from firebase authentication
file path [./authentification/users.db.model]

  email: string;
  photo: string; --> [avatar_photo_path]
  role: string; --> [Normal_or_Admin]
  uid: string; --> [./authentification/user.model__id]
  id?: string; --> [Key]
  listeActivites: string[]; -->[list_of_activites]

listeActivites

comment --> [comments_from_journal]
rate --> [rating_from_journal]
status --> [status_NOT_USED_YET]
titre --> [Title]
id? --> [same_Key_of_activites]

## Storage

Storage keeps the images for the activities (the avatar images are in [./assets/figures])

## Hosting

Deals with website hosting. Use `firebase deploy` for deployment. Do not forget to use `ng build` before deployment.

