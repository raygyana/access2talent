import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './setup.routing';
import { FormsModule } from '@angular/forms';
import { TopbarComponent } from './topbar/topbar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CustomModalPopUpService } from '../../../component/custom-modal-pop-up/custom-modal-pop-up.service';
import { SetupComponent } from './setup/setup.component';
import { AssessmentComponent } from './assessment/assessment.component';
import { QuestionsComponent } from './questions/questions.component';
import { CreateAssessmentComponent } from './create-assessment/create-assessment.component';
import { SetupToolComponent } from './setup-tool/setup-tool.component';
import { ManageOrdersComponent } from './manage-orders/manage-orders.component';
import { TalentAssessmentTestComponent } from './talent-assessment-test/talent-assessment-test.component';
@NgModule({
    imports: [
        CommonModule,
        routing,
        FormsModule,

    ],
    declarations: [
        TopbarComponent,
        DashboardComponent,
        SetupComponent,
        AssessmentComponent,
        QuestionsComponent,
        CreateAssessmentComponent,
        SetupToolComponent,
        ManageOrdersComponent,
        TalentAssessmentTestComponent
    ],
    providers: [
        CustomModalPopUpService

    ],
    exports: [
        FormsModule
    ]
})
export class SetupModule { }
