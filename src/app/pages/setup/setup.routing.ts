import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { SetupComponent } from './setup/setup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AssessmentComponent } from './assessment/assessment.component';
import { QuestionsComponent } from './questions/questions.component';
import { CreateAssessmentComponent } from './create-assessment/create-assessment.component';
import { SetupToolComponent } from './setup-tool/setup-tool.component';
import { ManageOrdersComponent } from './manage-orders/manage-orders.component';
import { TalentAssessmentTestComponent } from './talent-assessment-test/talent-assessment-test.component';

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
                path: 'setup',
                component: SetupComponent

            },
            {
                path: 'assessment',
                component: AssessmentComponent

            },
            {
                path: 'questions',
                pathMatch: 'full',
                component: QuestionsComponent

            },
            {
                path: 'create_assessment',
                component: CreateAssessmentComponent

            },
            {
                path: 'setup_tool',
                component: SetupToolComponent

            }, {
                path: 'manage_orders',
                component: ManageOrdersComponent

            },
            {
                path: 'assessment_test',
                component: TalentAssessmentTestComponent

            },
        ],

    }

];

const extraOptions: ExtraOptions = {
    enableTracing: false,
    useHash: false
};


export const routing: ModuleWithProviders = RouterModule.forChild(routes);
