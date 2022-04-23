import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from '../environments/environment';
import { CourseComponent } from './components/course/course.component';
import { CoursesComponent } from './components/courses/courses.component';
import { ReviewComponent } from './components/review/review.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'courses',
        pathMatch: 'full',
    },
    {
        path: 'courses',
        component: CoursesComponent,
    },
    {
        path: 'courses/:course_id',
        component: CourseComponent,
    },
    {
        path: 'courses/:course_id/review',
        component: ReviewComponent,
    },
    {
        path: '**',
        redirectTo: '',
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: !environment.browser })],
    exports: [RouterModule],
})
export class AppRoutingModule { }
