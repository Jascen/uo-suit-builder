import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
    selector: '[fileDragDrop]'
})
export class FileDragDropDirective {
    @Output() fileDropped = new EventEmitter<any>();

    @HostBinding('style.opacity') private opacity = '1.0';

    @HostListener('dragover', ['$event']) dragOver(event: any) {
        event.preventDefault();
        event.stopPropagation();
        this.opacity = '0.21';
    }

    @HostListener('dragleave', ['$event']) dragLeave(event: any) {
        event.preventDefault();
        event.stopPropagation();
        this.opacity = '1.0';
    }

    @HostListener('drop', ['$event']) drop(event: any) {
        event.preventDefault();
        event.stopPropagation();
        this.opacity = '1.0';
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            this.fileDropped.emit(files);
        }
    }
}
