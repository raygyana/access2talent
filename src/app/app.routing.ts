import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
export const routes: Routes = [
    {
        path: '',
        // canActivate: [LoginGuard],
        pathMatch: 'full',
        redirectTo: 'dashboard'

    },
    {
        path: 'dashboard',
        // canActivate: [LoginGuard],
        loadChildren: './pages/dashboard/dashboard.module#DashboardModule'

    },
    {
        path: 'setup',
        loadChildren: './pages/setup/setup.module#SetupModule'
        // canActivate: [AuthGuard]
    },
    {
        path: 'questionBank',
        loadChildren: './pages/questionBank/questionBank.module#QuestionBankModule'
        // canActivate: [AuthGuard]
    }
];

const extraOptions: ExtraOptions = {
    enableTracing: false,
    useHash: false
};


export const routing: ModuleWithProviders = RouterModule.forRoot(routes, extraOptions);
