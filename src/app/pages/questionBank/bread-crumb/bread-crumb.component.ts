import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { BreadCrumbService } from './bread-crumb.services';
import { ActivatedRoute, Router, NavigationEnd, PRIMARY_OUTLET } from '@angular/router';
import { filter, map, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-bread-crumb',
  templateUrl: './bread-crumb.component.html',
  styleUrls: ['./bread-crumb.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BreadCrumbComponent implements OnInit {
  @Input() heading = 'Dashboard';
  @Input() currentHeading = 'Dashboard';

  constructor(private breadCrumbService: BreadCrumbService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {


  }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      distinctUntilChanged()).subscribe(() => {
        // console.log('BreadCrumb subscribe:', this.activatedRoute, this.activatedRoute.root);
        this.breadCrumbData();
      });
    // console.log('BreadCrumb', this.activatedRoute.root, this.activatedRoute);
    this.breadCrumbData();
  }

  breadCrumbData() {
    const ROUTE_DATA_BREADCRUMB: string = "breadcrumb";
    const ROUTE_PARAM_BREADCRUMB: string = "breadcrumb";
    const PREFIX_BREADCRUMB: string = "prefixBreadcrumb";
    // get the root of the current route
    let currentRoute: ActivatedRoute = this.activatedRoute.root;

    // iterate from activated route to children
    while (currentRoute.children.length > 0) {
      let childrenRoutes: ActivatedRoute[] = currentRoute.children;
      let breadCrumbLabel: string = "";

      // iterate over each children
      childrenRoutes.forEach(route => {
        // Set currentRoute to this route
        currentRoute = route;
        // Verify this is the primary route
        if (route.outlet !== PRIMARY_OUTLET) {
          return;
        }

        const hasData = (route.routeConfig && route.routeConfig.data);
        const hasDynamicBreadcrumb: boolean = route.snapshot.params.hasOwnProperty(ROUTE_PARAM_BREADCRUMB);

        if (hasData || hasDynamicBreadcrumb) {
          /*
           Verify the custom data property "breadcrumb"
           is specified on the route or in its parameters.
           Route parameters take precedence over route data
           attributes.
           */
          // console.log('BreadCrumb:breadCrumbData:hasDynamicBreadcrumb:', hasDynamicBreadcrumb);
          // console.log('BreadCrumb:breadCrumbData:route.snapshot:', route.snapshot);
          // console.log('BreadCrumb:breadCrumbData:route.snapshot.data:', route.snapshot.data);

          // If no routeConfig is avalailable we are on the root path
          this.heading = route.snapshot ? route.snapshot.data['breadcrumbHeading'] : 'Dashboard';
          this.currentHeading = route.snapshot ? route.snapshot.data['breadcrumbCurrentHeading'] : 'Dashboard';
          // console.log('BreadCrumb:breadCrumbData:', breadCrumbLabel);
        }

      });

    }
  }
}
