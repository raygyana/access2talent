import { Component } from '@angular/core';
import { HostListener } from '@angular/core';
declare var $: any;
// import $ from '@types';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'talent';

  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll(event) {
    console.log('scrooolll', event.target.scrollingElement.scrollTop);
    var scroll = event.target.scrollingElement.scrollTop;
    // if (scroll > 1) {

    //   $('.fixed-top').addClass('menu-bg');
    // } else {
    //   $('.fixed-top').removeClass('menu-bg');
    // }
  }
  ngOnInit() {

    $('.play-video').magnificPopup({
      type: 'iframe',


      iframe: {
        markup: `<div class="mfp-iframe-scaler">
        <div class="mfp-close"></div>
        <iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>
        <div class="mfp-title">Some caption</div>
        </div>`
      },
      callbacks: {
        markupParse: function (template, values, item) {
          values.title = item.el.attr('title');
        }
      }

    });

  }




}
