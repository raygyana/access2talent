import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { LoginComponent } from './login/login.component';
import { routing } from './dashboard.routing';
// import { LoginService } from './login.service';
import { FormsModule } from '@angular/forms';
// import { ProcessModule } from '../process/process.module';
// import { ComponentModule } from '../../component/component.module';
import { TopbarComponent } from './topbar/topbar.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ServiceComponent } from './service/service.component';
import { ContributorsComponent } from './contributors/contributors.component';
import { TrainingComponent } from './training/training.component';
import { ContactComponent } from './contact/contact.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CustomModalPopUpComponent } from '../../../component/custom-modal-pop-up/custom-modal-pop-up.component';
import { CustomModalPopUpService } from '../../../component/custom-modal-pop-up/custom-modal-pop-up.service';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from '../../../services/authentication.service';
import { AlertComponent } from '../../../_directives';
@NgModule({
    imports: [
        CommonModule,
        routing,
        FormsModule,
        ReactiveFormsModule

    ],
    declarations: [
        TopbarComponent,
        HomeComponent,
        AboutComponent,
        ServiceComponent,
        ContributorsComponent,
        TrainingComponent,
        ContactComponent,
        DashboardComponent,
        CustomModalPopUpComponent,
        LoginComponent,
        RegisterComponent,
        AlertComponent
    ],
    providers: [
        CustomModalPopUpService,
        AuthenticationService

    ],
    exports: [
        FormsModule
    ]
})
export class DashboardModule { }
