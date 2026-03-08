---
title: Usage with Angular
---

## Usage with Angular

HTMLGraph can be used with any frontend framework.

The main scenario is when you want to have component nodes managed by framework.

In case of angular this is how you can create component node:

{{< code lang="javascript" >}}
import {
  ApplicationRef,
  createComponent,
  inject,
  Injectable,
  Injector,
  inputBinding,
  ViewRef,
} from '@angular/core';
import { Canvas, CanvasBuilder, Identifier } from '@html-graph/html-graph';
import { GraphNode } from './graph-node'; // Angular component for a node

@Injectable()
export class HtmlGraphAdapter {
  private canvas!: Canvas;

  private readonly appRef = inject(ApplicationRef);

  private readonly injector = inject(Injector);

  init(element: HTMLElement): void {
    this.canvas = new CanvasBuilder(element)
      .build();
  }

  destroy(): void {
    this.canvas.destroy();
  }

  addNode(id: Identifier): void {
    const nodeElement = document.createElement('div');
    const nodeComponent = createComponent(GraphNode, {
      environmentInjector: this.appRef.injector,
      hostElement: nodeElement,
      elementInjector: this.injector,
      bindings: [inputBinding('id', () => id), inputBinding('name', () => `Node ${id}`)],
    });

    this.appRef.attachView(nodeComponent.hostView);

    this.canvas.addNode({
      id,
      element: nodeElement,
      ports: [
        { id: `port-${id}-in`, element: nodeComponent.instance.portIn.nativeElement },
        { id: `port-${id}-out`, element: nodeComponent.instance.portOut.nativeElement },
      ],
    });
  }

  removeNode(nodeId: Identifier): void {
    this.canvas.removeNode(nodeId);
  }
}
{{< /code >}}

And the component:


{{< code lang="javascript" >}}
@Component({
  selector: 'app-graph-node',
  imports: [AsyncPipe],
  templateUrl: './graph-node.html',
  styleUrl: './graph-node.less',
})
export class GraphNode implements AfterViewInit {
  @ViewChild('portIn', { static: true })
  portIn!: ElementRef;

  @ViewChild('portOut', { static: true })
  portOut!: ElementRef;

  @Input({ required: true })
  nodeId: number;

  @Input({ required: true })
  name!: string;

  ngAfterViewInit(): void {
    this.canvas.updateNode(this.nodeId);
  }
}
{{< /code >}}
