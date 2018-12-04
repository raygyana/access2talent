import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { QuestionsComponent } from './questions/questions.component';
import { QuestionBankComponent } from './question-bank/question-bank.component';


export const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        children: [

            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'setup'

            },
            {
                path: 'questions',
                pathMatch: 'full',
                component: QuestionsComponent
            },
            {
                path: 'addQuestions',
                pathMatch: 'full',
                component: QuestionBankComponent
            },
        ],

    }

];

const extraOptions: ExtraOptions = {
    enableTracing: false,
    useHash: false
};


export const routing: ModuleWithProviders = RouterModule.forChild(routes);
