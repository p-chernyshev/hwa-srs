import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoursesComponent } from './components/courses/courses.component';
import { CourseEditDialogComponent } from './components/course-edit-dialog/course-edit-dialog.component';
import { CourseComponent } from './components/course/course.component';
import { CardEditDialogComponent } from './components/card-edit-dialog/card-edit-dialog.component';
import { CardTypeEditDialogComponent } from './components/card-type-edit-dialog/card-type-edit-dialog.component';
import { ReviewComponent } from './components/review/review.component';
import { CardProgressService } from './services/card-progress.service';
import { CardTypesService } from './services/card-types.service';
import { CardsService } from './services/cards.service';
import { CoursesService } from './services/courses.service';
import { CardProgressHttpService } from './services/http/card-progress-http.service';
import { CardTypesHttpService } from './services/http/card-types-http.service';
import { CardsHttpService } from './services/http/cards-http.service';
import { CoursesHttpService } from './services/http/courses-http.service';
import { CardProgressLocalService } from './services/local/card-progress-local.service';
import { CardTypesLocalService } from './services/local/card-types-local.service';
import { CardsLocalService } from './services/local/cards-local.service';
import { CoursesLocalService } from './services/local/courses-local.service';

@NgModule({
    declarations: [
        AppComponent,
        CoursesComponent,
        CourseEditDialogComponent,
        CourseComponent,
        CardEditDialogComponent,
        CardTypeEditDialogComponent,
        ReviewComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatListModule,
        MatBadgeModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatMenuModule,
        MatToolbarModule,
        MatSelectModule,
        MatCheckboxModule,
        MatCardModule,
        MatSliderModule,
    ],
    providers: [
        {
            provide: CardProgressService,
            useClass: environment.browser
                ? CardProgressHttpService
                : CardProgressLocalService,
        },
        {
            provide: CardTypesService,
            useClass: environment.browser
                ? CardTypesHttpService
                : CardTypesLocalService,
        },
        {
            provide: CardsService,
            useClass: environment.browser
                ? CardsHttpService
                : CardsLocalService,
        },
        {
            provide: CoursesService,
            useClass: environment.browser
                ? CoursesHttpService
                : CoursesLocalService,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
