---
title: Usage with Angular
---

## Usage with Angular

HTMLGraph can be used with any frontend framework.
The common scenario is when you want node component to be reactive, thus be
managed by the framework itself.

This <b><a href="https://html-graph.github.io/html-graph-angular-demo/" target="_blank">Demo</a></b> uses Angular components as graph nodes.

<a href="https://html-graph.github.io/html-graph-angular-demo/" target="_blank" aria-label="Angular Demo">
  <div class="video">
    <video autoplay muted loop>
      <source src="/media/angular-demo.webm">
    </video>
  </div>
</a>

You can check out the <b><a href="https://github.com/html-graph/html-graph-angular-demo/" target="_blank">source code</a></b> to get a general idea of how to manage graph using Angular. The same approach can be used with other frameworks.

This is a minimalistic working example of an angular node component:


{{< code lang="typescript" >}}
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  template: `
    <div #portIn></div>

    <div class="name">
      {{ name }}
    </div>

    <div #portOut></div>
  `,
  styles: `
    :host {
      display: flex;
      align-items: center;
      min-width: 250px;
      min-height: 50px;
      user-select: none;
      background: #daedbd;
    }

    .name {
      flex-grow: 1;
      padding: 0.5rem;
    }
  `,
})
export class GraphNodeShape implements AfterViewInit {
  @ViewChild('portIn', { static: true })
  portIn!: ElementRef;

  @ViewChild('portOut', { static: true })
  portOut!: ElementRef;

  @Input({ required: true })
  name!: string;

  @Output()
  readonly viewInitialized = new EventEmitter<void>();

  ngAfterViewInit(): void {
    this.viewInitialized.emit();
  }
}
{{< /code >}}

It is recommended that you implement an adapter specific to your application
that creates nodes with Angular components and ensures there are no memory leaks.

This is a good example of such adapter:

{{< code lang="typescript" >}}
import {
  ApplicationRef,
  createComponent,
  inject,
  Injectable,
  Injector,
  inputBinding,
  outputBinding,
  ViewRef,
} from '@angular/core';
import { Canvas, CanvasBuilder, Identifier } from '@html-graph/html-graph';
import { GraphNodeShape } from './graph-node-shape'; // Your Angular component for a node

@Injectable()
export class CanvasAdapter {
  private canvas!: Canvas;

  private readonly appRef = inject(ApplicationRef);

  private readonly injector = inject(Injector);

  private readonly viewRefs = new Map<Identifier, ViewRef>();

  init(element: HTMLElement): void {
    this.canvas = new CanvasBuilder(element).build();

    this.canvas.graph.onBeforeNodeRemoved.subscribe((nodeId) => {
      const viewRef = this.viewRefs.get(nodeId)!;

      viewRef.destroy();

      this.viewRefs.delete(nodeId);
    });

    this.canvas.graph.onBeforeClear.subscribe(() => {
      this.reset();
    });

    this.canvas.onBeforeDestroy.subscribe(() => {
      this.reset();
    });
  }

  addNode(params: { id: string, x: number, y: number }): void {
    const { id, x, y } = params;

    const nodeElement = document.createElement('div');
    const nodeComponent = createComponent(GraphNodeShape, {
      environmentInjector: this.appRef.injector,
      hostElement: nodeElement,
      elementInjector: this.injector,
      bindings: [
        inputBinding('name', () => `Node ${id}`),
        outputBinding('viewInitialized', () => {
          // Node must be updated manually on ngAfterViewInit lifecycle event trigger
          this.canvas.updateNode(id);
          // Alternatively, you could opt-in to enabling "Node Resize Reactive Edges" feature
        }),
      ],
    });

    const { hostView, instance } = nodeComponent;

    // Makes the node component reactive
    this.appRef.attachView(hostView);
    this.viewRefs.set(id, hostView);

    this.canvas.addNode({
      id,
      element: nodeElement,
      x,
      y,
      ports: [
        { id: `port-${id}-in`, element: instance.portIn.nativeElement },
        { id: `port-${id}-out`, element: instance.portOut.nativeElement },
      ],
    });
  }

  addEdge(params: { from: string, to: string }): void {
    this.canvas.addEdge({ from: params.from, to: params.to });
  }

  // Other application-specific methods for managing graph
  // ...

  removeNode(nodeId: string): void {
    this.canvas.removeNode(nodeId);
  }

  removeEdge(edgeId: string): void {
    this.canvas.removeEdge(edgeId);
  }

  clear(): void {
    this.canvas.clear();
  }

  destroy(): void {
    this.canvas.destroy();
  }

  private reset(): void {
    this.viewRefs.forEach((viewRef) => {
      viewRef.destroy();
    });

    this.viewRefs.clear();
  }
}
{{< /code >}}
