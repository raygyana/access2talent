import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { ContributorsComponent } from './contributors/contributors.component';

import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';
import { ServiceComponent } from './service/service.component';
import { TrainingComponent } from './training/training.component';
import { AboutComponent } from './about/about.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisterComponent } from './register/register.component';




export const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        children: [

            {
                path: '',
                // canActivate: [LoginGuard],
                pathMatch: 'full',
                // component: HomeComponent,
                redirectTo: 'home'

            },
            {
                path: 'home',
                // canActivate: [LoginGuard],
                // pathMatch: 'full',
                component: HomeComponent

            },
            {
                path: 'contact',
                // canActivate: [LoginGuard],
                // pathMatch: 'full',
                component: ContactComponent

            },
            {
                path: 'services',
                // canActivate: [LoginGuard],
                pathMatch: 'full',
                component: ServiceComponent

            },
            {
                path: 'training',
                // canActivate: [LoginGuard],
                // pathMatch: 'full',
                component: TrainingComponent

            },
            {
                path: 'about',
                // canActivate: [LoginGuard],
                // pathMatch: 'full',
                component: AboutComponent

            }, {
                path: 'contributors',
                // canActivate: [LoginGuard],
                // pathMatch: 'full',
                component: ContributorsComponent

            },
            {
                path: 'register',
                // canActivate: [LoginGuard],
                // pathMatch: 'full',
                component: RegisterComponent

            },

        ],

    }

];

const extraOptions: ExtraOptions = {
    enableTracing: false,
    useHash: false
};


export const routing: ModuleWithProviders = RouterModule.forChild(routes);
