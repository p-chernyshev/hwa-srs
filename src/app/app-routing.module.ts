import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from '../environments/environment';
import { CoursesComponent } from './components/courses/courses.component';

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
        path: '**',
        redirectTo: '',
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: !environment.browser })],
    exports: [RouterModule],
})
export class AppRoutingModule { }
