export class UiElement {

    DomElement: HTMLElement;

    htmlToElement(html : string) : HTMLElement{
        let template = document.createElement('template'); 
        template.innerHTML = html.trim();
        return <HTMLElement>template.content.firstChild;
    }
}