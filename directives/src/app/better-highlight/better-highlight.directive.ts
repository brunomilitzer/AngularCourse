import {Directive, ElementRef, HostBinding, HostListener, Input, OnInit, Renderer2} from '@angular/core';

@Directive({
  selector: '[appBetterHighlight]'
})
export class BetterHighlightDirective implements OnInit{
  @Input() defaultColor = 'transparent';
  @Input('appBetterHighlight') highlightColor = 'blue';
  @HostBinding('style.backgroundColor') backgroundColor;

  constructor(private elRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    /*this.renderer.setStyle(this.elRef.nativeElement, 'background-color', 'blue');*/
    this.renderer.setStyle(this.elRef.nativeElement, 'color', 'red');
    this.backgroundColor = this.defaultColor;
  }

  @HostListener('mouseenter') onmouseover(eventData: Event): void {
    this.renderer.setStyle(this.elRef.nativeElement, 'color', 'red');
    this.backgroundColor = this.defaultColor;
  }

  @HostListener('mouseleave') onmouseleave(eventData: Event): void {
    this.renderer.setStyle(this.elRef.nativeElement, 'color', 'black');
    this.backgroundColor = this.highlightColor;
  }
}
